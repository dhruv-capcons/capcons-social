import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_CONFIG } from './lib/auth/cookies';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/sign-up',
  '/forgot-password',
  '/forgot-password/verify-otp',
  '/forgot-password/reset',
  '/verify',
  '/api/auth/session',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/api/auth/verify',
];

// Auth routes (redirect to dashboard if already authenticated)
const AUTH_ROUTES = [
  '/login',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
];

/**
 * Decode JWT token to check expiration
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (!payload.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  const accessTokenCookie = request.cookies.get(COOKIE_CONFIG.ACCESS_TOKEN.name);
  const refreshTokenCookie = request.cookies.get(COOKIE_CONFIG.REFRESH_TOKEN.name);

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  const isAuthRoute = AUTH_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Determine authentication status
  const hasAccessToken = !!accessTokenCookie?.value;
  const hasRefreshToken = !!refreshTokenCookie?.value;
  const isAccessTokenExpired = hasAccessToken ? isTokenExpired(accessTokenCookie.value) : true;
  const isRefreshTokenExpired = hasRefreshToken ? isTokenExpired(refreshTokenCookie.value) : true;

  // User is authenticated if they have a valid access token OR valid refresh token
  const isAuthenticated = (hasAccessToken && !isAccessTokenExpired) || (hasRefreshToken && !isRefreshTokenExpired);

  // If authenticated and trying to access auth pages, redirect to onboarding
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/user-details', request.url));
  }

  // If trying to access protected route
  if (!isPublicRoute) {
    // No tokens at all - redirect to login
    if (!hasAccessToken && !hasRefreshToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Access token expired but refresh token valid - attempt refresh
    if (isAccessTokenExpired && !isRefreshTokenExpired) {
      try {
        // Call refresh endpoint server-side
        const refreshResponse = await fetch(new URL('/api/auth/refresh', request.url).toString(), {
          method: 'POST',
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
        });

        if (refreshResponse.ok) {
          // Token refreshed successfully - continue with new cookies
          const response = NextResponse.next();
          
          // Copy cookies from refresh response
          refreshResponse.headers.forEach((value, key) => {
            if (key === 'set-cookie') {
              response.headers.set(key, value);
            }
          });
          
          return response;
        } else {
          // Refresh failed - redirect to login
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(loginUrl);
        }
      } catch {
        // Refresh request failed - redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Both tokens expired - redirect to login
    if (isAccessTokenExpired && isRefreshTokenExpired) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)',
  ],
};

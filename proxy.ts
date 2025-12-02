import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_CONFIG } from "./lib/auth/cookies";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/sign-up",
  "/forgot-password",
  "/forgot-password/verify-otp",
  "/forgot-password/reset",
  "/verify",
  "/api/auth/session",
  "/api/auth/logout",
  "/api/auth/refresh",
  "/api/auth/verify",
  "/onboarding",
  "/user-details",
];

// Auth routes
const AUTH_ROUTES = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

// Routes that require completed onboarding
// const PROTECTED_ROUTES = [
//   '/feed',
//   '/explore',
//   '/notifications',
//   '/messages',
//   '/bookmarks',
//   '/lists',
//   '/profile',
//   '/more',
//   '/welcome',
// ];

// // Routes that should be accessible during onboarding
// const ONBOARDING_ROUTES = [
//   '/user-details',
//   '/onboarding',
// ];

interface UserDetails {
  userslug: string;
  dob: string;
  description: string;
  pfp_url?: string;
  interests?: string[];
  color_card_id?: string;
  onboarding_step: number;
}

/**
 * Decode JWT token to check expiration
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    if (!payload.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

function hasSeenWelcomePage(request: NextRequest): boolean {
  const welcomeCookie = request.cookies.get("has_seen_welcome");
  return welcomeCookie?.value === "true";
}

/**
 * Mark welcome page as seen (set a cookie)
 */
function markWelcomePageAsSeen(response: NextResponse): NextResponse {
  response.cookies.set({
    name: "has_seen_welcome",
    value: "true",
    path: "/",
    maxAge: 365 * 24 * 60 * 60, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return response;
}

/**
 * Fetch user details from API (server-side)
 */
async function fetchUserDetails(
  request: NextRequest
): Promise<UserDetails | null> {
  console.log("[PROXY] Fetching user details from API...");
  try {
    const userDetailsUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/userdetails`;

    const response = await fetch(userDetailsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    console.log("User Details Response Status:", response);
    console.log("[PROXY] API Response status:", response.status);

    if (!response.ok) {
      console.log("[PROXY] API call failed");
      return null;
    }

    const data = await response.json();
    console.log("[PROXY] User details fetched:", {
      hasSlug: !!data.data?.userslug,
      hasDob: !!data.data?.dob,
      hasDescription: !!data.data?.description,
      onboardingStep: data.data?.onboarding_step,
    });

    return data.data;
  } catch (error) {
    console.error("[PROXY] Error fetching user details:", error);
    return null;
  }
}

/**
 * Determine the correct redirect path based on user details
 */
function determineRedirectPath(
  userDetails: UserDetails,
  currentPath: string,
  request: NextRequest
): string | null {
  const {
    userslug,
    dob,
    description,
    pfp_url,
    interests,
    color_card_id,
    onboarding_step,
  } = userDetails;

  // If user is on an auth route, they should be redirected
  const isOnAuthRoute = AUTH_ROUTES.some(
    (route) => currentPath === route || currentPath.startsWith(route + "/")
  );

  // Step 1: Check if basic details are missing
  if (!userslug || !dob || !description) {
    // Only redirect if not already on user-details page
    if (!currentPath.startsWith("/user-details")) {
      return "/user-details";
    }
    return null;
  }

  // Step 2: Check onboarding steps
  if (onboarding_step < 4) {
    // Determine the correct onboarding step
    let targetStep = 1;
    if (pfp_url) targetStep = 2;
    if (pfp_url && interests && interests.length > 0) targetStep = 3;
    if (pfp_url && interests && interests.length > 0 && color_card_id)
      targetStep = 4;

    // If user has completed step 3 (has color) but not yet step 4
    if (targetStep === 3 && color_card_id) {
      // User just selected color - should go to welcome page
      const hasSeenWelcome = hasSeenWelcomePage(request);

      // If hasn't seen welcome page and not already on it, go to welcome
      if (!hasSeenWelcome && currentPath !== "/welcome") {
        return "/welcome";
      }

      // If has seen welcome page, mark onboarding as complete (step 4)
      // and redirect to feed
      if (hasSeenWelcome) {
        return "/feed";
      }

      return null;
    }

    // For other onboarding steps
    if (targetStep < 4) {
      // Only redirect if not already on the correct onboarding step
      if (
        currentPath !== `/onboarding` &&
        !currentPath.startsWith("/onboarding?")
      ) {
        return `/onboarding?step=${targetStep}`;
      }
      return null;
    }
  }

  // Step 3: User has completed everything (onboarding_step >= 4)
  if (onboarding_step >= 4) {
    // If user is on onboarding or user-details pages, redirect to feed
    if (
      currentPath.startsWith("/user-details") ||
      currentPath.startsWith("/onboarding") ||
      currentPath === "/welcome"
    ) {
      return "/feed";
    }

    // If user is on an auth route, redirect to feed
    if (isOnAuthRoute) {
      return "/feed";
    }
  }

  return null;
}

/**
 * Handle authenticated user routing
 */
async function handleAuthenticatedUser(
  request: NextRequest
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Fetch user details
  const userDetails = await fetchUserDetails(request);

  if (!userDetails) {
    // If we can't fetch user details, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Determine if user needs to be redirected
  const redirectPath = determineRedirectPath(userDetails, pathname, request);

  if (redirectPath) {
    // Don't redirect if already on the correct path
    if (
      pathname !== redirectPath &&
      !pathname.startsWith(redirectPath.split("?")[0])
    ) {
      // If redirecting TO welcome page, we should mark it as seen
      let response = NextResponse.redirect(new URL(redirectPath, request.url));

      // If going to welcome page, mark it as seen
      if (redirectPath === "/welcome") {
        response = markWelcomePageAsSeen(response);
      }

      return response;
    }
  }

  // If user is currently ON the welcome page, mark it as seen
  if (pathname === "/welcome") {
    const response = NextResponse.next();
    return markWelcomePageAsSeen(response);
  }

  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  console.log(`[PROXY] Request path: ${request.nextUrl.pathname}`);
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // files with extensions
  ) {
    return NextResponse.next();
  }

  // Skip API routes (except auth)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const accessTokenCookie = request.cookies.get(
    COOKIE_CONFIG.ACCESS_TOKEN.name
  );
  const refreshTokenCookie = request.cookies.get(
    COOKIE_CONFIG.REFRESH_TOKEN.name
  );

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Determine authentication status
  const hasAccessToken = !!accessTokenCookie?.value;
  const hasRefreshToken = !!refreshTokenCookie?.value;
  const isAccessTokenExpired = hasAccessToken
    ? isTokenExpired(accessTokenCookie.value)
    : true;
  const isRefreshTokenExpired = hasRefreshToken
    ? isTokenExpired(refreshTokenCookie.value)
    : true;

  // User is authenticated if they have a valid access token OR valid refresh token
  const isAuthenticated =
    (hasAccessToken && !isAccessTokenExpired) ||
    (hasRefreshToken && !isRefreshTokenExpired);

  // If authenticated and trying to access auth pages, handle routing based on user details
  if (isAuthenticated && isAuthRoute) {
    return await handleAuthenticatedUser(request);
  }

  // If trying to access protected route
  if (
    !isPublicRoute &&
    !pathname.startsWith("/onboarding") &&
    !pathname.startsWith("/user-details")
  ) {
    // No tokens at all - redirect to login
    if (!hasAccessToken && !hasRefreshToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Access token expired but refresh token valid - attempt refresh
    if (isAccessTokenExpired && !isRefreshTokenExpired) {
      try {
        // Call refresh endpoint server-side
        const refreshResponse = await fetch(
          new URL("/api/auth/refresh", request.url).toString(),
          {
            method: "POST",
            headers: {
              Cookie: request.headers.get("cookie") || "",
            },
          }
        );

        if (refreshResponse.ok) {
          // Token refreshed successfully - now check user details
          const response = NextResponse.next();

          // Copy cookies from refresh response
          refreshResponse.headers.forEach((value, key) => {
            if (key === "set-cookie") {
              response.headers.set(key, value);
            }
          });

          // After successful refresh, check user details
          const userDetails = await fetchUserDetails(request);
          if (userDetails) {
            const redirectPath = determineRedirectPath(
              userDetails,
              pathname,
              request
            );
            if (
              redirectPath &&
              pathname !== redirectPath &&
              !pathname.startsWith(redirectPath.split("?")[0])
            ) {
              // If redirecting TO welcome page, mark it as seen
              let response = NextResponse.redirect(
                new URL(redirectPath, request.url)
              );

              // If going to welcome page, mark it as seen
              if (redirectPath === "/welcome") {
                response = markWelcomePageAsSeen(response);
              }

              return response;
            }
          }

          return response;
        } else {
          // Refresh failed - redirect to login
          const loginUrl = new URL("/login", request.url);
          loginUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(loginUrl);
        }
      } catch {
        // Refresh request failed - redirect to login
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Both tokens expired - redirect to login
    if (isAccessTokenExpired && isRefreshTokenExpired) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated - check user details for protected routes
    if (isAuthenticated) {
      const userDetails = await fetchUserDetails(request);
      if (userDetails) {
        const redirectPath = determineRedirectPath(
          userDetails,
          pathname,
          request
        );
        if (
          redirectPath &&
          pathname !== redirectPath &&
          !pathname.startsWith(redirectPath.split("?")[0])
        ) {
          // If redirecting TO welcome page, mark it as seen
          let response = NextResponse.redirect(
            new URL(redirectPath, request.url)
          );

          // If going to welcome page, mark it as seen
          if (redirectPath === "/welcome") {
            response = markWelcomePageAsSeen(response);
          }

          return response;
        }
      }
    }
  }

  // If authenticated and accessing public routes (except auth), check if should redirect
  if (isAuthenticated && !isAuthRoute && isPublicRoute && pathname !== "/") {
    const userDetails = await fetchUserDetails(request);
    if (userDetails) {
      const redirectPath = determineRedirectPath(
        userDetails,
        pathname,
        request
      );
      if (
        redirectPath &&
        pathname !== redirectPath &&
        !pathname.startsWith(redirectPath.split("?")[0])
      ) {
        // If redirecting TO welcome page, mark it as seen
        let response = NextResponse.redirect(
          new URL(redirectPath, request.url)
        );

        // If going to welcome page, mark it as seen
        if (redirectPath === "/welcome") {
          response = markWelcomePageAsSeen(response);
        }

        return response;
      }
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
     * - api routes (except auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/(?!auth)).*)",
  ],
};

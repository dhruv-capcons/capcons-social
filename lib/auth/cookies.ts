import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Cookie configuration constants
export const COOKIE_CONFIG = {
  ACCESS_TOKEN: {
    name: 'access_token',
    maxAge: 30 * 60, // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },
  REFRESH_TOKEN: {
    name: 'refresh_token',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },
};

/**
 * Set authentication cookies (access_token and refresh_token)
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean = false
) {
  const cookieStore = await cookies();
  
  // Set access token cookie
  cookieStore.set(COOKIE_CONFIG.ACCESS_TOKEN.name, accessToken, {
    ...COOKIE_CONFIG.ACCESS_TOKEN,
  });

  // Set refresh token cookie with extended expiry if remember me
  cookieStore.set(COOKIE_CONFIG.REFRESH_TOKEN.name, refreshToken, {
    ...COOKIE_CONFIG.REFRESH_TOKEN,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : COOKIE_CONFIG.REFRESH_TOKEN.maxAge, // 30 days if remember me
  });
}

/**
 * Clear all authentication cookies
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  
  cookieStore.delete(COOKIE_CONFIG.ACCESS_TOKEN.name);
  cookieStore.delete(COOKIE_CONFIG.REFRESH_TOKEN.name);
}

/**
 * Get access token from cookies
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_CONFIG.ACCESS_TOKEN.name);
  return token?.value || null;
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_CONFIG.REFRESH_TOKEN.name);
  return token?.value || null;
}

/**
 * Set auth cookies in a response object
 */
export function setAuthCookiesInResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean = false
) {
  // Set access token
  response.cookies.set(COOKIE_CONFIG.ACCESS_TOKEN.name, accessToken, {
    ...COOKIE_CONFIG.ACCESS_TOKEN,
  });

  // Set refresh token
  response.cookies.set(COOKIE_CONFIG.REFRESH_TOKEN.name, refreshToken, {
    ...COOKIE_CONFIG.REFRESH_TOKEN,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : COOKIE_CONFIG.REFRESH_TOKEN.maxAge,
  });

  return response;
}

/**
 * Clear auth cookies from response object
 */
export function clearAuthCookiesFromResponse(response: NextResponse) {
  response.cookies.delete(COOKIE_CONFIG.ACCESS_TOKEN.name);
  response.cookies.delete(COOKIE_CONFIG.REFRESH_TOKEN.name);
  return response;
}

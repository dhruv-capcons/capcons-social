import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_CONFIG, clearAuthCookies } from "./lib/auth/cookies";

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
  "/welcome",
];

// Auth routes
const AUTH_ROUTES = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

interface UserDetails {
  _id: string;
  name: string;
  userslug: string;
  dob: string;
  description: string;
  pfp_url?: string;
  cover_url: string;
  story: string;
  category: string;
  designation: string;
  business_url: string;
  youtube: string;
  instagram: string;
  xlink: string;
  education: {
    degree_name: string;
    university: string;
    start_year: number;
    end_year: number;
  };
  experience: {
    company: string;
    company_role: string;
    start_year: number;
    end_year: number;
    is_current: boolean;
  };
  interests?: string[];
  gender: string;
  pronouns: string;
  color_card_id?: string;
  friend_count: number;
  circle_count: number;
  invitation_count: number;
  onboarding_step: number;
  email: string;
  phone: string;
  country_code: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  registration_date: string;
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

/**
 * Check if user has seen welcome page (using a cookie)
 */
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

function storeUserDataInCookies(
  response: NextResponse,
  userDetails: UserDetails
): NextResponse {
  // Store essential user data in a cookie
  const userData = {
    _id: userDetails._id,
    name: userDetails.name,
    user_name: userDetails.userslug,
    dob: userDetails.dob,
    gender: userDetails.gender,
    description: userDetails.description,
    pfp_url: userDetails.pfp_url,
    interests: userDetails.interests || [],
    color_card_id: userDetails.color_card_id,
    onboarding_step: userDetails.onboarding_step,
    email: userDetails.email,
    phone: userDetails.phone,
    is_email_verified: userDetails.is_email_verified,
    is_phone_verified: userDetails.is_phone_verified,
    country_code: userDetails.country_code,
    registration_date: userDetails.registration_date,
    _timestamp: Date.now(), // For cache validation
  };

  response.cookies.set({
    name: "user_data",
    value: JSON.stringify(userData),
    path: "/",
    maxAge: 2 * 60 * 60, // 2 hours
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}

/**
 * Clear all authentication cookies and redirect to login
 */
async function clearAuthCookiesAndRedirect(
  request: NextRequest,
  pathname: string
): Promise<NextResponse> {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);

  // Create redirect response
  const response = NextResponse.redirect(loginUrl);

  // Clear all auth cookies
  const cookieNames = [
    "has_seen_welcome",
    "user_data",
    "access_token",
    "refresh_token",
  ];

  await clearAuthCookies();

  cookieNames.forEach((cookieName) => {
    response.cookies.delete(cookieName);
    response.cookies.set({
      name: cookieName,
      value: "",
      path: "/",
      expires: new Date(0),
    });
  });

  return response;
}

/**
 * Fetch user details from API (server-side)
 */
async function fetchUserDetails(
  request: NextRequest
): Promise<{ data: UserDetails | null; error: boolean }> {
  // FIRST: Check if we have fresh data in cookie
  const userDataCookie = request.cookies.get("user_data");
  if (userDataCookie && userDataCookie.value) {
    try {
      const cachedData = JSON.parse(userDataCookie.value);
      const cacheAge = Date.now() - (cachedData._timestamp || 0);

      // Use cache if less than 30 seconds old
      if (cacheAge < 30 * 1000) {
        // 30 seconds cache
        console.log("[PROXY] Using cached user data (age:", cacheAge, "ms)");
        return {
          data: {
            ...cachedData,
            _id: cachedData._id,
            name: cachedData.name,
            userslug: cachedData.user_name || cachedData.userslug,
            // ... map other fields
          },
          error: false,
        };
      }
    } catch (e) {
      // Cache parsing failed, fetch fresh
      console.log("[PROXY] Cache parsing failed, fetching fresh");
    }
  }

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

    console.log("[PROXY] API Response status:", response.status);

    if (!response.ok) {
      console.log("[PROXY] API call failed with status:", response.status);
      return { data: null, error: true };
    }

    const result = await response.json();

    console.log("[PROXY] User details fetched:", {
      hasSlug: !!result.data?.userslug,
      hasDob: !!result.data?.dob,
      hasDescription: !!result.data?.description,
      onboardingStep: result.data?.onboarding_step,
      isEmailVerified: result.data?.is_email_verified,
      isPhoneVerified: result.data?.is_phone_verified,
    });

    return { data: result.data, error: false };
  } catch (error) {
    console.error("[PROXY] Error fetching user details:", error);
    return { data: null, error: true };
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

      // If has seen welcome page, redirect to feed
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

  // Fetch user details ONLY when needed
  const { data: userDetails, error } = await fetchUserDetails(request);

  // If API has error or user doesn't exist, logout immediately
  if (error || !userDetails) {
    console.log(
      "[PROXY] User details fetch failed or user deleted, logging out"
    );
    return clearAuthCookiesAndRedirect(request, pathname);
  }

  // Store user data in cookies for client-side
  let response = NextResponse.next();
  response = storeUserDataInCookies(response, userDetails);

  const redirectPath = determineRedirectPath(userDetails, pathname, request);

  if (redirectPath) {
    // Don't redirect if already on the correct path
    if (
      pathname !== redirectPath &&
      !pathname.startsWith(redirectPath.split("?")[0])
    ) {
      // Create redirect response
      response = NextResponse.redirect(new URL(redirectPath, request.url));
      response = storeUserDataInCookies(response, userDetails);

      // If going to welcome page, mark it as seen
      if (redirectPath === "/welcome") {
        response = markWelcomePageAsSeen(response);
      }

      return response;
    }
  }

  // If user is currently ON the welcome page, mark it as seen
  if (pathname === "/welcome") {
    response = markWelcomePageAsSeen(response);
  }

  return response;
}

// Update the main proxy function logic
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

  const isOnboardingRoute =
    pathname.startsWith("/user-details") ||
    pathname.startsWith("/onboarding") ||
    pathname === "/welcome";

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

  // 1. ONLY fetch user details for auth routes (login, signup)
  if (isAuthenticated && isAuthRoute) {
    return await handleAuthenticatedUser(request);
  }

  // 2. For protected routes, just check authentication
  if (
    !isPublicRoute &&
    !isOnboardingRoute // Don't check onboarding routes here
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
          // Token refreshed successfully - continue
          const response = NextResponse.next();

          // Copy cookies from refresh response
          refreshResponse.headers.forEach((value, key) => {
            if (key === "set-cookie") {
              response.headers.set(key, value);
            }
          });

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
      await clearAuthCookies();
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated - allow access to protected routes
    if (isAuthenticated) {
      return NextResponse.next();
    }
  }

  // 3. For onboarding routes, check if user should be there
  if (isAuthenticated && isOnboardingRoute) {
    return await handleAuthenticatedUser(request);
  }

  // 4. For authenticated users on public routes (like home page),
  // only redirect if they're on auth routes (handled above)
  // Otherwise, just let them through

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)",
  ],
};

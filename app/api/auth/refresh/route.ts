import { NextResponse } from "next/server";
import { getRefreshToken, setAuthCookies } from "@/lib/auth/cookies";
import axios from "axios";

/**
 * POST /api/auth/refresh
 * Uses refresh_token from cookie to get new access_token
 * Updates cookies with new tokens
 */
export async function POST() {
  try {
    // Get refresh token from cookie
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // Call backend to refresh token with the refresh token in Cookie header
    const response = await axios.get(`${apiUrl}/auth/refresh`, {
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    // Extract tokens from Set-Cookie headers
    const setCookieHeaders = response.headers["set-cookie"];
    if (!setCookieHeaders || setCookieHeaders.length === 0) {
      return NextResponse.json(
        { error: "No tokens returned from refresh" },
        { status: 401 }
      );
    }

    // Parse access_token and refresh_token from Set-Cookie headers
    let newAccessToken: string | null = null;
    let newRefreshToken: string | null = null;

    setCookieHeaders.forEach((cookie: string) => {
      if (cookie.startsWith("access_token=")) {
        newAccessToken = cookie.split(";")[0].split("=")[1];
      } else if (cookie.startsWith("refresh_token=")) {
        newRefreshToken = cookie.split(";")[0].split("=")[1];
      }
    });

    if (!newAccessToken) {
      return NextResponse.json(
        { error: "Failed to extract access token" },
        { status: 401 }
      );
    }

    // Update cookies with new tokens
    await setAuthCookies(
      newAccessToken,
      newRefreshToken || refreshToken, // Use new refresh token if provided, else keep old one
      false
    );

    return NextResponse.json(
      {
        success: true,
        message: "Token refreshed successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Token refresh error:", error);

    // If refresh fails, token is invalid - clear cookies
    const { clearAuthCookies } = await import("@/lib/auth/cookies");
    await clearAuthCookies();

    let errorMessage = "Unknown error";
    if (error && typeof error === "object" && "response" in error) {
      const response = error.response as { data?: { message?: string } };
      errorMessage = response.data?.message || "Unknown error";
    }

    return NextResponse.json(
      { error: "Token refresh failed", details: errorMessage },
      { status: 401 }
    );
  }
}

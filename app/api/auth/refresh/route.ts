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

    // Call backend to refresh token
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh`, { withCredentials: true }
    );

    const { access_token, refresh_token: newRefreshToken } = response.data.data;

    if (!access_token) {
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: 401 }
      );
    }

    // Update cookies with new tokens
    await setAuthCookies(
      access_token,
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

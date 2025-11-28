import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getRefreshToken, setUserDataCookieInResponse, getUserDataCookie } from "@/lib/auth/cookies";
import axios from "axios";

export async function PATCH(request: NextRequest) {
  try {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { interests } = body;

    if (!interests || !Array.isArray(interests)) {
      return NextResponse.json(
        { error: "Invalid interests data" },
        { status: 400 }
      );
    }

    // Call external API to update interests
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/profile/interest`,
      { interests },
      {
        headers: {
          Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Get existing user data from cookie
    const existingUserData = getUserDataCookie() || {};

    // Update user data with new interests and onboarding step
    const updatedUserData = {
      ...existingUserData,
      interests,
      onboarding_step: 4,
    };

    // Create response and set updated cookie
    const jsonResponse = NextResponse.json(
      {
        message: response.data.message || "Interests updated successfully",
      },
      { status: 200 }
    );

    setUserDataCookieInResponse(jsonResponse, updatedUserData);

    return jsonResponse;
  } catch (error: unknown) {
    console.error("Update interests error:", error);

    let status = 500;
    let message = "Failed to update interests";

    if (axios.isAxiosError(error) && error.response) {
      status = error.response.status || 500;
      message =
        error.response.data?.message ||
        error.message ||
        message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status });
  }
}

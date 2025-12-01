import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getRefreshToken, setUserDataCookieInResponse, getUserDataCookie } from "@/lib/auth/cookies";

export async function PATCH(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();


  if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const body = await request.json();
    const { color_card_id } = body;

    if (!color_card_id || typeof color_card_id !== "string") {
      return NextResponse.json(
        { error: "Invalid color card ID" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Call external API to update interests
    const response = await fetch(`${apiUrl}/users/profile/colorcard`, {
        method: 'PATCH',
        body: JSON.stringify({ color_card_id }),
        headers: {
            Cookie:`access_token=${accessToken}; refresh_token=${refreshToken}`,
        },  
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to update interests" },
        { status: response.status }
      );
    }

    const responseData = await response.json();

    // Get existing user data from cookie
    const existingUserData = getUserDataCookie() || {};

    // Update user data with new interests and onboarding step
    const updatedUserData = {
      ...existingUserData,
      color_card_id,
      onboarding_step: 4,
    };

    // Create response and set updated cookie
    const jsonResponse = NextResponse.json(
      {
        message: responseData.message || "Interests updated successfully",
      },
      { status: 200 }
    );

    setUserDataCookieInResponse(jsonResponse, updatedUserData);

    return jsonResponse;
  } catch (error: unknown) {
    console.error("Update interests error:", error);

    const status = 500;
    let message = "Failed to update interests";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status });
  }
}

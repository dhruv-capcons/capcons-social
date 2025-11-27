import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getRefreshToken } from "@/lib/auth/cookies";
import axios from "axios";

export async function PUT(req: NextRequest) {
  try {
    // Extract data from request body
    const body = await req.json();
    const { username, dob, description } = body;

    if (!username || !dob) {
      return NextResponse.json(
        { error: "Username and date of birth are required" },
        { status: 400 }
      );
    }

    // Get authentication tokens
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Update user profile with username, dob, and description
    const response = await axios.put(
      `${apiUrl}/users/profile/onboarding-1`,
      { username, dob, description },
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: response.data?.message || "Profile updated successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("User details update error:", error);
    const axiosError = error as { response?: { data?: unknown; status?: number } };
    return NextResponse.json(
      {
        error:
          axiosError?.response?.data ||
          (error instanceof Error ? error.message : "Update failed"),
      },
      { status: axiosError?.response?.status || 500 }
    );
  }
}

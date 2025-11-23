import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/cookies";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    // Extract file from form data
    const formData = await req.formData();
    const file = formData.get("profile_image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Get authentication token for the profile update step
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Step 1: Upload image to S3
    const uploadFormData = new FormData();
    uploadFormData.append("files", file);
    uploadFormData.append("contentType", file.type);
    uploadFormData.append("bucket", "capconscom");
    uploadFormData.append("CIRCLE_ID", "674e9cf6477a49f180248d72");

    const uploadResponse = await axios.post(
      `${apiUrl}/utils/upload/awsMulti`,
      uploadFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      }
    );

    const imageUrl = uploadResponse.data?.files?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from upload");
    }

    // Step 2: Update user profile with image URL
    const updateResponse = await axios.put(
      `${apiUrl}/users/profile/pfpimage`,
      { img_url: imageUrl },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json({
      success: true,
      image_url: imageUrl,
      data: updateResponse.data,
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    const axiosError = error as { response?: { data?: unknown; status?: number } };
    return NextResponse.json(
      {
        error:
          axiosError?.response?.data ||
          (error instanceof Error ? error.message : "Upload failed"),
      },
      { status: axiosError?.response?.status || 500 }
    );
  }
}

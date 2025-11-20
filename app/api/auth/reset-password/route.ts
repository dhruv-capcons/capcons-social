import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

/**
 * POST /api/auth/reset-password
 * Resets password using the password_reset_token from cookies
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const credential = formData.get('credential') as string;
    const new_password = formData.get('new_password') as string;

    // Get password_reset_token from cookies
    const cookieStore = await cookies();
    const passwordResetToken = cookieStore.get('password_reset_token')?.value;

    if (!passwordResetToken) {
      return NextResponse.json(
        { error: 'No password reset token found. Please verify OTP again.' },
        { status: 401 }
      );
    }

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('credential', credential);
    backendFormData.append('new_password', new_password);

    // Call backend reset password endpoint with token in cookie
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/forget-password/reset`,
      backendFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cookie': `password_reset_token=${passwordResetToken}`,
        },
      }
    );

    // Clear the password_reset_token after successful reset
    cookieStore.delete('password_reset_token');

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully',
        data: response.data,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Reset password error:', error);

    let errorMessage = 'Password reset failed';
    let statusCode = 400;

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
      statusCode = axiosError.response?.status || statusCode;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

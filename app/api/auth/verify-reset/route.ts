import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

/**
 Verifies OTP for password reset and stores the password_reset_token cookie
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const credential = formData.get('credential') as string;
    const code = formData.get('code') as string;
    const method = formData.get('method') as string;
    const request_id = formData.get('request_id') as string;


    const backendFormData = new FormData();
    backendFormData.append('credential', credential);
    backendFormData.append('code', code);
    backendFormData.append('method', method);
    backendFormData.append('password_reset', 'yes');    
    backendFormData.append('request_id', request_id);


    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
      backendFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    // Extract password_reset_token
    const setCookieHeader = response.headers['set-cookie'];
    let passwordResetToken = null;

    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      const resetTokenCookie = cookies.find(cookie => cookie.startsWith('password_reset_token='));
      
      if (resetTokenCookie) {
        const tokenMatch = resetTokenCookie.match(/password_reset_token=([^;]+)/);
        if (tokenMatch) {
          passwordResetToken = tokenMatch[1];
        }
      }
    }

    // Store the password_reset_token in our cookies
    if (passwordResetToken) {
      const cookieStore = await cookies();
      cookieStore.set('password_reset_token', passwordResetToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/',
        maxAge: 5 * 60, // 15 minutes
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully',
        data: response.data,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Verify reset error:', error);

    let errorMessage = 'Verification failed';
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

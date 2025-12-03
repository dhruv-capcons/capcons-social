import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';


/**
 * POST /api/auth/verify-signup
 * Verifies OTP for sign-up and stores access_token & refresh_token cookies
 */
export async function POST(request: Request) {
  try {

    console.log('Received verify signup request');


    const formData = await request.formData();
    const credential = formData.get('credential') as string;
    const code = formData.get('code') as string;
    const method = formData.get('method') as string;
    const request_id = formData.get('request_id') as string;

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('credential', credential);
    backendFormData.append('code', code);
    backendFormData.append('method', method);
    backendFormData.append('request_id', request_id);

    // Call backend verify endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
      {
        method: 'POST',
        body: backendFormData,
        credentials: 'include',
      }
    );


    // Extract tokens from backend response cookies
    const setCookieHeader = response.headers.get('set-cookie');
    console.log('Set-Cookie Header:', setCookieHeader);
    let accessToken = null;
    let refreshToken = null;

    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      
      // Extract access_token
      const accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));
      if (accessTokenCookie) {
        const tokenMatch = accessTokenCookie.match(/access_token=([^;]+)/);
        if (tokenMatch) {
          accessToken = tokenMatch[1];
        }
      }

      // Extract refresh_token
      const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refresh_token='));
      if (refreshTokenCookie) {
        const tokenMatch = refreshTokenCookie.match(/refresh_token=([^;]+)/);
        if (tokenMatch) {
          refreshToken = tokenMatch[1];
        }
      }
    }

    // Store tokens in our cookies
    if (accessToken && refreshToken) {
      await setAuthCookies(accessToken, refreshToken, false);
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: 'Sign-up verification successful',
        data,
        authenticated: !!(accessToken && refreshToken),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Verify signup error:', error);

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

import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';

/**
 * POST /api/auth/session
 * Receives tokens from client after successful login/register
 * Sets HTTP-only cookies with tokens
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, refresh_token, remember_me } = body;

    // Validate required fields
    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: 'Missing required tokens' },
        { status: 400 }
      );
    }

    // Set auth cookies
    await setAuthCookies(access_token, refresh_token, remember_me || false);

    return NextResponse.json(
      { 
        success: true,
        message: 'Session established successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth/cookies';

/**
 * GET /api/auth/verify
 * Verifies if user has valid session by checking access_token cookie
 * Returns session status and user info if valid
 */
export async function GET() {
  try {
    // Get access token from cookie
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { 
          authenticated: false,
          error: 'No access token found' 
        },
        { status: 401 }
      );
    }

    // Decode JWT to get user info (without verification for now)
    // In production, you should verify the JWT signature
    try {
      const payload = JSON.parse(
        Buffer.from(accessToken.split('.')[1], 'base64').toString()
      );

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        return NextResponse.json(
          { 
            authenticated: false,
            error: 'Token expired' 
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          authenticated: true,
          user: {
            id: payload.sub,
            // Add other user fields as needed
          },
        },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        { 
          authenticated: false,
          error: 'Invalid token format' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Session verification failed' 
      },
      { status: 500 }
    );
  }
}

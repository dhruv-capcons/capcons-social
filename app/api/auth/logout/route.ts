import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/cookies';

/**
 * POST /api/auth/logout
 * Clears all authentication cookies
 */
export async function POST(request: NextRequest) {
  try {
    // Clear auth cookies
    await clearAuthCookies();

    return NextResponse.json(
      { 
        success: true,
        message: 'Logged out successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, try to clear cookies
    await clearAuthCookies();
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Logged out successfully' 
      },
      { status: 200 }
    );
  }
}

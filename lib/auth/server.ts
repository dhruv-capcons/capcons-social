import { getAccessToken, getRefreshToken } from './cookies';

/**
 * Server-side authentication utilities
 * Use these in Server Components and API routes
 */

interface DecodedToken {
  sub: string; // user_id
  exp: number; // expiration timestamp
  [key: string]: unknown;
}

/**
 * Decode JWT token without verification
 * For production, use a proper JWT library with verification
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Get current server session
 * Returns user info if authenticated, null otherwise
 */
export async function getServerSession(): Promise<{
  id: string;
  authenticated: boolean;
} | null> {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return null;
    }

    // Check if token is expired
    if (isTokenExpired(accessToken)) {
      return null;
    }

    // Decode token to get user info
    const decoded = decodeToken(accessToken);
    if (!decoded) {
      return null;
    }

    return {
      authenticated: true,
      id: decoded.sub,
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication - throws if not authenticated
 * Use in Server Components/Actions that need auth
 */
export async function requireAuth(): Promise<{
  id: string;
}> {
  const session = await getServerSession();
  
  if (!session || !session.authenticated) {
    throw new Error('Unauthorized');
  }

  return {
    id: session.id,
  };
}

/**
 * Check if user has valid refresh token
 */
export async function hasValidRefreshToken(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;
    
    return !isTokenExpired(refreshToken);
  } catch {
    return false;
  }
}

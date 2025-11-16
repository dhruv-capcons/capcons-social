import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 16;

/**
 * Get encryption key from environment variable
 * In production, this should be a strong secret stored securely
 */
function getEncryptionKey(): string {
  const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
  return secret;
}

/**
 * Derive a key from the secret using scrypt
 */
function deriveKey(secret: string, salt: Buffer): Buffer {
  return scryptSync(secret, salt, KEY_LENGTH);
}

/**
 * Encrypt a token string
 * @param token - The token to encrypt
 * @returns Encrypted string in format: salt:iv:authTag:encryptedData (all base64)
 */
export function encrypt(token: string): string {
  try {
    // Generate random salt and IV
    const salt = randomBytes(SALT_LENGTH);
    const iv = randomBytes(IV_LENGTH);
    
    // Derive key from secret and salt
    const key = deriveKey(getEncryptionKey(), salt);
    
    // Create cipher
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the token
    let encrypted = cipher.update(token, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // Combine salt:iv:authTag:encrypted (all base64 encoded)
    return `${salt.toString('base64')}:${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt an encrypted token
 * @param encryptedToken - The encrypted token string (salt:iv:authTag:encryptedData)
 * @returns Decrypted token string
 */
export function decrypt(encryptedToken: string): string {
  try {
    // Split the encrypted token into parts
    const parts = encryptedToken.split(':');
    
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted token format');
    }
    
    const [saltBase64, ivBase64, authTagBase64, encrypted] = parts;
    
    // Decode from base64
    const salt = Buffer.from(saltBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    
    // Derive the same key using salt
    const key = deriveKey(getEncryptionKey(), salt);
    
    // Create decipher
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt the token
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Encrypt both access and refresh tokens
 * @param accessToken - The access token to encrypt
 * @param refreshToken - The refresh token to encrypt
 * @returns Object with encrypted tokens
 */
export function encryptTokens(accessToken: string, refreshToken: string): {
  encryptedAccessToken: string;
  encryptedRefreshToken: string;
} {
  return {
    encryptedAccessToken: encrypt(accessToken),
    encryptedRefreshToken: encrypt(refreshToken),
  };
}

/**
 * Decrypt both access and refresh tokens
 * @param encryptedAccessToken - The encrypted access token
 * @param encryptedRefreshToken - The encrypted refresh token
 * @returns Object with decrypted tokens
 */
export function decryptTokens(
  encryptedAccessToken: string,
  encryptedRefreshToken: string
): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: decrypt(encryptedAccessToken),
    refreshToken: decrypt(encryptedRefreshToken),
  };
}

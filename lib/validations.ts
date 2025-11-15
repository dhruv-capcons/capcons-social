/**
 * Password validation function
 * Requirements:
 * - At least one uppercase letter
 * - At least one lowercase letter 
 * - At least one special character from: !@#$%^&*_-+.,~
 * - At least one number
 * - Minimum length: 8 characters
 * - Maximum length: 50 characters
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  // Length validation
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (password.length > 50) {
    errors.push("Password must be no more than 50 characters long");
  }
  
  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Special character check
  const specialCharRegex = /[!@#$%^&*_\-+.,~]/;
  
  if (!specialCharRegex.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*_-+.,~)");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Quick password validation for simple boolean check
 */
export function isValidPassword(password: string): boolean {
  return validatePassword(password).isValid;
}

/**
 * Get password strength score (0-5)
 */
export function getPasswordStrength(password: string): number {
  let score = 0;
  
  // Length bonus
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character type bonuses
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  
  // Special character bonus
  const specialCharRegex = /[!@#$%^&*_\-+.,~]/;
  if (specialCharRegex.test(password)) score++;
  
  return Math.min(score, 5);
}
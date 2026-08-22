/**
 * Form validation and helper utilities
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  // Standard Pakistani mobile number: exactly 11 digits starting with 03 (e.g. 03001234567)
  const cleaned = String(phone).replace(/[\s-]/g, '');
  return /^03[0-9]{9}$/.test(cleaned);
};

export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Empty', color: 'bg-stone-200' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score: 5, label: 'Strong', color: 'bg-emerald-500' };
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
};


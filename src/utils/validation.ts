
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

export const validate = (value: string, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (rule.required && !validateRequired(value)) {
      return rule.message;
    }
    if (rule.email && !validateEmail(value)) {
      return rule.message;
    }
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }
    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }
  return null;
};

// ==========================================
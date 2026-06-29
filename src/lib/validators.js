/**
 * Form validation helpers for CotoGate web forms.
 * Each validator returns { valid: boolean, errorKey?: string }
 * so errors can be localised via t(errorKey).
 */

/**
 * Validates a standard email address.
 * @param {string} value
 * @returns {{ valid: boolean, errorKey?: string }}
 */
export function validateEmail(value) {
  if (!value || !value.trim()) {
    return { valid: false, errorKey: 'validation.required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return { valid: false, errorKey: 'validation.email_invalid' };
  }
  return { valid: true };
}

/**
 * Validates that a required text field is non-empty.
 * @param {string} value
 * @returns {{ valid: boolean, errorKey?: string }}
 */
export function validateRequired(value) {
  if (!value || !String(value).trim()) {
    return { valid: false, errorKey: 'validation.required' };
  }
  return { valid: true };
}

/**
 * Validates a Mexican phone number (10–12 digits, optional + prefix).
 * @param {string} value
 * @returns {{ valid: boolean, errorKey?: string }}
 */
export function validatePhone(value) {
  if (!value || !value.trim()) {
    return { valid: false, errorKey: 'validation.required' };
  }
  const phoneRegex = /^\+?[0-9]{10,12}$/;
  if (!phoneRegex.test(value.replace(/\s/g, ''))) {
    return { valid: false, errorKey: 'validation.phone_invalid' };
  }
  return { valid: true };
}

/**
 * Validates a password (minimum 8 characters).
 * @param {string} value
 * @returns {{ valid: boolean, errorKey?: string }}
 */
export function validatePassword(value) {
  if (!value) {
    return { valid: false, errorKey: 'validation.required' };
  }
  if (value.length < 8) {
    return { valid: false, errorKey: 'validation.password_length' };
  }
  return { valid: true };
}

/**
 * Validates a numeric value is a non-negative number.
 * @param {string|number} value
 * @returns {{ valid: boolean, errorKey?: string }}
 */
export function validatePositiveNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return { valid: false, errorKey: 'validation.required' };
  }
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) {
    return { valid: false, errorKey: 'validation.positive_number' };
  }
  return { valid: true };
}

/**
 * Runs multiple field validators and collects errors by field name.
 * @param {Array<{ field: string, value: any, validators: Function[] }>} checks
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateForm(checks) {
  const errors = {};
  for (const { field, value, validators } of checks) {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        errors[field] = result.errorKey;
        break; // Only show first error per field
      }
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

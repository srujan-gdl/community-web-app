import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validateRequired,
  validatePhone,
  validatePassword,
  validatePositiveNumber,
  validateForm,
} from '../lib/validators';

describe('validateRequired', () => {
  it('fails on empty string', () => expect(validateRequired('').valid).toBe(false));
  it('fails on whitespace only', () => expect(validateRequired('   ').valid).toBe(false));
  it('passes on normal string', () => expect(validateRequired('hello').valid).toBe(true));
});

describe('validateEmail', () => {
  it('passes on valid email', () => expect(validateEmail('user@example.com').valid).toBe(true));
  it('fails on missing @', () => expect(validateEmail('userexample.com').valid).toBe(false));
  it('fails on empty', () => expect(validateEmail('').valid).toBe(false));
  it('returns correct errorKey', () => expect(validateEmail('bad').errorKey).toBe('validation.email_invalid'));
});

describe('validatePhone', () => {
  it('passes on 10-digit number', () => expect(validatePhone('8181234567').valid).toBe(true));
  it('passes with + prefix', () => expect(validatePhone('+528181234567').valid).toBe(true));
  it('fails on too short', () => expect(validatePhone('123').valid).toBe(false));
  it('fails on empty', () => expect(validatePhone('').valid).toBe(false));
});

describe('validatePassword', () => {
  it('fails on empty', () => expect(validatePassword('').valid).toBe(false));
  it('fails on < 8 chars', () => expect(validatePassword('short').valid).toBe(false));
  it('passes on >= 8 chars', () => expect(validatePassword('longPass1').valid).toBe(true));
  it('returns correct errorKey for length', () => expect(validatePassword('abc').errorKey).toBe('validation.password_length'));
});

describe('validatePositiveNumber', () => {
  it('passes on 0', () => expect(validatePositiveNumber(0).valid).toBe(true));
  it('passes on positive string', () => expect(validatePositiveNumber('100').valid).toBe(true));
  it('fails on negative', () => expect(validatePositiveNumber(-1).valid).toBe(false));
  it('fails on empty', () => expect(validatePositiveNumber('').valid).toBe(false));
  it('fails on non-numeric', () => expect(validatePositiveNumber('abc').valid).toBe(false));
});

describe('validateForm', () => {
  it('returns isValid=true when all pass', () => {
    const { isValid, errors } = validateForm([
      { field: 'name',  value: 'Carlos', validators: [validateRequired] },
      { field: 'email', value: 'c@t.com', validators: [validateRequired, validateEmail] },
    ]);
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  it('collects errors for failing fields', () => {
    const { isValid, errors } = validateForm([
      { field: 'name',  value: '',       validators: [validateRequired] },
      { field: 'email', value: 'bad',    validators: [validateRequired, validateEmail] },
    ]);
    expect(isValid).toBe(false);
    expect(errors.name).toBe('validation.required');
    expect(errors.email).toBe('validation.email_invalid');
  });

  it('only records first failing validator per field', () => {
    const { errors } = validateForm([
      { field: 'email', value: '', validators: [validateRequired, validateEmail] },
    ]);
    // Required fires before email_invalid
    expect(errors.email).toBe('validation.required');
  });
});

import { describe, it, expect } from 'vitest';
import { getPasswordStrength, simulateLogin } from '../lib/auth';

describe('Auth Helpers', () => {
  describe('getPasswordStrength', () => {
    it('should return score 0 and empty label for empty password', () => {
      expect(getPasswordStrength('')).toEqual({
        score: 0,
        labelKey: '',
        color: 'bg-slate-200 dark:bg-slate-700'
      });
    });

    it('should return weak rating for short password', () => {
      expect(getPasswordStrength('abc')).toEqual({
        score: 0,
        labelKey: 'weak',
        color: 'bg-red-500'
      });
    });

    it('should return weak rating for password that only meets length requirement', () => {
      expect(getPasswordStrength('abcdefgh')).toEqual({
        score: 1,
        labelKey: 'weak',
        color: 'bg-red-500'
      });
    });

    it('should return medium rating for password with length and uppercase letter', () => {
      const result = getPasswordStrength('Abcdefgh');
      expect(result.score).toBe(2);
      expect(result.labelKey).toBe('medium');
      expect(result.color).toBe('bg-amber-500');
    });

    it('should return strong rating for password with length, uppercase, number, and special character', () => {
      const result = getPasswordStrength('Abcdefg1!');
      expect(result.score).toBe(4);
      expect(result.labelKey).toBe('strong');
      expect(result.color).toBe('bg-emerald-500');
    });
  });

  describe('simulateLogin', () => {
    it('should authenticate super_admin correctly', () => {
      const result = simulateLogin('superadmin@cotogate.com', 'admin123');
      expect(result.success).toBe(true);
      expect(result.user.role).toBe('super_admin');
      expect(result.user.must_change_password).toBe(true);
    });

    it('should authenticate guard correctly with permanent password', () => {
      const result = simulateLogin('guard@cotogate.com', 'permanent123');
      expect(result.success).toBe(true);
      expect(result.user.role).toBe('guard');
      expect(result.user.must_change_password).toBe(false);
    });

    it('should fail with invalid credentials', () => {
      const result = simulateLogin('nonexistent@cotogate.com', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.errorKey).toBe('login.error.invalid');
    });
  });
});

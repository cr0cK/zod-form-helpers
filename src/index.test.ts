import { describe, it, expect } from 'vitest';
import {
  isRequired,
  acceptsNumber,
  acceptsString,
  acceptsBoolean,
  acceptsNull,
  acceptsArray,
  acceptsObject,
  rejectsEmptyString,
  requiresEmailFormat,
  rejectsNegative,
  hasMaxConstraint,
} from './index.js';

describe('Schema Validation Helpers', () => {
  describe('isRequired', () => {
    it('should return true for required fields', () => {
      expect(isRequired('firstName')).toBe(true);
      expect(isRequired('age')).toBe(true);
      expect(isRequired('email')).toBe(true);
      expect(isRequired('isActive')).toBe(true);
    });

    it('should return false for optional fields', () => {
      expect(isRequired('lastName')).toBe(false);
    });
  });

  describe('acceptsNumber', () => {
    it('should return true for number fields', () => {
      expect(acceptsNumber('age')).toBe(true);
    });

    it('should return false for non-number fields', () => {
      expect(acceptsNumber('firstName')).toBe(false);
      expect(acceptsNumber('lastName')).toBe(false);
      expect(acceptsNumber('email')).toBe(false);
      expect(acceptsNumber('isActive')).toBe(false);
    });
  });

  describe('acceptsString', () => {
    it('should return true for string fields', () => {
      expect(acceptsString('firstName')).toBe(true);
      expect(acceptsString('lastName')).toBe(true);
      expect(acceptsString('email')).toBe(true);
    });

    it('should return false for non-string fields', () => {
      expect(acceptsString('age')).toBe(false);
      expect(acceptsString('isActive')).toBe(false);
    });
  });

  describe('acceptsBoolean', () => {
    it('should return true for boolean fields', () => {
      expect(acceptsBoolean('isActive')).toBe(true);
    });

    it('should return false for non-boolean fields', () => {
      expect(acceptsBoolean('firstName')).toBe(false);
      expect(acceptsBoolean('lastName')).toBe(false);
      expect(acceptsBoolean('age')).toBe(false);
      expect(acceptsBoolean('email')).toBe(false);
    });
  });

  describe('acceptsNull', () => {
    it('should return false for all non-nullable fields in the schema', () => {
      expect(acceptsNull('firstName')).toBe(false);
      expect(acceptsNull('lastName')).toBe(false);
      expect(acceptsNull('age')).toBe(false);
      expect(acceptsNull('email')).toBe(false);
      expect(acceptsNull('isActive')).toBe(false);
    });
  });

  describe('acceptsArray', () => {
    it('should return false for all non-array fields in the schema', () => {
      expect(acceptsArray('firstName')).toBe(false);
      expect(acceptsArray('lastName')).toBe(false);
      expect(acceptsArray('age')).toBe(false);
      expect(acceptsArray('email')).toBe(false);
      expect(acceptsArray('isActive')).toBe(false);
    });
  });

  describe('acceptsObject', () => {
    it('should return false for all non-object fields in the schema', () => {
      expect(acceptsObject('firstName')).toBe(false);
      expect(acceptsObject('lastName')).toBe(false);
      expect(acceptsObject('age')).toBe(false);
      expect(acceptsObject('email')).toBe(false);
      expect(acceptsObject('isActive')).toBe(false);
    });
  });

  describe('rejectsEmptyString', () => {
    it('should return true for fields with min length constraint', () => {
      expect(rejectsEmptyString('firstName')).toBe(true);
    });

    it('should return false for fields without min length constraint', () => {
      expect(rejectsEmptyString('lastName')).toBe(false);
    });

    it('should return true for fields with format requirements', () => {
      // Email field rejects empty string due to email format validation
      expect(rejectsEmptyString('email')).toBe(true);
    });

    it('should return false for non-string fields', () => {
      expect(rejectsEmptyString('age')).toBe(false);
      expect(rejectsEmptyString('isActive')).toBe(false);
    });
  });

  describe('requiresEmailFormat', () => {
    it('should return true for email fields', () => {
      expect(requiresEmailFormat('email')).toBe(true);
    });

    it('should return false for non-email string fields', () => {
      expect(requiresEmailFormat('firstName')).toBe(false);
      expect(requiresEmailFormat('lastName')).toBe(false);
    });

    it('should return false for non-string fields', () => {
      expect(requiresEmailFormat('age')).toBe(false);
      expect(requiresEmailFormat('isActive')).toBe(false);
    });
  });

  describe('rejectsNegative', () => {
    it('should return true for fields with min(0) constraint', () => {
      expect(rejectsNegative('age')).toBe(true);
    });

    it('should return false for fields without min constraint or non-number fields', () => {
      expect(rejectsNegative('firstName')).toBe(false);
      expect(rejectsNegative('lastName')).toBe(false);
      expect(rejectsNegative('email')).toBe(false);
      expect(rejectsNegative('isActive')).toBe(false);
    });
  });

  describe('hasMaxConstraint', () => {
    it('should return true when value exceeds max constraint', () => {
      expect(hasMaxConstraint('age', 200)).toBe(true);
      expect(hasMaxConstraint('age', 121)).toBe(true);
    });

    it('should return false when value is within max constraint', () => {
      expect(hasMaxConstraint('age', 120)).toBe(false);
      expect(hasMaxConstraint('age', 100)).toBe(false);
    });

    it('should return false for fields without max constraint', () => {
      expect(hasMaxConstraint('firstName', 9999)).toBe(false);
      expect(hasMaxConstraint('lastName', 9999)).toBe(false);
    });
  });
});

import { describe, it, expect } from "vitest";
import { testSchema } from "../test-schema.js";
import {
  isRequired,
  isOptional,
  isNullable,
  getMinLength,
  getMaxLength,
  getMinValue,
  getMaxValue,
  getPattern,
  hasEmailValidation,
  hasUrlValidation,
  hasUuidValidation,
  getExactLength,
} from "./validation-rules.js";

describe("Validation Rules Helpers", () => {
  describe("isRequired", () => {
    it("should return true for required fields", () => {
      expect(isRequired(testSchema, "username")).toBe(true);
      expect(isRequired(testSchema, "email")).toBe(true);
      expect(isRequired(testSchema, "age")).toBe(true);
      expect(isRequired(testSchema, "isActive")).toBe(true);
    });

    it("should return false for optional fields", () => {
      expect(isRequired(testSchema, "bio")).toBe(false);
      expect(isRequired(testSchema, "score")).toBe(false);
      expect(isRequired(testSchema, "newsletter")).toBe(false);
      expect(isRequired(testSchema, "createdAt")).toBe(false);
    });
  });

  describe("isOptional", () => {
    it("should return true for optional fields", () => {
      expect(isOptional(testSchema, "bio")).toBe(true);
      expect(isOptional(testSchema, "score")).toBe(true);
      expect(isOptional(testSchema, "newsletter")).toBe(true);
      expect(isOptional(testSchema, "createdAt")).toBe(true);
    });

    it("should return false for required fields", () => {
      expect(isOptional(testSchema, "username")).toBe(false);
      expect(isOptional(testSchema, "email")).toBe(false);
      expect(isOptional(testSchema, "age")).toBe(false);
    });
  });

  describe("isNullable", () => {
    it("should return true for nullable fields", () => {
      expect(isNullable(testSchema, "middleName")).toBe(true);
      expect(isNullable(testSchema, "alternateEmail")).toBe(true);
    });

    it("should return false for non-nullable fields", () => {
      expect(isNullable(testSchema, "username")).toBe(false);
      expect(isNullable(testSchema, "email")).toBe(false);
      expect(isNullable(testSchema, "age")).toBe(false);
    });
  });

  describe("getMinLength", () => {
    it("should return min length for string fields with min constraint", () => {
      expect(getMinLength(testSchema, "username")).toBe(3);
      expect(getMinLength(testSchema, "password")).toBe(8);
    });

    it("should return min length for array fields with min constraint", () => {
      expect(getMinLength(testSchema, "scores")).toBe(1);
    });

    it("should return undefined for fields without min constraint", () => {
      expect(getMinLength(testSchema, "bio")).toBeUndefined();
      expect(getMinLength(testSchema, "email")).toBeUndefined();
    });

    it("should return undefined for non-string/array fields", () => {
      expect(getMinLength(testSchema, "age")).toBeUndefined();
      expect(getMinLength(testSchema, "isActive")).toBeUndefined();
    });
  });

  describe("getMaxLength", () => {
    it("should return max length for string fields with max constraint", () => {
      expect(getMaxLength(testSchema, "username")).toBe(20);
    });

    it("should return max length for array fields with max constraint", () => {
      expect(getMaxLength(testSchema, "scores")).toBe(10);
    });

    it("should return undefined for fields without max constraint", () => {
      expect(getMaxLength(testSchema, "email")).toBeUndefined();
      expect(getMaxLength(testSchema, "bio")).toBeUndefined();
    });
  });

  describe("getMinValue", () => {
    it("should return min value for number fields with min constraint", () => {
      expect(getMinValue(testSchema, "age")).toBe(0);
      expect(getMinValue(testSchema, "rating")).toBe(1);
    });

    it("should return undefined for fields without min constraint", () => {
      expect(getMinValue(testSchema, "temperature")).toBeUndefined();
    });

    it("should return undefined for non-number fields", () => {
      expect(getMinValue(testSchema, "username")).toBeUndefined();
    });
  });

  describe("getMaxValue", () => {
    it("should return max value for number fields with max constraint", () => {
      expect(getMaxValue(testSchema, "age")).toBe(120);
      expect(getMaxValue(testSchema, "rating")).toBe(5);
    });

    it("should return undefined for fields without max constraint", () => {
      expect(getMaxValue(testSchema, "price")).toBeUndefined();
      expect(getMaxValue(testSchema, "temperature")).toBeUndefined();
    });
  });

  describe("getPattern", () => {
    it("should return regex pattern for fields with regex constraint", () => {
      const pattern = getPattern(testSchema, "phone");
      expect(pattern).toBeInstanceOf(RegExp);
      expect(pattern?.source).toBe("^\\d{3}-\\d{3}-\\d{4}$");
    });

    it("should return undefined for fields without regex constraint", () => {
      expect(getPattern(testSchema, "username")).toBeUndefined();
      expect(getPattern(testSchema, "email")).toBeUndefined();
    });
  });

  describe("hasEmailValidation", () => {
    it("should return true for fields with email validation", () => {
      expect(hasEmailValidation(testSchema, "email")).toBe(true);
      expect(hasEmailValidation(testSchema, "alternateEmail")).toBe(true);
    });

    it("should return false for fields without email validation", () => {
      expect(hasEmailValidation(testSchema, "username")).toBe(false);
      expect(hasEmailValidation(testSchema, "website")).toBe(false);
    });
  });

  describe("hasUrlValidation", () => {
    it("should return true for fields with URL validation", () => {
      expect(hasUrlValidation(testSchema, "website")).toBe(true);
    });

    it("should return false for fields without URL validation", () => {
      expect(hasUrlValidation(testSchema, "username")).toBe(false);
      expect(hasUrlValidation(testSchema, "email")).toBe(false);
    });
  });

  describe("hasUuidValidation", () => {
    it("should return true for fields with UUID validation", () => {
      expect(hasUuidValidation(testSchema, "uuid")).toBe(true);
    });

    it("should return false for fields without UUID validation", () => {
      expect(hasUuidValidation(testSchema, "username")).toBe(false);
      expect(hasUuidValidation(testSchema, "email")).toBe(false);
    });
  });

  describe("getExactLength", () => {
    it("should return exact length for fields with length constraint", () => {
      expect(getExactLength(testSchema, "code")).toBe(6);
    });

    it("should return undefined for fields without exact length constraint", () => {
      expect(getExactLength(testSchema, "username")).toBeUndefined();
      expect(getExactLength(testSchema, "email")).toBeUndefined();
    });
  });
});

import { describe, it, expect } from "vitest";
import { testSchema } from "../test-schema.js";
import {
  validateField,
  getErrorMessage,
  getErrorType,
  getFieldErrors,
  getAllErrors,
  getCustomErrorMessage,
} from "./error-handling.js";

describe("Error Handling Helpers", () => {
  describe("validateField", () => {
    it("should return true for valid values", () => {
      expect(validateField(testSchema, "username", "john_doe")).toBe(true);
      expect(validateField(testSchema, "email", "test@example.com")).toBe(true);
      expect(validateField(testSchema, "age", 25)).toBe(true);
      expect(validateField(testSchema, "isActive", true)).toBe(true);
    });

    it("should return false for invalid values", () => {
      expect(validateField(testSchema, "username", "ab")).toBe(false); // too short
      expect(validateField(testSchema, "email", "invalid")).toBe(false);
      expect(validateField(testSchema, "age", 150)).toBe(false); // too large
      expect(validateField(testSchema, "age", -5)).toBe(false); // negative
    });

    it("should return false for missing required fields", () => {
      expect(validateField(testSchema, "username", undefined)).toBe(false);
      expect(validateField(testSchema, "email", undefined)).toBe(false);
    });

    it("should return true for missing optional fields", () => {
      expect(validateField(testSchema, "bio", undefined)).toBe(true);
      expect(validateField(testSchema, "score", undefined)).toBe(true);
    });
  });

  describe("getErrorMessage", () => {
    it("should return undefined for valid values", () => {
      expect(getErrorMessage(testSchema, "username", "john_doe")).toBeUndefined();
      expect(getErrorMessage(testSchema, "email", "test@example.com")).toBeUndefined();
    });

    it("should return error message for invalid values", () => {
      const usernameError = getErrorMessage(testSchema, "username", "ab");
      expect(usernameError).toBeDefined();
      expect(typeof usernameError).toBe("string");

      const emailError = getErrorMessage(testSchema, "email", "invalid");
      expect(emailError).toBeDefined();
    });

    it("should return error message for missing required fields", () => {
      const error = getErrorMessage(testSchema, "username", undefined);
      expect(error).toBeDefined();
    });
  });

  describe("getErrorType", () => {
    it("should return undefined for valid values", () => {
      expect(getErrorType(testSchema, "username", "john_doe")).toBeUndefined();
      expect(getErrorType(testSchema, "age", 25)).toBeUndefined();
    });

    it("should return error code for invalid values", () => {
      const usernameError = getErrorType(testSchema, "username", "ab");
      expect(usernameError).toBeDefined();
      expect(typeof usernameError).toBe("string");

      const ageError = getErrorType(testSchema, "age", 150);
      expect(ageError).toBeDefined();
    });
  });

  describe("getFieldErrors", () => {
    it("should return empty array for valid values", () => {
      expect(getFieldErrors(testSchema, "username", "john_doe")).toEqual([]);
      expect(getFieldErrors(testSchema, "age", 25)).toEqual([]);
    });

    it("should return array of errors for invalid values", () => {
      const errors = getFieldErrors(testSchema, "username", "ab");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toHaveProperty("field");
      expect(errors[0]).toHaveProperty("message");
      expect(errors[0]).toHaveProperty("code");
      expect(errors[0]).toHaveProperty("path");
    });

    it("should include field name in errors", () => {
      const errors = getFieldErrors(testSchema, "email", "invalid");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.field).toBe("email");
    });
  });

  describe("getAllErrors", () => {
    it("should return empty array for valid data", () => {
      const validData = {
        username: "john_doe",
        email: "test@example.com",
        website: "https://example.com",
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        phone: "123-456-7890",
        password: "password123",
        confirmPassword: "password123",
        age: 25,
        rating: 4,
        price: 99.99,
        temperature: 20,
        isActive: true,
        acceptTerms: true,
        birthDate: new Date(),
        tags: ["tag1"],
        scores: [1, 2, 3],
        address: { street: "123 Main St", city: "City", zipCode: "12345" },
        role: "user" as const,
        status: "active" as const,
        priority: "medium" as const,
        middleName: null,
        code: "ABC123",
      };

      const errors = getAllErrors(testSchema, validData);
      expect(errors).toEqual([]);
    });

    it("should return all errors for invalid data", () => {
      const invalidData = {
        username: "ab", // too short
        email: "invalid", // invalid email
        age: 150, // too large
      };

      const errors = getAllErrors(testSchema, invalidData);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should include path information in errors", () => {
      const invalidData = {
        username: "ab",
      };

      const errors = getAllErrors(testSchema, invalidData);
      expect(errors[0]).toHaveProperty("path");
    });
  });

  describe("getCustomErrorMessage", () => {
    it("should return undefined for valid values", () => {
      expect(getCustomErrorMessage(testSchema, "username", "john_doe")).toBeUndefined();
    });

    it("should return user-friendly message for required field errors", () => {
      const error = getCustomErrorMessage(testSchema, "username", undefined);
      expect(error).toBeDefined();
      expect(error).toContain("required");
    });

    it("should return user-friendly message for validation errors", () => {
      const error = getCustomErrorMessage(testSchema, "username", "ab");
      expect(error).toBeDefined();
      expect(typeof error).toBe("string");
    });

    it("should handle different error types", () => {
      const tooShortError = getCustomErrorMessage(testSchema, "username", "ab");
      expect(tooShortError).toBeDefined();

      const invalidEmailError = getCustomErrorMessage(testSchema, "email", "invalid");
      expect(invalidEmailError).toBeDefined();

      const tooLargeError = getCustomErrorMessage(testSchema, "age", 150);
      expect(tooLargeError).toBeDefined();
    });
  });
});

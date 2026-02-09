import { describe, it, expect } from "vitest";
import { testSchema } from "../test-schema.js";
import {
  getInputType,
  getEnumOptions,
  getDefaultValue,
  getPlaceholder,
  getLabel,
  getStep,
  isMultiple,
} from "./form-generation.js";

describe("Form Generation Helpers", () => {
  describe("getInputType", () => {
    it("should return 'email' for email fields", () => {
      expect(getInputType(testSchema, "email")).toBe("email");
      expect(getInputType(testSchema, "alternateEmail")).toBe("email");
    });

    it("should return 'url' for URL fields", () => {
      expect(getInputType(testSchema, "website")).toBe("url");
    });

    it("should return 'password' for password fields", () => {
      expect(getInputType(testSchema, "password")).toBe("password");
      expect(getInputType(testSchema, "confirmPassword")).toBe("password");
    });

    it("should return 'tel' for phone fields", () => {
      expect(getInputType(testSchema, "phone")).toBe("tel");
    });

    it("should return 'text' for regular string fields", () => {
      expect(getInputType(testSchema, "username")).toBe("text");
      expect(getInputType(testSchema, "bio")).toBe("text");
    });

    it("should return 'number' for number fields", () => {
      expect(getInputType(testSchema, "age")).toBe("number");
      expect(getInputType(testSchema, "score")).toBe("number");
      expect(getInputType(testSchema, "rating")).toBe("number");
    });

    it("should return 'checkbox' for boolean fields", () => {
      expect(getInputType(testSchema, "isActive")).toBe("checkbox");
      expect(getInputType(testSchema, "acceptTerms")).toBe("checkbox");
    });

    it("should return 'date' for date fields", () => {
      expect(getInputType(testSchema, "birthDate")).toBe("date");
      expect(getInputType(testSchema, "createdAt")).toBe("date");
    });

    it("should return 'select' for enum fields", () => {
      expect(getInputType(testSchema, "role")).toBe("select");
      expect(getInputType(testSchema, "status")).toBe("select");
      expect(getInputType(testSchema, "priority")).toBe("select");
    });
  });

  describe("getEnumOptions", () => {
    it("should return options for enum fields", () => {
      const roleOptions = getEnumOptions(testSchema, "role");
      expect(roleOptions).toEqual(["admin", "user", "guest"]);
    });

    it("should return single value for literal fields", () => {
      const statusOptions = getEnumOptions(testSchema, "status");
      expect(statusOptions).toEqual(["active"]);
    });

    it("should return options for union of literals", () => {
      const priorityOptions = getEnumOptions(testSchema, "priority");
      expect(priorityOptions).toEqual(["low", "medium", "high"]);
    });

    it("should return undefined for non-enum fields", () => {
      expect(getEnumOptions(testSchema, "username")).toBeUndefined();
      expect(getEnumOptions(testSchema, "age")).toBeUndefined();
    });
  });

  describe("getDefaultValue", () => {
    it("should return undefined when no default is set", () => {
      expect(getDefaultValue(testSchema, "username")).toBeUndefined();
      expect(getDefaultValue(testSchema, "age")).toBeUndefined();
      expect(getDefaultValue(testSchema, "email")).toBeUndefined();
    });

    // Note: Test schema doesn't have defaults, but this tests the function works
    it("should work with fields that might have defaults", () => {
      expect(getDefaultValue(testSchema, "bio")).toBeUndefined();
    });
  });

  describe("getPlaceholder", () => {
    it("should return appropriate placeholder for email fields", () => {
      expect(getPlaceholder(testSchema, "email")).toBe("example@email.com");
    });

    it("should return appropriate placeholder for URL fields", () => {
      expect(getPlaceholder(testSchema, "website")).toBe("https://example.com");
    });

    it("should return range info for number fields with constraints", () => {
      const agePlaceholder = getPlaceholder(testSchema, "age");
      expect(agePlaceholder).toContain("0");
      expect(agePlaceholder).toContain("120");

      const ratingPlaceholder = getPlaceholder(testSchema, "rating");
      expect(ratingPlaceholder).toContain("1");
      expect(ratingPlaceholder).toContain("5");
    });

    it("should return generic placeholder for fields without special rules", () => {
      expect(getPlaceholder(testSchema, "username")).toBe("Enter username");
    });

    it("should return appropriate placeholder for date fields", () => {
      expect(getPlaceholder(testSchema, "birthDate")).toBe("Select a date");
    });

    it("should return appropriate placeholder for enum fields", () => {
      expect(getPlaceholder(testSchema, "role")).toBe("Select role");
    });
  });

  describe("getLabel", () => {
    it("should convert camelCase to Title Case", () => {
      expect(getLabel(testSchema, "username")).toBe("Username");
      expect(getLabel(testSchema, "firstName" as any)).toBe("First Name");
      expect(getLabel(testSchema, "isActive")).toBe("Is Active");
      expect(getLabel(testSchema, "acceptTerms")).toBe("Accept Terms");
    });

    it("should handle all field names properly", () => {
      expect(getLabel(testSchema, "birthDate")).toBe("Birth Date");
      expect(getLabel(testSchema, "createdAt")).toBe("Created At");
    });
  });

  describe("getStep", () => {
    it("should return undefined for non-number fields", () => {
      expect(getStep(testSchema, "username")).toBeUndefined();
      expect(getStep(testSchema, "isActive")).toBeUndefined();
    });

    it("should return undefined for number fields without specific constraints", () => {
      expect(getStep(testSchema, "age")).toBeUndefined();
      expect(getStep(testSchema, "temperature")).toBeUndefined();
    });
  });

  describe("isMultiple", () => {
    it("should return true for array fields", () => {
      expect(isMultiple(testSchema, "tags")).toBe(true);
      expect(isMultiple(testSchema, "scores")).toBe(true);
      expect(isMultiple(testSchema, "optionalTags")).toBe(true);
    });

    it("should return false for non-array fields", () => {
      expect(isMultiple(testSchema, "username")).toBe(false);
      expect(isMultiple(testSchema, "age")).toBe(false);
      expect(isMultiple(testSchema, "role")).toBe(false);
    });
  });
});

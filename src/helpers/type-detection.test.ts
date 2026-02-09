import { describe, it, expect } from "vitest";
import { testSchema } from "../test-schema.js";
import {
  getFieldType,
  isStringField,
  isNumberField,
  isBooleanField,
  isDateField,
  isArrayField,
  isObjectField,
  isEnumField,
} from "./type-detection.js";

describe("Type Detection Helpers", () => {
  describe("getFieldType", () => {
    it("should detect string fields", () => {
      expect(getFieldType(testSchema, "username")).toBe("string");
      expect(getFieldType(testSchema, "email")).toBe("string");
      expect(getFieldType(testSchema, "bio")).toBe("string");
    });

    it("should detect number fields", () => {
      expect(getFieldType(testSchema, "age")).toBe("number");
      expect(getFieldType(testSchema, "score")).toBe("number");
      expect(getFieldType(testSchema, "rating")).toBe("number");
    });

    it("should detect boolean fields", () => {
      expect(getFieldType(testSchema, "isActive")).toBe("boolean");
      expect(getFieldType(testSchema, "acceptTerms")).toBe("boolean");
      expect(getFieldType(testSchema, "newsletter")).toBe("boolean");
    });

    it("should detect date fields", () => {
      expect(getFieldType(testSchema, "birthDate")).toBe("date");
      expect(getFieldType(testSchema, "createdAt")).toBe("date");
    });

    it("should detect array fields", () => {
      expect(getFieldType(testSchema, "tags")).toBe("array");
      expect(getFieldType(testSchema, "optionalTags")).toBe("array");
      expect(getFieldType(testSchema, "scores")).toBe("array");
    });

    it("should detect object fields", () => {
      expect(getFieldType(testSchema, "address")).toBe("object");
      expect(getFieldType(testSchema, "optionalMetadata")).toBe("object");
    });

    it("should detect enum fields", () => {
      expect(getFieldType(testSchema, "role")).toBe("enum");
      expect(getFieldType(testSchema, "status")).toBe("literal");
      expect(getFieldType(testSchema, "priority")).toBe("enum");
    });
  });

  describe("isStringField", () => {
    it("should return true for string fields", () => {
      expect(isStringField(testSchema, "username")).toBe(true);
      expect(isStringField(testSchema, "email")).toBe(true);
      expect(isStringField(testSchema, "bio")).toBe(true);
      expect(isStringField(testSchema, "website")).toBe(true);
    });

    it("should return false for non-string fields", () => {
      expect(isStringField(testSchema, "age")).toBe(false);
      expect(isStringField(testSchema, "isActive")).toBe(false);
      expect(isStringField(testSchema, "birthDate")).toBe(false);
      expect(isStringField(testSchema, "tags")).toBe(false);
    });
  });

  describe("isNumberField", () => {
    it("should return true for number fields", () => {
      expect(isNumberField(testSchema, "age")).toBe(true);
      expect(isNumberField(testSchema, "score")).toBe(true);
      expect(isNumberField(testSchema, "rating")).toBe(true);
      expect(isNumberField(testSchema, "price")).toBe(true);
    });

    it("should return false for non-number fields", () => {
      expect(isNumberField(testSchema, "username")).toBe(false);
      expect(isNumberField(testSchema, "isActive")).toBe(false);
      expect(isNumberField(testSchema, "birthDate")).toBe(false);
    });
  });

  describe("isBooleanField", () => {
    it("should return true for boolean fields", () => {
      expect(isBooleanField(testSchema, "isActive")).toBe(true);
      expect(isBooleanField(testSchema, "acceptTerms")).toBe(true);
      expect(isBooleanField(testSchema, "newsletter")).toBe(true);
    });

    it("should return false for non-boolean fields", () => {
      expect(isBooleanField(testSchema, "username")).toBe(false);
      expect(isBooleanField(testSchema, "age")).toBe(false);
      expect(isBooleanField(testSchema, "birthDate")).toBe(false);
    });
  });

  describe("isDateField", () => {
    it("should return true for date fields", () => {
      expect(isDateField(testSchema, "birthDate")).toBe(true);
      expect(isDateField(testSchema, "createdAt")).toBe(true);
    });

    it("should return false for non-date fields", () => {
      expect(isDateField(testSchema, "username")).toBe(false);
      expect(isDateField(testSchema, "age")).toBe(false);
      expect(isDateField(testSchema, "isActive")).toBe(false);
    });
  });

  describe("isArrayField", () => {
    it("should return true for array fields", () => {
      expect(isArrayField(testSchema, "tags")).toBe(true);
      expect(isArrayField(testSchema, "optionalTags")).toBe(true);
      expect(isArrayField(testSchema, "scores")).toBe(true);
    });

    it("should return false for non-array fields", () => {
      expect(isArrayField(testSchema, "username")).toBe(false);
      expect(isArrayField(testSchema, "age")).toBe(false);
      expect(isArrayField(testSchema, "address")).toBe(false);
    });
  });

  describe("isObjectField", () => {
    it("should return true for object fields", () => {
      expect(isObjectField(testSchema, "address")).toBe(true);
      expect(isObjectField(testSchema, "optionalMetadata")).toBe(true);
    });

    it("should return false for non-object fields", () => {
      expect(isObjectField(testSchema, "username")).toBe(false);
      expect(isObjectField(testSchema, "age")).toBe(false);
      expect(isObjectField(testSchema, "tags")).toBe(false);
    });
  });

  describe("isEnumField", () => {
    it("should return true for enum and literal fields", () => {
      expect(isEnumField(testSchema, "role")).toBe(true);
      expect(isEnumField(testSchema, "status")).toBe(true);
      expect(isEnumField(testSchema, "priority")).toBe(true);
    });

    it("should return false for non-enum fields", () => {
      expect(isEnumField(testSchema, "username")).toBe(false);
      expect(isEnumField(testSchema, "age")).toBe(false);
      expect(isEnumField(testSchema, "isActive")).toBe(false);
    });
  });
});

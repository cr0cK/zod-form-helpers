import type { ZodObjectSchema, FieldName, ValidationError } from "../types.js";
import { pickField } from "../types.js";

/**
 * Validate a single field value against the schema
 * Returns true if valid, false if invalid
 */
export function validateField<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>,
  value: any
): boolean {
  const result = pickField(schema, field).safeParse({ [field]: value });
  return result.success;
}

/**
 * Get error message for a field validation failure
 * Returns the error message, or undefined if validation passes
 */
export function getErrorMessage<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>,
  value: any
): string | undefined {
  const result = pickField(schema, field).safeParse({ [field]: value });

  if (result.success) {
    return undefined;
  }

  // Get the first error message
  const issues = (result.error as any).issues || [];
  const firstError = issues[0];
  return firstError?.message;
}

/**
 * Get error type/code for a field validation failure
 * Returns the error code, or undefined if validation passes
 */
export function getErrorType<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>,
  value: any
): string | undefined {
  const result = pickField(schema, field).safeParse({ [field]: value });

  if (result.success) {
    return undefined;
  }

  // Get the first error code
  const issues = (result.error as any).issues || [];
  const firstError = issues[0];
  return firstError?.code;
}

/**
 * Get all validation errors for a field
 * Returns array of ValidationError objects, or empty array if valid
 */
export function getFieldErrors<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>,
  value: any
): ValidationError[] {
  const result = pickField(schema, field).safeParse({ [field]: value });

  if (result.success) {
    return [];
  }

  const issues = (result.error as any).issues || [];
  return issues.map((err: any) => ({
    field: String(field),
    message: err.message,
    code: err.code,
    path: err.path,
  }));
}

/**
 * Get all validation errors for an entire object
 * Returns array of ValidationError objects, or empty array if valid
 */
export function getAllErrors<T extends ZodObjectSchema>(
  schema: T,
  data: Record<string, any>
): ValidationError[] {
  const result = schema.safeParse(data);

  if (result.success) {
    return [];
  }

  const issues = (result.error as any).issues || [];
  return issues.map((err: any) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
    path: err.path,
  }));
}

/**
 * Get custom error message based on error type
 * Provides more user-friendly messages than default Zod messages
 */
export function getCustomErrorMessage<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>,
  value: any
): string | undefined {
  const errors = getFieldErrors(schema, field, value);

  if (errors.length === 0) {
    return undefined;
  }

  const error = errors[0];
  if (!error) {
    return undefined;
  }

  const fieldName = String(field);

  switch (error.code) {
    case "invalid_type":
      if (value === undefined || value === null || value === "") {
        return `${fieldName} is required`;
      }
      return `${fieldName} must be of the correct type`;

    case "too_small":
      return `${fieldName} is too short or small`;

    case "too_big":
      return `${fieldName} is too long or large`;

    case "invalid_string":
      return `${fieldName} format is invalid`;

    case "invalid_format":
      return `${fieldName} format is invalid`;

    default:
      return error.message;
  }
}

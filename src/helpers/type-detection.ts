import type { ZodObjectSchema, FieldName, FieldType } from "../types.js";
import { pickField } from "../types.js";

/**
 * Get the base type of a field (string, number, boolean, etc.)
 */
export function getFieldType<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): FieldType {
  const fieldSchema = schema.shape[field];

  // Handle ZodOptional and ZodNullable wrappers
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  const fieldType = unwrapped.def?.type || unwrapped.type;

  if (fieldType === "string") return "string";
  if (fieldType === "number") return "number";
  if (fieldType === "boolean") return "boolean";
  if (fieldType === "date") return "date";
  if (fieldType === "array") return "array";
  if (fieldType === "object") return "object";
  if (fieldType === "enum") return "enum";
  if (fieldType === "literal") return "literal";
  if (fieldType === "union") {
    // Check if it's a union of literals (enum-like)
    const options = unwrapped.def?.options || [];
    if (options.every((opt: any) => (opt.def?.type || opt.type) === "literal")) {
      return "enum";
    }
  }

  return "unknown";
}

/**
 * Check if a field accepts string values
 */
export function isStringField<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return getFieldType(schema, field) === "string";
}

/**
 * Check if a field accepts number values
 */
export function isNumberField<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return getFieldType(schema, field) === "number";
}

/**
 * Check if a field accepts boolean values
 */
export function isBooleanField<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return getFieldType(schema, field) === "boolean";
}

/**
 * Check if a field accepts date values
 */
export function isDateField<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return getFieldType(schema, field) === "date";
}

/**
 * Check if a field accepts array values
 */
export function isArrayField<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return getFieldType(schema, field) === "array";
}

/**
 * Check if a field accepts object values
 */
export function isObjectField<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return getFieldType(schema, field) === "object";
}

/**
 * Check if a field is an enum (has limited set of values)
 */
export function isEnumField<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  const type = getFieldType(schema, field);
  return type === "enum" || type === "literal";
}

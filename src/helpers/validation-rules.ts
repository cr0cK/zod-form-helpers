import type { ZodObjectSchema, FieldName } from "../types.js";
import { pickField } from "../types.js";

/**
 * Check if a field is required (rejects undefined)
 */
export function isRequired<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return !pickField(schema, field).safeParse({}).success;
}

/**
 * Check if a field is optional (accepts undefined)
 */
export function isOptional<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return pickField(schema, field).safeParse({}).success;
}

/**
 * Check if a field is nullable (accepts null)
 */
export function isNullable<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return pickField(schema, field).safeParse({ [field]: null }).success;
}

/**
 * Get minimum length constraint for string/array fields
 * Returns undefined if no minimum is set
 */
export function getMinLength<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): number | undefined {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // Only return length constraints for string or array types
  const type = unwrapped.type || unwrapped.def?.type;
  if (type !== "string" && type !== "array") {
    return undefined;
  }

  // In Zod v4, check for array with min in _zod.bag or string with minLength property
  if (unwrapped._zod?.bag?.minimum !== undefined) {
    return unwrapped._zod.bag.minimum;
  }

  // For strings, minLength is a direct property (returns null if not set)
  return unwrapped.minLength !== null ? unwrapped.minLength : undefined;
}

/**
 * Get maximum length constraint for string/array fields
 * Returns undefined if no maximum is set
 */
export function getMaxLength<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): number | undefined {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // Only return length constraints for string or array types
  const type = unwrapped.type || unwrapped.def?.type;
  if (type !== "string" && type !== "array") {
    return undefined;
  }

  // In Zod v4, check for array with max in _zod.bag or string with maxLength property
  if (unwrapped._zod?.bag?.maximum !== undefined) {
    return unwrapped._zod.bag.maximum;
  }

  // For strings, maxLength is a direct property (returns null if not set)
  return unwrapped.maxLength !== null ? unwrapped.maxLength : undefined;
}

/**
 * Get minimum value constraint for number fields
 * Returns undefined if no minimum is set
 */
export function getMinValue<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): number | undefined {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // In Zod v4, minValue is a direct property
  if (unwrapped.minValue !== undefined && unwrapped.minValue !== -Infinity && unwrapped.minValue !== null) {
    return unwrapped.minValue;
  }

  return undefined;
}

/**
 * Get maximum value constraint for number fields
 * Returns undefined if no maximum is set
 */
export function getMaxValue<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): number | undefined {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // In Zod v4, maxValue is a direct property
  if (unwrapped.maxValue !== undefined && unwrapped.maxValue !== Infinity && unwrapped.maxValue !== null) {
    return unwrapped.maxValue;
  }

  return undefined;
}

/**
 * Get regex pattern for string fields
 * Returns undefined if no pattern is set
 */
export function getPattern<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): RegExp | undefined {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // In Zod v4, regex pattern is stored in _zod.pattern when format is 'regex'
  if (unwrapped.format === "regex" && unwrapped._zod?.pattern) {
    return unwrapped._zod.pattern;
  }

  return undefined;
}

/**
 * Check if field has email validation
 */
export function hasEmailValidation<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // Check for string with email check
  // In Zod v4, look for email in format property or checks
  const checks = unwrapped.def?.checks || [];
  return checks.some((c: any) => c.kind === "email") || unwrapped.format === "email";
}

/**
 * Check if field has URL validation
 */
export function hasUrlValidation<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // In Zod v4, look for url in format property or checks
  const checks = unwrapped.def?.checks || [];
  return checks.some((c: any) => c.kind === "url") || unwrapped.format === "url";
}

/**
 * Check if field has UUID validation
 */
export function hasUuidValidation<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // In Zod v4, look for uuid in format property or checks
  const checks = unwrapped.def?.checks || [];
  return checks.some((c: any) => c.kind === "uuid") || unwrapped.format === "uuid";
}

/**
 * Get exact length constraint for string fields
 * Returns undefined if no exact length is set
 */
export function getExactLength<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): number | undefined {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // In Zod v4, when .length() is used, both minLength and maxLength are set to the same value
  if (unwrapped.minLength !== null && unwrapped.minLength !== undefined &&
      unwrapped.maxLength !== null && unwrapped.maxLength !== undefined &&
      unwrapped.minLength === unwrapped.maxLength) {
    return unwrapped.minLength;
  }

  return undefined;
}

import type { ZodObjectSchema, FieldName, HTMLInputType } from "../types.js";
import {
  getFieldType,
  isStringField,
  isNumberField,
  isBooleanField,
  isDateField,
  isEnumField,
} from "./type-detection.js";
import {
  hasEmailValidation,
  hasUrlValidation,
  getMinValue,
  getMaxValue,
} from "./validation-rules.js";

/**
 * Get the appropriate HTML input type for a form field
 */
export function getInputType<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): HTMLInputType {
  const fieldType = getFieldType(schema, field);

  // Check for specific string validations
  if (isStringField(schema, field)) {
    if (hasEmailValidation(schema, field)) return "email";
    if (hasUrlValidation(schema, field)) return "url";
    // Check for password-like field names
    const fieldName = String(field).toLowerCase();
    if (fieldName.includes("password")) return "password";
    if (fieldName.includes("phone") || fieldName.includes("tel")) return "tel";
    return "text";
  }

  if (isNumberField(schema, field)) return "number";
  if (isBooleanField(schema, field)) return "checkbox";
  if (isDateField(schema, field)) return "date";
  if (isEnumField(schema, field)) return "select";

  return "text";
}

/**
 * Get enum options for select/radio fields
 * Returns array of option values, or undefined if not an enum
 */
export function getEnumOptions<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): string[] | undefined {
  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    unwrapped = unwrapped.def.innerType;
  }

  // Handle ZodEnum - in Zod v4, .options is directly accessible
  if (unwrapped.def?.type === "enum" || unwrapped.type === "enum") {
    return unwrapped.options || unwrapped.def?.values || unwrapped.values;
  }

  // Handle ZodLiteral
  if (unwrapped.def?.type === "literal" || unwrapped.type === "literal") {
    return [unwrapped.def?.value || unwrapped.value];
  }

  // Handle ZodUnion of literals
  if (unwrapped.def?.type === "union" || unwrapped.type === "union") {
    const options = unwrapped.def?.options || unwrapped.options || [];
    const allLiterals = options.every((opt: any) => (opt.def?.type || opt.type) === "literal");
    if (allLiterals) {
      return options.map((opt: any) => opt.def?.value || opt.value);
    }
  }

  return undefined;
}

/**
 * Get default value for a field
 * Returns undefined if no default is set
 */
export function getDefaultValue<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): any {
  const fieldSchema = schema.shape[field];

  // Check for ZodDefault wrapper
  if (fieldSchema.def?.type === "default" || fieldSchema.type === "default") {
    const defaultFn = fieldSchema.def?.defaultValue || fieldSchema.defaultValue;
    return typeof defaultFn === "function" ? defaultFn() : defaultFn;
  }

  // Unwrap optional/nullable to check inner type
  let unwrapped: any = fieldSchema;
  while (unwrapped.def?.type === "optional" || unwrapped.def?.type === "nullable") {
    if (unwrapped.def?.type === "default" || unwrapped.type === "default") {
      const defaultFn = unwrapped.def?.defaultValue || unwrapped.defaultValue;
      return typeof defaultFn === "function" ? defaultFn() : defaultFn;
    }
    unwrapped = unwrapped.def?.innerType || unwrapped.innerType;
  }

  return undefined;
}

/**
 * Generate a placeholder text for a field based on its type and validations
 */
export function getPlaceholder<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): string {
  const fieldType = getFieldType(schema, field);
  const fieldName = String(field);

  if (hasEmailValidation(schema, field)) {
    return "example@email.com";
  }

  if (hasUrlValidation(schema, field)) {
    return "https://example.com";
  }

  if (isNumberField(schema, field)) {
    const min = getMinValue(schema, field);
    const max = getMaxValue(schema, field);
    if (min !== undefined && max !== undefined) {
      return `Enter a number between ${min} and ${max}`;
    }
    if (min !== undefined) {
      return `Enter a number (min: ${min})`;
    }
    if (max !== undefined) {
      return `Enter a number (max: ${max})`;
    }
    return "Enter a number";
  }

  if (isDateField(schema, field)) {
    return "Select a date";
  }

  if (isEnumField(schema, field)) {
    return `Select ${fieldName}`;
  }

  return `Enter ${fieldName}`;
}

/**
 * Generate a human-readable label for a field
 * Converts camelCase/snake_case to Title Case
 */
export function getLabel<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): string {
  const fieldName = String(field);

  // Convert camelCase or snake_case to space-separated words
  const words = fieldName
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .trim()
    .split(" ");

  // Capitalize first letter of each word
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Get the step value for number inputs
 * Returns 1 for integers, 0.01 for decimals with positive check, or undefined
 */
export function getStep<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): number | undefined {
  if (!isNumberField(schema, field)) {
    return undefined;
  }

  const fieldSchema = schema.shape[field];

  // Unwrap optional/nullable
  let unwrapped = fieldSchema;
  while (unwrapped._def?.typeName === "ZodOptional" || unwrapped._def?.typeName === "ZodNullable") {
    unwrapped = unwrapped._def.innerType;
  }

  const checks = unwrapped._def?.checks || [];

  // Check for integer constraint
  const hasInt = checks.some((c: any) => c.kind === "int");
  if (hasInt) return 1;

  // Check for multipleOf
  const multipleOf = checks.find((c: any) => c.kind === "multipleOf");
  if (multipleOf) return multipleOf.value;

  // Default to 0.01 for decimal numbers, or "any" (undefined)
  return undefined;
}

/**
 * Check if a field allows multiple selections (for array fields displayed as select)
 */
export function isMultiple<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
): boolean {
  return getFieldType(schema, field) === "array";
}

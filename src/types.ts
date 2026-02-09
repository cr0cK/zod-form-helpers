import { z } from "zod";

// Generic schema type that works with any Zod object schema
export type ZodObjectSchema = z.ZodObject<any>;

// Helper to extract field names from a schema
export type FieldName<T extends ZodObjectSchema> = keyof T["shape"];

// Helper to create properly typed pick object
export function pickField<T extends ZodObjectSchema>(
  schema: T,
  field: FieldName<T>
) {
  return schema.pick({ [field]: true } as any);
}

// Test value types for validation
export type TestValue = string | number | boolean | null | undefined | any[] | object | Date;

// Input types for HTML forms
export type HTMLInputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "time"
  | "datetime-local"
  | "checkbox"
  | "radio"
  | "select"
  | "textarea"
  | "file"
  | "range"
  | "color"
  | "hidden";

// Field type enumeration
export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "array"
  | "object"
  | "enum"
  | "literal"
  | "unknown";

// Validation error information
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  path: (string | number)[];
}

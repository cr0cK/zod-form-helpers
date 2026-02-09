import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().optional(),
  age: z.number().min(0).max(120),
  email: z.string().email(),
  isActive: z.boolean(),
});

type FieldName = keyof typeof schema.shape;

// Helper to create a properly typed pick object
const pickField = (field: FieldName) =>
  schema.pick({ [field]: true } as { [K in FieldName]: true });

// Check if field is required (rejects undefined)
export const isRequired = (field: FieldName) =>
  !pickField(field).safeParse({}).success;

// Check if field accepts numbers
export const acceptsNumber = (field: FieldName) =>
  pickField(field).safeParse({ [field]: 50 }).success;

// Check if field accepts strings
export const acceptsString = (field: FieldName) => {
  // Try with a string that should pass basic string validation
  const longString = "test string with enough length";
  const emailString = "test@example.com";

  // Try both and return true if either works
  return pickField(field).safeParse({ [field]: longString }).success ||
         pickField(field).safeParse({ [field]: emailString }).success;
};

// Check if field accepts booleans
export const acceptsBoolean = (field: FieldName) =>
  pickField(field).safeParse({ [field]: true }).success;

// Check if field accepts null
export const acceptsNull = (field: FieldName) =>
  pickField(field).safeParse({ [field]: null }).success;

// Check if field accepts arrays
export const acceptsArray = (field: FieldName) =>
  pickField(field).safeParse({ [field]: [] }).success;

// Check if field accepts objects
export const acceptsObject = (field: FieldName) =>
  pickField(field).safeParse({ [field]: {} }).success;

// Check if field rejects empty string (has min length)
export const rejectsEmptyString = (field: FieldName) => {
  // First check if it accepts strings at all
  if (!acceptsString(field)) return false;
  // Then check if empty string is rejected
  return !pickField(field).safeParse({ [field]: "" }).success;
};

// Check if field validates email format
export const requiresEmailFormat = (field: FieldName) =>
  !pickField(field).safeParse({ [field]: "notanemail" }).success &&
  pickField(field).safeParse({ [field]: "test@example.com" }).success;

// Check if field rejects negative numbers
export const rejectsNegative = (field: FieldName) => {
  // First check if it accepts numbers at all
  if (!acceptsNumber(field)) return false;
  // Then check if negative is rejected
  return !pickField(field).safeParse({ [field]: -1 }).success;
};

// Check if field rejects large numbers (has max)
export const hasMaxConstraint = (field: FieldName, testValue: number = 9999) => {
  // First check if it accepts numbers at all
  if (!acceptsNumber(field)) return false;
  // Then check if large value is rejected
  return !pickField(field).safeParse({ [field]: testValue }).success;
};

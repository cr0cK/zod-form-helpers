// Export all types
export * from "./types.js";

// Export type detection helpers
export {
  getFieldType,
  isStringField,
  isNumberField,
  isBooleanField,
  isDateField,
  isArrayField,
  isObjectField,
  isEnumField,
} from "./helpers/type-detection.js";

// Export validation rule helpers
export {
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
} from "./helpers/validation-rules.js";

// Export form generation helpers
export {
  getInputType,
  getEnumOptions,
  getDefaultValue,
  getPlaceholder,
  getLabel,
  getStep,
  isMultiple,
} from "./helpers/form-generation.js";

// Export error handling helpers
export {
  validateField,
  getErrorMessage,
  getErrorType,
  getFieldErrors,
  getAllErrors,
  getCustomErrorMessage,
} from "./helpers/error-handling.js";

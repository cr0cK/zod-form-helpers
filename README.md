# zod-form-helpers

A comprehensive utility library for working with Zod schemas. Extract field types, validation rules, generate form inputs, and handle errors with ease.

## Features

- 🔍 **Type Detection** - Determine field types from Zod schemas
- ✅ **Validation Rules** - Extract min/max, patterns, and validation constraints
- 📝 **Form Generation** - Generate HTML input types, placeholders, and labels
- 🚨 **Error Handling** - Validate fields and extract user-friendly error messages
- 💪 **TypeScript First** - Full type safety with TypeScript support
- 🎯 **Zero Dependencies** - Only peer dependency on Zod

## Installation

```bash
npm install zod-form-helpers
```

```bash
yarn add zod-form-helpers
```

```bash
pnpm add zod-form-helpers
```

## Requirements

- Node.js >= 18.0.0
- Zod >= 3.0.0 (peer dependency)

## Usage

### Type Detection

```typescript
import { z } from 'zod';
import { getFieldType, isStringField, isNumberField } from 'zod-form-helpers';

const schema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

// Get field type
const nameType = getFieldType(schema, 'name'); // "string"
const ageType = getFieldType(schema, 'age'); // "number"

// Type checking
isStringField(schema, 'name'); // true
isNumberField(schema, 'age'); // true
```

### Validation Rules

```typescript
import { z } from 'zod';
import {
  isRequired,
  isOptional,
  getMinLength,
  getMaxLength,
  getMinValue,
  getMaxValue,
  hasEmailValidation,
} from 'zod-form-helpers';

const schema = z.object({
  username: z.string().min(3).max(20),
  age: z.number().min(18).max(100),
  email: z.string().email(),
  bio: z.string().optional(),
});

// Check if required
isRequired(schema, 'username'); // true
isOptional(schema, 'bio'); // true

// Get length constraints
getMinLength(schema, 'username'); // 3
getMaxLength(schema, 'username'); // 20

// Get value constraints
getMinValue(schema, 'age'); // 18
getMaxValue(schema, 'age'); // 100

// Check validation types
hasEmailValidation(schema, 'email'); // true
```

### Form Generation

```typescript
import { z } from 'zod';
import {
  getInputType,
  getPlaceholder,
  getLabel,
  getEnumOptions,
} from 'zod-form-helpers';

const schema = z.object({
  email: z.string().email(),
  age: z.number(),
  role: z.enum(['admin', 'user', 'guest']),
});

// Get HTML input type
getInputType(schema, 'email'); // "email"
getInputType(schema, 'age'); // "number"
getInputType(schema, 'role'); // "select"

// Get field label
getLabel(schema, 'email'); // "Email"
getLabel(schema, 'age'); // "Age"

// Get enum options
getEnumOptions(schema, 'role'); // ["admin", "user", "guest"]
```

### Error Handling

```typescript
import { z } from 'zod';
import {
  validateField,
  getErrorMessage,
  getFieldErrors,
  getAllErrors,
} from 'zod-form-helpers';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

// Validate a single field
const emailValidation = validateField(schema, 'email', 'invalid-email');
if (!emailValidation.success) {
  console.log(getErrorMessage(emailValidation.error));
  // "Invalid email"
}

// Validate entire object
const result = schema.safeParse({ email: 'test@example.com', age: 15 });
if (!result.success) {
  // Get all errors
  const allErrors = getAllErrors(result.error);
  console.log(allErrors);
  // { age: ["Number must be greater than or equal to 18"] }

  // Get errors for specific field
  const ageErrors = getFieldErrors(result.error, 'age');
  console.log(ageErrors); // ["Number must be greater than or equal to 18"]
}
```

## API Reference

### Type Detection

- `getFieldType(schema, field)` - Get the type of a field
- `isStringField(schema, field)` - Check if field is string
- `isNumberField(schema, field)` - Check if field is number
- `isBooleanField(schema, field)` - Check if field is boolean
- `isDateField(schema, field)` - Check if field is date
- `isArrayField(schema, field)` - Check if field is array
- `isObjectField(schema, field)` - Check if field is object
- `isEnumField(schema, field)` - Check if field is enum

### Validation Rules

- `isRequired(schema, field)` - Check if field is required
- `isOptional(schema, field)` - Check if field is optional
- `isNullable(schema, field)` - Check if field is nullable
- `getMinLength(schema, field)` - Get minimum length constraint
- `getMaxLength(schema, field)` - Get maximum length constraint
- `getMinValue(schema, field)` - Get minimum value constraint
- `getMaxValue(schema, field)` - Get maximum value constraint
- `getExactLength(schema, field)` - Get exact length constraint
- `getPattern(schema, field)` - Get regex pattern constraint
- `hasEmailValidation(schema, field)` - Check if has email validation
- `hasUrlValidation(schema, field)` - Check if has URL validation
- `hasUuidValidation(schema, field)` - Check if has UUID validation

### Form Generation

- `getInputType(schema, field)` - Get HTML input type
- `getEnumOptions(schema, field)` - Get enum options
- `getDefaultValue(schema, field)` - Get default value
- `getPlaceholder(schema, field)` - Get placeholder text
- `getLabel(schema, field)` - Get field label
- `getStep(schema, field)` - Get step for number inputs
- `isMultiple(schema, field)` - Check if allows multiple values

### Error Handling

- `validateField(schema, field, value)` - Validate a single field
- `getErrorMessage(error)` - Get formatted error message
- `getErrorType(error)` - Get error type
- `getFieldErrors(error, field)` - Get errors for a specific field
- `getAllErrors(error)` - Get all errors organized by field
- `getCustomErrorMessage(error)` - Get custom error message if available

## TypeScript Support

This library is written in TypeScript and provides full type safety:

```typescript
import { z } from 'zod';
import { FieldName, ZodObjectSchema, FieldType } from 'zod-form-helpers';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

// Type-safe field names
type Fields = FieldName<typeof schema>; // "name" | "age"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Alexis MINEAUD

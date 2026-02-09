import { z } from "zod";

// Comprehensive test schema covering all helper scenarios
export const testSchema = z.object({
  // String fields
  username: z.string().min(3).max(20),
  bio: z.string().optional(),
  email: z.string().email(),
  website: z.string().url(),
  uuid: z.string().uuid(),
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/),
  password: z.string().min(8),

  // Number fields
  age: z.number().min(0).max(120),
  score: z.number().optional(),
  rating: z.number().min(1).max(5),
  price: z.number().positive(),
  temperature: z.number(),

  // Boolean fields
  isActive: z.boolean(),
  acceptTerms: z.boolean(),
  newsletter: z.boolean().optional(),

  // Date fields
  birthDate: z.date(),
  createdAt: z.date().optional(),

  // Array fields
  tags: z.array(z.string()),
  optionalTags: z.array(z.string()).optional(),
  scores: z.array(z.number()).min(1).max(10),

  // Object fields
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
  }),
  optionalMetadata: z.object({
    key: z.string(),
    value: z.string(),
  }).optional(),

  // Enum/Literal fields
  role: z.enum(["admin", "user", "guest"]),
  status: z.literal("active"),
  priority: z.union([z.literal("low"), z.literal("medium"), z.literal("high")]),

  // Nullable fields
  middleName: z.string().nullable(),
  alternateEmail: z.string().email().nullable().optional(),

  // Special validations
  confirmPassword: z.string(),
  code: z.string().length(6),
});

export type TestSchemaType = z.infer<typeof testSchema>;

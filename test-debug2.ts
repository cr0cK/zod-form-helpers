import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().optional(),
  age: z.number().min(0).max(120),
  email: z.string().email(),
  isActive: z.boolean(),
});

// Test age field directly
const ageTest1 = schema.pick({ age: true }).safeParse({ age: 123 });
console.log('age with 123:', ageTest1);

// Test firstName with "test"
const firstNameTest = schema.pick({ firstName: true }).safeParse({ firstName: "test" });
console.log('firstName with "test":', firstNameTest);

// Test email with "test"
const emailTest = schema.pick({ email: true }).safeParse({ email: "test" });
console.log('email with "test":', emailTest);

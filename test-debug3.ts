import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

const result = schema.safeParse({ email: "" });
console.log('email with empty string:', result);

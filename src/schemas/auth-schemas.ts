import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Required"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.email(),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .max(256, "At most 256 charaters"),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

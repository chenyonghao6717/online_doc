import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Required"),
});

export type SignInSchema = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.email(),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .max(256, "At most 256 charaters"),
});

export type SignUpSchema = z.infer<typeof SignUpSchema>;

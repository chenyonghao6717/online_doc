import { z } from "zod";

export const commaSeparatedEmailsSchema = z
  .string()
  .transform((val) => val.split(",").map((s) => s.trim()))
  .refine(
    (emails) => emails.every((email) => z.email().safeParse(email).success),
    { message: "One or more emails are invalid" },
  );

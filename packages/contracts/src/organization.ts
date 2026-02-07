import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name must have at least 1 letter"),
  slug: z.string().min(1, "Organization slug must have at least 1 letter"),
});

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;

export const commaSeparatedEmailsSchema = z
  .string()
  .transform((val) => val.split(",").map((s) => s.trim()))
  .refine(
    (emails) => emails.every((email) => z.email().safeParse(email).success),
    { message: "One or more emails are invalid" },
  );

export type CommaSeparatedEmailsSchema = z.infer<
  typeof commaSeparatedEmailsSchema
>;

export const addMembersSchema = z.object({
  emails: z.array(z.email()),
  role: z.union([z.literal("admin"), z.literal("owner"), z.literal("member")]),
});

export type AddMembersSchema = z.infer<typeof addMembersSchema>;

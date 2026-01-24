import { z } from "zod";

const commaSeparatedEmailsSchema = z
  .string()
  .transform((val) => val.split(",").map((s) => s.trim()))
  .refine(
    (emails) => emails.every((email) => z.email().safeParse(email).success),
    { message: "One or more emails are invalid" }
  );

export const addMembers = async (
  commaSeparatedEmails: string,
  organizationId: string
) => {
  const parseResult =
    commaSeparatedEmailsSchema.safeParse(commaSeparatedEmails);
  if (!parseResult.success) {
    throw new Error("One or more emails are invalid");
  }

  const res = await fetch(`/api/organizations/${organizationId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emails: parseResult.data,
      role: "member",
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to add members");
  }
};

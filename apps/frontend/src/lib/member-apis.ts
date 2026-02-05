import { commaSeparatedEmailsSchema } from "@online-document/contracts/member";

export const addMembers = async (
  commaSeparatedEmails: string,
  organizationId: string,
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

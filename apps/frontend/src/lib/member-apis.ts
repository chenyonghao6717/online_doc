import { commaSeparatedEmailsSchema } from "@online-document/contracts/organization";
import { apiFetch } from "./api";

export const addMembers = async (
  commaSeparatedEmails: string,
  organizationId: string,
) => {
  const parseResult =
    commaSeparatedEmailsSchema.safeParse(commaSeparatedEmails);
  if (!parseResult.success) {
    throw new Error("One or more emails are invalid");
  }

  await apiFetch(`/api/organizations/${organizationId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emails: parseResult.data,
      role: "member",
    }),
  });
};

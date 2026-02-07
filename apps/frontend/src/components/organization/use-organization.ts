import { authClient } from "@/lib/auth-client";

export const useOrganization = () => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const { data: organizations, isPending: isOrgPending } =
    authClient.useListOrganizations();

  const activeOrg = organizations?.find(
    (org) => org.id === session?.session.activeOrganizationId,
  );

  return {
    activeOrg,
    userOrganizations: organizations,
    isPending: isSessionPending || isOrgPending,
  };
};

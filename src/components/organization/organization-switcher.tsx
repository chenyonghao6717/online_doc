import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import CreateOrganizationDialog from "./create-organization-dialog";
import AddMembersDialog from "@/components/organization/add-members-dialog";

const OrganizationSwitcher = () => {
  const [open, setOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const { data: organizations } = authClient.useListOrganizations();

  const activeOrganization = organizations?.find(
    (org) => org.id === session?.session.activeOrganizationId
  );

  const activateOrganization = async (orgId: string | null) => {
    await authClient.organization.setActive({
      organizationId: orgId,
    });
  };

  const trigger = (
    <PopoverTrigger asChild>
      <Button variant="ghost" className="max-w-[100px] md:max-w-[200px]">
        <span className="truncate">
          {activeOrganization ? activeOrganization.name : "Personal Account"}
        </span>
        {!open && <ChevronDown />}
        {open && <ChevronUp />}
      </Button>
    </PopoverTrigger>
  );

  const organizationButtons = (
    <div className="flex flex-col">
      <Button variant="ghost" onClick={() => activateOrganization(null)}>
        Personal Account
        {!activeOrganization && <Check />}
      </Button>
      {organizations?.map((org) => (
        <Button
          variant="ghost"
          key={org.id}
          onClick={() => activateOrganization(org.id)}
        >
          {org.name}
          {activeOrganization?.id === org.id && <Check />}
        </Button>
      ))}
    </div>
  );

  const content = (
    <PopoverContent className="w-auto">
      <div className="flex flex-col gap-y-1">
        {organizationButtons}
        <Separator />
        <CreateOrganizationDialog />
        {activeOrganization && (
          <AddMembersDialog organizationId={activeOrganization.id} />
        )}
      </div>
    </PopoverContent>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {trigger}
      {content}
    </Popover>
  );
};

export default OrganizationSwitcher;

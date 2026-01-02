import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, ChevronUp, CirclePlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAppStore } from "@/components/stores/app-store";
import { toast } from "sonner";
import { FormFieldWrapper } from "@/components/auth/form-field-wrapper";

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Must have at least 1 char").max(100),
  slug: z.string().min(1, "Must have at least 1 char").max(100),
});

type CreateOrganizationSchemaType = z.infer<typeof createOrganizationSchema>;

const CreateOrganizationDialog = () => {
  const { startLoading, stopLoading } = useAppStore();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateOrganizationSchemaType>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const handleSubmit = async (values: CreateOrganizationSchemaType) => {
    startLoading();
    try {
      const { error } = await authClient.organization.create({
        name: values.name,
        slug: values.slug,
        keepCurrentActiveOrganization: false,
      });
      if (error) {
        toast.error(error.message || "Failed to create organization!");
      } else {
        toast.success("Created successfully!");
      }
    } finally {
      setOpen(false);
      stopLoading();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <CirclePlus />
          Create an organization
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Create an organization</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-4"
          >
            <FormFieldWrapper
              name="name"
              type="name"
              placeholder="Enter name"
              control={form.control}
              label="Name"
            />
            <FormFieldWrapper
              name="slug"
              type="slug"
              placeholder="Enter slug"
              control={form.control}
              label="Slug"
            />
            <Button size="lg" className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

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

  const content = (
    <PopoverContent className="w-auto">
      <div className="flex flex-col gap-y-1">
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
        <Separator />
        <CreateOrganizationDialog />
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

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
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
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";
import { FormFieldWrapper } from "@/components/auth/form-field-wrapper";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

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
          Create a new organization
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Create a new organization</DialogTitle>
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

export default CreateOrganizationDialog;

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddMemberDialogProps {
  organizationId: string;
}

const emailTextareaPlaceholder = "example@example.com, example2@email.com";

const AddMembersDialog = ({ organizationId }: AddMemberDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <UserRoundPlus /> Add members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add members</DialogTitle>
        <div>
          <Textarea placeholder={emailTextareaPlaceholder} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersDialog;

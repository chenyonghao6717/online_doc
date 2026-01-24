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
import { addMembers } from "@/lib/api/members";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";

interface AddMemberDialogProps {
  organizationId: string;
}

const emailTextareaPlaceholder = "example@example.com, example2@email.com";

const AddMembersDialog = ({ organizationId }: AddMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState("");
  const { startLoading, stopLoading } = useAppStore();

  const handleSubmit = async () => {
    startLoading();
    try {
      await addMembers(emails, organizationId);
      toast.success("Add member successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setOpen(false);
      stopLoading();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <UserRoundPlus /> Add members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add members</DialogTitle>
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder={emailTextareaPlaceholder}
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          <Button onClick={handleSubmit}>Invite</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersDialog;

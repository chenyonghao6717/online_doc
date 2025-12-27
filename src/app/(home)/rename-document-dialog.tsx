import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Document } from "@/generated/prisma/browser";
import { updateDocumentTitle } from "@/lib/api/document";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface RenameDocumentDialogProps {
  document: Document;
  children: React.ReactNode;
}

const RenameDocumentDialog = ({
  document,
  children,
}: RenameDocumentDialogProps) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(document.title);
  const [open, setOpen] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: updateDocumentTitle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["home-page", "documents-table"],
      });
      toast.success("Rename successfully!");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutateAsync({
        id: document.id,
        title: title.trim() || "Untitled",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Rename document</DialogTitle>
            <DialogDescription>
              Enter a new name for this document
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document name"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              type="button"
              variant="ghost"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              onClick={(e) => e.stopPropagation()}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDocumentDialog;

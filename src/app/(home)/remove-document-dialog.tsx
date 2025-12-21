import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Document } from "@/generated/prisma/browser";
import { deleteDocument } from "@/lib/api/document";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface RemoveDocumentDialogProps {
  document: Document;
  children: React.ReactNode;
}

const RemoveDocumentDialog = ({
  document,
  children,
}: RemoveDocumentDialogProps) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.error("Document has been deleted!");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const header = (
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        document.
      </AlertDialogDescription>
    </AlertDialogHeader>
  );

  const footer = (
    <AlertDialogFooter>
      <AlertDialogCancel
        onClick={(e) => {
          e.stopPropagation();
        }}
        disabled={isPending}
      >
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        disabled={isPending}
        onClick={async (e) => {
          e.stopPropagation();
          await mutateAsync(document.id);
        }}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  );

  const content = (
    <AlertDialogContent
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {header}
      {footer}
    </AlertDialogContent>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      {content}
    </AlertDialog>
  );
};

export default RemoveDocumentDialog;

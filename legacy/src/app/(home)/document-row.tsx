import { TableCell, TableRow } from "@/components/ui/table";
import { Document } from "@/generated/prisma/browser";
import {
  Building2Icon,
  CircleUserIcon,
  ExternalLinkIcon,
  FilePenIcon,
  MoreVertical,
  TrashIcon,
} from "lucide-react";
import { SiGoogledocs } from "react-icons/si";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RemoveDocumentDialog from "@/app/(home)/remove-document-dialog";
import RenameDocumentDialog from "./rename-document-dialog";
import { useRouter } from "next/navigation";

interface DocumentMenuProps {
  document: Document;
  onNewTab: (id: string) => void;
}

const DocumentMenu = ({ document, onNewTab }: DocumentMenuProps) => {
  const content = (
    <DropdownMenuContent>
      <RenameDocumentDialog document={document}>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <FilePenIcon className="size-4 mr-2" />
          Rename
        </DropdownMenuItem>
      </RenameDocumentDialog>
      <RemoveDocumentDialog document={document}>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <TrashIcon className="size-4 mr-2" />
          Remove
        </DropdownMenuItem>
      </RemoveDocumentDialog>
      <DropdownMenuItem onClick={() => onNewTab(document.id)}>
        <ExternalLinkIcon className="size-4 mr-2" />
        Open in a new tab
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      {content}
    </DropdownMenu>
  );
};

interface DocumentRowProps {
  document: Document;
}

const DocumentRow = ({ document }: DocumentRowProps) => {
  const router = useRouter();

  const onNewTabClick = (id: string) => {
    window.open(`/documents/${id}`, "_blank");
  };

  const onRowClick = (id: string) => {
    router.push(`/documents/${id}`);
  };

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => onRowClick(document.id)}
    >
      <TableCell className="w-[50px]">
        <SiGoogledocs className="size-6 fill-blue-500" />
      </TableCell>
      <TableCell className="font-medium md:w-[45%]">{document.title}</TableCell>
      <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
        {document.organizationId ? (
          <Building2Icon className="size-4" />
        ) : (
          <CircleUserIcon className="size-4" />
        )}
        {document.organizationId ? "Organization" : "Personal"}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        {format(new Date(document.createdAt), "MMM dd, yyyy")}
      </TableCell>
      <TableCell className="flex justify-end">
        <DocumentMenu document={document} onNewTab={onNewTabClick} />
      </TableCell>
    </TableRow>
  );
};

export default DocumentRow;

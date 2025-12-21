"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { searchDocuments, SearchDocumentsResponse } from "@/lib/api/document";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isEmpty } from "lodash-es";
import DocumentRow from "./document-row";

const DocumentsTable = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: searchDocuments,
    onError: () => {
      toast.error("Load documents failed!");
    },
  });

  const [searchDocumentsRes, setSearchDocumentsRes] = useState<
    SearchDocumentsResponse | undefined
  >();

  useEffect(() => {
    (async () => {
      const res = await mutateAsync({ limit: 10, page: 1 });
      setSearchDocumentsRes(res);
    })();
  }, []);

  const loader = (
    <div className="flex justify-center items-center h-24">
      <LoaderIcon className="animate-spin text-muted-foreground size-5" />
    </div>
  );

  const tHeader = (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-none">
        <TableHead>Name</TableHead>
        <TableHead>&nbsp;</TableHead>
        <TableHead className="hidden md:table-cell">Shared</TableHead>
        <TableHead className="hidden md:table-cell">Created at</TableHead>
      </TableRow>
    </TableHeader>
  );

  const emptyTBody = (
    <TableBody>
      <TableRow className="hover:bg-transparent">
        <TableCell
          colSpan={4}
          className="h-24 text-center text-muted-foreground"
        >
          No documents found
        </TableCell>
      </TableRow>
    </TableBody>
  );

  const tBody = (
    <TableBody>
      {searchDocumentsRes?.documents.map((document) => (
        <DocumentRow key={document.id} document={document} />
      ))}
    </TableBody>
  );

  const table = (
    <Table>
      {tHeader}
      {isEmpty(searchDocumentsRes?.documents) ? emptyTBody : tBody}
    </Table>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {isPending ? loader : table}
    </div>
  );
};

export default DocumentsTable;

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { searchDocuments } from "@/lib/api/document";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isEmpty } from "lodash-es";
import DocumentRow from "./document-row";

const DocumentsTable = () => {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["home-page", "documents-table"],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await searchDocuments({
        limit: 10,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      return page * limit < total ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
  const documents = data?.pages.flatMap((page) => page.documents) ?? [];

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
      {documents.map((document) => (
        <DocumentRow key={document.id} document={document} />
      ))}
    </TableBody>
  );

  const table = (
    <Table>
      {tHeader}
      {isEmpty(documents) ? emptyTBody : tBody}
    </Table>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {isLoading ? loader : table}
    </div>
  );
};

export default DocumentsTable;

"use client";

import { Document } from "@/generated/prisma/browser";
import { searchDocuments } from "@/lib/api/document";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DocumentsTable = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: searchDocuments,
    onError: () => {
      toast.error("Load documents failed!");
    },
  });

  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    (async () => {
      const req = await mutateAsync({ limit: 1, page: 1 });
      setDocuments(req.documents);
    })();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {JSON.stringify(documents)}
    </div>
  );
};

export default DocumentsTable;

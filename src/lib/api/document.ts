import { Document } from "@/generated/prisma/browser";
import queryString from "query-string";

export const createDocument = async (body: {
  title?: string;
  initContent?: string;
}) => {
  const res = await fetch("/api/documents", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to create a document");
  }

  return (await res.json()) as { id: string };
};

interface SearchDocumentsResponse {
  total: number;
  page: number;
  limit: number;
  documents: Document[];
}

export const searchDocuments = async (queries: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const url = queryString.stringifyUrl({
    url: "/api/documents",
    query: queries,
  });
  const res = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Search documents failed");
  }

  return (await res.json()) as SearchDocumentsResponse;
};

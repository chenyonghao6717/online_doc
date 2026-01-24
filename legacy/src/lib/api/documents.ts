import { Document } from "@/generated/prisma/browser";
import queryString from "query-string";

export const createDocument = async (body: {
  title?: string;
  initContent?: string;
}) => {
  const res = await fetch("/api/documents", {
    method: "POST",
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

export interface SearchDocumentsResponse {
  total: number;
  page: number;
  limit: number;
  documents: Document[];
}

export const searchDocuments = async (queries: {
  search?: string;
  page?: number;
  limit?: number;
  organizationId?: string | null;
}) => {
  const url = queryString.stringifyUrl({
    url: "/api/documents",
    query: queries,
  });
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failded to search documents");
  }

  return (await res.json()) as SearchDocumentsResponse;
};

export const deleteDocument = async (id: string) => {
  const url = `/api/documents/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete document");
  }
};

export const updateDocumentTitle = async ({
  id,
  title,
}: {
  id: string;
  title: string;
}) => {
  const url = `/api/documents/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title }),
  });

  if (!res.ok) {
    throw new Error("Failed to update document");
  }
};

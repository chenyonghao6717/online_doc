import { type SearchDocumentsResponse } from "@online-document/contracts/document";
import queryString from "query-string";
import { apiFetch } from "@/lib/api";

export const createDocument = async (body: {
  title?: string;
  initContent?: string;
}) => {
  const res = await apiFetch("/api/documents", {
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
  const res = await apiFetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res as SearchDocumentsResponse;
};

export const deleteDocument = async (id: string) => {
  const url = `/api/documents/${id}`;
  const res = await apiFetch(url, {
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
  const res = await apiFetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title }),
  });

  if (!res.ok) {
    throw new Error("Failed to update document");
  }
};

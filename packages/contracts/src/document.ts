import { z } from "zod";
import { Document } from "@online-document/prisma/browser";

export const createDocumentSchema = z.object({
  title: z.optional(z.string()),
  initialContent: z.optional(z.string()),
  organizationId: z.optional(z.string().min(1)),
});

export type CreateDocumentSchema = z.infer<typeof createDocumentSchema>;

export interface SearchDocumentsResponse {
  total: number;
  page: number;
  limit: number;
  documents: Document[];
}

export const searchDocumentsSchema = z.object({
  search: z.optional(z.string()),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  organizationId: z.optional(z.string()),
});

export type SearchDocumentsSchema = z.infer<typeof searchDocumentsSchema>;

export const deleteDocumentSchema = z.object({
  id: z.string().min(1),
});

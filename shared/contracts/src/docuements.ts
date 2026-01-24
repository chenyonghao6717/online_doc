import { z } from "zod";

export const CreateDocumentSchema = z.object({
  title: z.optional(z.string()),
  initContent: z.optional(z.string()),
});

export type CreateDocumentSchema = z.infer<typeof CreateDocumentSchema>;

export interface SearchDocumentsResponse {
  total: number;
  page: number;
  limit: number;
  documents: Document[];
}

export const SearchDocumentsSchema = z.object({
  search: z.optional(z.string()),
  page: z.optional(z.number().min(1)),
  limit: z.optional(z.number().min(0)),
  organizationId: z.optional(z.string()),
});

export type SearchDocumentsSchema = z.infer<typeof SearchDocumentsSchema>;

export const DeleteDocumentSchema = z.object({
  id: z.string().min(1),
});

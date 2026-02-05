import { prisma } from "@/lib/db";
import { Session } from "@/lib/auth";
import { HTTPException } from "hono/http-exception";
import {
  type CreateDocumentSchema,
  type SearchDocumentsSchema,
  type SearchDocumentsResponse,
} from "@online-document/contracts/document";

export const getDocument = async (id: string, session: Session) => {
  const userId = session.user.id;

  const document = await prisma.document.findFirst({
    where: {
      id,
    },
  });

  if (document?.ownerId !== userId) {
    throw new HTTPException(400);
  }

  return document;
};

export const createDocument = async (
  payload: CreateDocumentSchema,
  session: Session,
) => {
  const document = await prisma.document.create({
    data: {
      ...payload,
      title: payload.title ?? "Untitled document",
      ownerId: session.user.id,
    },
  });
  return document;
};

export const searchDocuments = async (
  queries: SearchDocumentsSchema,
  session: Session,
): Promise<SearchDocumentsResponse> => {
  const [total, documents] = await Promise.all([
    prisma.document.count({
      where: {
        ownerId: session.user.id,
        title: {
          contains: queries.search || undefined,
          mode: "insensitive",
        },
        organizationId: queries.organizationId || undefined,
      },
    }),
    prisma.document.findMany({
      where: {
        ownerId: session.user.id,
        title: {
          contains: queries.search || undefined,
          mode: "insensitive",
        },
        organizationId: queries.organizationId || undefined,
      },
      skip: queries.limit * (queries.page - 1),
      take: queries.limit,
    }),
  ]);
  return {
    documents,
    total,
    page: queries.page,
    limit: queries.limit,
  };
};

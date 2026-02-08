import { prisma } from "@/lib/db";
import { type Session } from "@/lib/auth";
import { HTTPException } from "hono/http-exception";
import {
  type CreateDocumentSchema,
  type SearchDocumentsSchema,
  type SearchDocumentsResponse,
} from "@online-document/contracts/document";
import { auth } from "@/lib/auth";

const belongSameOrg = async (
  orgId: string | null,
  headers: Record<string, string>,
) => {
  const userOrgs = await auth.api.listOrganizations({
    headers,
  });
  return userOrgs.some((org) => org.id === orgId);
};

export const getDocument = async (
  id: string,
  session: Session,
  headers: Record<string, string>,
) => {
  const userId = session.user.id;

  const document = await prisma.document.findFirst({
    where: {
      id,
    },
  });

  if (!document) {
    throw new HTTPException(404);
  }

  if (document?.ownerId !== userId) {
    if (!(await belongSameOrg(document.organizationId, headers))) {
      throw new HTTPException(403);
    }
  }

  return document;
};

export const createDocument = async (
  request: CreateDocumentSchema,
  session: Session,
) => {
  const document = await prisma.document.create({
    data: {
      ...request,
      title: request.title ?? "Untitled document",
      ownerId: session.user.id,
      organizationId: request.organizationId,
    },
  });
  return document;
};

export const searchDocuments = async (
  queries: SearchDocumentsSchema,
  session: Session,
  headers: Record<string, string>,
): Promise<SearchDocumentsResponse> => {
  const userOrgIds = (
    await auth.api.listOrganizations({
      headers,
    })
  ).map((org) => org.id);

  // The current user must be in the org
  const verifiedOrgId =
    queries.organizationId && userOrgIds.includes(queries.organizationId)
      ? queries.organizationId
      : undefined;

  const [total, documents] = await Promise.all([
    prisma.document.count({
      where: {
        title: {
          contains: queries.search || undefined,
          mode: "insensitive",
        },
        ...(verifiedOrgId
          ? { organizationId: verifiedOrgId }
          : { ownerId: session.user.id }),
      },
    }),
    prisma.document.findMany({
      where: {
        title: {
          contains: queries.search || undefined,
          mode: "insensitive",
        },
        ...(verifiedOrgId
          ? { organizationId: verifiedOrgId }
          : { ownerId: session.user.id }),
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

export const deleteDocument = async (id: string, session: Session) => {
  const document = await prisma.document.findFirst({
    where: {
      id,
    },
  });

  if (!document) {
    throw new HTTPException(404);
  }

  if (document.ownerId !== session.user.id) {
    throw new HTTPException(403);
  }

  await prisma.document.delete({
    where: {
      id: document.id,
    },
  });
};

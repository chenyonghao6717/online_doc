import { Document } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { checkAndGetSession } from "@/lib/auth";
import { notFound } from "next/navigation";

const getDocument = async (id: string) => {
  const session = await checkAndGetSession();

  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    notFound();
  }

  checkOwnership(document, session.user.id);

  return document;
};

const checkOwnership = (document: Document, ownerId: string) => {
  if (document.ownerId !== ownerId) {
    throw new NextResponse(undefined, { status: 403 });
  }
};

interface GetDocumentParams {
  id: string;
}

export async function GET(
  req: Request,
  { params }: { params: GetDocumentParams }
) {
  const document = await getDocument(params.id);
  return NextResponse.json(document);
}

interface DocumentParams {
  id: string;
}

export async function DELETE(
  req: Request,
  { params }: { params: DocumentParams }
) {
  const document = await getDocument(params.id);
  await prisma.document.delete({
    where: {
      id: document.id,
    },
  });
  return new NextResponse(undefined, { status: 204 });
}

export async function PATCH(
  req: Request,
  { params }: { params: DocumentParams }
) {
  const document = await getDocument(params.id);
  const body = await req.json();
  await prisma.document.update({
    data: {
      title: body.title,
    },
    where: {
      id: document.id,
    },
  });
  return new NextResponse(undefined, { status: 201 });
}

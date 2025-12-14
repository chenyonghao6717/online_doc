import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface GetDocumentParams {
  id: string;
}

export async function GET(
  req: Request,
  { params }: { params: GetDocumentParams }
) {
  const document = await prisma.document.findUnique({
    where: { id: params.id },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const CreateDocumentRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  initialContent: z.string().optional(),
});

type CreateDocumentRequest = z.infer<typeof CreateDocumentRequestSchema>;

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const json = await req.json();
  const validationResult = CreateDocumentRequestSchema.safeParse(json);

  if (!validationResult.success) {
    return Response.json(undefined, { status: 400 });
  }

  const request: CreateDocumentRequest = validationResult.data;
  const document = await prisma.document.create({
    data: {
      ...request,
      title: request.title ?? "Untitled document",
      ownerId: session.user.id,
    },
  });

  return NextResponse.json(
    {
      id: document.id,
    },
    { status: 201 }
  );
}

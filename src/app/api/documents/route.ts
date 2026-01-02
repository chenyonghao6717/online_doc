import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAndGetSession } from "@/lib/auth";

const createDocumentRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  initialContent: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await checkAndGetSession();

  const body = await req.json();
  const parsed = createDocumentRequestSchema.safeParse(body);

  if (parsed.error) {
    return Response.json(JSON.parse(parsed.error.message), { status: 400 });
  }

  const request = parsed.data;
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

const searchDocumentsRequestSchema = z.object({
  search: z.string().default(""),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().max(100).min(1).default(1),
});

export async function GET(req: Request) {
  const session = await checkAndGetSession();

  const { searchParams } = new URL(req.url);

  const parsed = searchDocumentsRequestSchema.safeParse({
    // Convert null to undefined because z.string().optional() only treats undefined as valid
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  if (parsed.error) {
    return NextResponse.json(JSON.parse(parsed.error.message), { status: 400 });
  }

  const queries = parsed.data;
  const [total, documents] = await Promise.all([
    prisma.document.count({
      where: {
        ownerId: session.user.id,
        title: {
          contains: queries.search ?? "",
          mode: "insensitive",
        },
      },
    }),
    prisma.document.findMany({
      where: {
        ownerId: session.user.id,
        title: {
          contains: queries.search ?? "",
          mode: "insensitive",
        },
      },
      skip: queries.limit * (queries.page - 1),
      take: queries.limit,
    }),
  ]);

  return NextResponse.json({
    documents,
    total,
    page: queries.page,
    limit: queries.limit,
  });
}

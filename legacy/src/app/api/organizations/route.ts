import { checkAndGetSession, auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";

export async function GET(req: Request) {
  const session = await checkAndGetSession();
  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      members: true,
    },
  });
  return NextResponse.json(organizations);
}

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name must have at least 1 letter"),
  slug: z.string().min(1, "Organization slug must have at least 1 letter"),
});

export async function POST(req: Request) {
  await checkAndGetSession();

  const body = await req.json();
  const parsed = createOrganizationSchema.safeParse(body);

  if (parsed.error) {
    return Response.json(JSON.parse(parsed.error.message), { status: 400 });
  }

  const request = parsed.data;

  try {
    await auth.api.checkOrganizationSlug({
      body: {
        slug: request.slug,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Slug has been used!" }, { status: 409 });
  }

  const organization = await auth.api.createOrganization({
    body: {
      ...request,
      keepCurrentActiveOrganization: true,
    },
    headers: await headers(),
  });
  if (!organization) {
    throw NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json(organization);
}

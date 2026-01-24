import { apiWrapper, ApiError } from "@/lib/api-wrapper";
import { auth, checkAndGetSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const addMembersSchema = z.object({
  emails: z.array(z.email()),
  role: z.union([z.literal("admin"), z.literal("owner"), z.literal("member")]),
});

async function ensureOwner(organizationId: string) {
  const session = await checkAndGetSession();

  const member = await prisma.member.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
    },
  });

  if (!member || member.role !== "owner") {
    throw new ApiError("", 403);
  }
}

async function parse(req: Request) {
  const body = await req.json();
  const parsed = addMembersSchema.safeParse(body);

  if (parsed.error) {
    throw new ApiError(parsed.error.message, 400);
  }

  return parsed.data;
}

async function addMember(
  organizationId: string,
  email: string,
  role: "admin" | "owner" | "member"
) {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  let userId: string;
  if (user) {
    userId = user.id;
  } else {
    userId = (
      await auth.api.createUser({
        body: {
          email,
          password: email,
          name: email,
          role: "user",
        },
      })
    ).user.id;
  }
  const member = await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
  });
  if (!member) {
    await auth.api.addMember({
      body: {
        userId,
        role,
        organizationId,
      },
    });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  const { organizationId } = await params;
  return await apiWrapper(async () => {
    await ensureOwner(organizationId);

    const { emails, role } = await parse(req);
    for (const email of emails) {
      await addMember(organizationId, email, role);
    }

    return NextResponse.json({}, { status: 201 });
  });
}

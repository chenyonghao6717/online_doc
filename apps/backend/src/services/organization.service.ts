import { auth, type Session } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { AddMembersSchema } from "@online-document/contracts/organization";

const ensureOwner = async (orgId: string, session: Session) => {
  const member = await prisma.member.findFirst({
    where: {
      organizationId: orgId,
      userId: session.user.id,
    },
  });

  if (member?.role !== "owner") {
    throw new HTTPException(403);
  }
};

async function addMember(
  organizationId: string,
  email: string,
  role: "admin" | "owner" | "member",
) {
  let user = await prisma.user.findFirst({
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

export const createMembers = async (
  orgId: string,
  request: AddMembersSchema,
  session: Session,
) => {
  await ensureOwner(orgId, session);

  const { emails, role } = request;
  const addMemberPromises: Array<Promise<void>> = [];
  for (const email of emails) {
    addMemberPromises.push(addMember(orgId, email, role));
  }
  await Promise.all(addMemberPromises);
};

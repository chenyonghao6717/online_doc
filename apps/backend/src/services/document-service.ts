import { prisma } from "@/lib/db";
import { Session } from "@/lib/auth";
import { HTTPException } from "hono/http-exception";

export const getDocument = async (id: string, session: Session) => {
  const userId = session.user.id;

  const document = await prisma.document.findFirst({
    where: {
      id,
    },
  });

  if (!document || document.ownerId !== userId) {
    throw new HTTPException(400);
  }

  return document;
};

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
  session: { expiresIn: 60 * 60 },
});

export const checkAndGetSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new NextResponse(undefined, { status: 401 });
  }
  return session;
};

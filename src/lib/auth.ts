import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { organization } from "better-auth/plugins";
import { redirect, RedirectType } from "next/navigation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [organization(), nextCookies()], // make sure nextCookies() is the last plugin in the array
  session: { expiresIn: 60 * 60 },
});

export const checkAndGetSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-up", RedirectType.replace);
  }
  return session;
};

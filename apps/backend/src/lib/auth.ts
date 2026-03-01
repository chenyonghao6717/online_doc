import { Hono } from "hono";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { organization, admin, bearer } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [organization(), admin(), bearer()],
  session: { expiresIn: 60 * 60 },
});

export const belongSameOrg = async (
  orgId: string | null,
  headers: Record<string, string>,
) => {
  const userOrgs = await auth.api.listOrganizations({
    headers,
  });
  return userOrgs.some((org) => org.id === orgId);
};

const app = new Hono();

app.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

export default app;

export type Session = typeof auth.$Infer.Session;

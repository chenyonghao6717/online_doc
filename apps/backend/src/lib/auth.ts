import { Hono } from "hono";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { organization, admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [organization(), admin()],
  session: { expiresIn: 60 * 60 },
});

const app = new Hono();

app.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

export default app;

export type Session = typeof auth.$Infer.Session;

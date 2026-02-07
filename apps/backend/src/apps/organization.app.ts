import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { auth, Session } from "@/lib/auth";
import { useAuth } from "@/middleware/auth";
import { addMembersSchema } from "@online-document/contracts/organization";
import { createMembers } from "@/services/organization.service";
import z from "zod";

type Variables = {
  session: Session;
};

const memberApp = new Hono<{ Variables: Variables }>();

memberApp.post(
  "/",
  zValidator("json", addMembersSchema),
  zValidator(
    "param",
    z.object({
      orgId: z.string().min(1),
    }),
  ),
  async (c) => {
    const request = c.req.valid("json");
    const session = c.get("session");
    const { orgId } = c.req.valid("param");
    await createMembers(orgId, request, session);
    return c.json({}, 201);
  },
);

const app = new Hono<{ Variables: Variables }>();

app.use(useAuth);

app.route("/:orgId/members", memberApp);

export default app;

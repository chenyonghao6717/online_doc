import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getDocument } from "@/services/document-service";
import { Session } from "@/lib/auth";
import { useAuth } from "@/middleware/auth";

type Variables = {
  session: Session;
};

const app = new Hono<{ Variables: Variables }>();

app.use(useAuth);

app.get(
  "/:id",
  zValidator(
    "query",
    z.object({
      id: z.string().min(1),
    }),
  ),
  (c) => {
    const { id } = c.req.valid("query");
    const session = c.get("session");
    const document = getDocument(id, session);
    return c.json(document);
  },
);

export default app;

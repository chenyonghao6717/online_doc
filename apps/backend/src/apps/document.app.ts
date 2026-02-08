import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  getDocument,
  createDocument,
  searchDocuments,
  deleteDocument,
} from "@/services/document.service";
import { Session } from "@/lib/auth";
import { useAuth } from "@/middleware/auth";
import {
  createDocumentSchema,
  searchDocumentsSchema,
} from "@online-document/contracts/document";

type Variables = {
  session: Session;
};

const app = new Hono<{ Variables: Variables }>();

app.use(useAuth);

app.get(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string().min(1),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const session = c.get("session");
    const document = await getDocument(id, session);
    return c.json(document);
  },
);

app.delete(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string().min(1),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const session = c.get("session");
    await deleteDocument(id, session);
    return c.body(null, 204);
  },
);

app.post("/", zValidator("json", createDocumentSchema), async (c) => {
  const payload = c.req.valid("json");
  const session = c.get("session");
  const document = await createDocument(payload, session);
  return c.json(
    {
      id: document.id,
    },
    201,
  );
});

app.get("/", zValidator("query", searchDocumentsSchema), async (c) => {
  const queries = c.req.valid("query");
  const session = c.get("session");
  return c.json(await searchDocuments(queries, session));
});

export default app;

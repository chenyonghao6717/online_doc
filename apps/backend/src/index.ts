import "module-alias/register";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authApp, { Session } from "@/lib/auth";
import documentApp from "@/apps/document.app";
import organizationApp from "@/apps/organization.app";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { Prisma } from "@online-document/prisma/client";

type Variables = {
  session: Session;
};

const app = new Hono<{ Variables: Variables }>();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // record not found
    if (err.code === "P2025") {
      return c.body(null, 404);
    }
  }
  return c.json(
    {
      error: "Internal Server Error",
    },
    500,
  );
});

app.use(
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.route("/api/auth", authApp);
app.route("/api/documents", documentApp);
app.route("/api/organizations", organizationApp);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

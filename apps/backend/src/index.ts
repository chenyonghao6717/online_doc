import { serve } from "@hono/node-server";
import { Hono } from "hono";
import auth, { Session } from "@/lib/auth";
import { HTTPException } from "hono/http-exception";

type Variables = {
  session: Session;
};

const app = new Hono<{ Variables: Variables }>();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.log(err);
  return c.json(
    {
      error: "Internal Server Error",
    },
    500,
  );
});

app.route("/api/auth", auth);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

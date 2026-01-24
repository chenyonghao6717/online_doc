import { type Context } from "hono";
import { auth } from "@/lib/auth";
import { HTTPException } from "hono/http-exception";

export const useAuth = async (c: Context, next: () => Promise<void>) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    throw new HTTPException(401);
  }
  c.set("session", session);
  await next();
};

import { prisma } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export async function GET(request: Request) {
  return Response.json({
    users: prisma.user.findFirst(),
  });
}

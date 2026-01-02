import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const addMembersSchema = z.object({
  emails: z.array(z.email()),
  role: z.union([z.literal("admin"), z.literal("owner"), z.literal("member")]),
});



export async function POST(orgnizationId: string, req: Request) {
  const session = await auth.api.getSession();

  const data = await auth.api.listMembers({
    query: {
      organizationId: orgnizationId,
      filterField: "userId",
      filterOperator: "eq",
      filterValue: session?.user.id,
    },
    headers: await headers(),
  });

  const member = data.members[0];
  if (!member || member.role !== "owner") {
    return NextResponse.json(undefined, { status: 403 });
  }

  const body = await req.json();
  const parsed = addMembersSchema.safeParse(body);

  if (parsed.error) {
    return Response.json(JSON.parse(parsed.error.message), { status: 400 });
  }

  const parsedBody = parsed.data;
  for (const email of parsedBody.emails) {
    
  }
}

import { verifyUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = await verifyUser(req);
  return Response.json({ message: "OK", role: user.role });
}
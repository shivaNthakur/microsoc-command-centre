import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { getRedisClient } from "./redis";

export async function verifyUser(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) throw new Error("No token provided");

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

  const redis = getRedisClient();
  const sessionToken = await redis.get(`session:${decoded.id}`);

  if (sessionToken !== token) {
    throw new Error("Invalid or expired session");
  }

  return decoded; // { id, role }
}

export async function verifyAdmin(req: NextRequest) {
  const user = await verifyUser(req);
  if (user.role !== "admin") throw new Error("Not authorized");
}
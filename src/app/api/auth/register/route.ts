import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await dbConnect();

  // Only admin can create users
  await verifyAdmin(req);

  const { username, password, role } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashed,
    role,
  });

  return Response.json({ message: "User created successfully" });
}
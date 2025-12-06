import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { username, password } = await req.json();

  const user = await User.findOne({ username });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return Response.json({ error: "Wrong password" }, { status: 401 });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // Store session in Redis
  await redis.set(`session:${user._id}`, token, { EX: 86400 });

  return Response.json({
    message: "Login successful",
    role: user.role,
    token,
  });
}
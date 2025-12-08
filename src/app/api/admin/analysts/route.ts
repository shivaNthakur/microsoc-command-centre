import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  await dbConnect();

  const analysts = await User.find({ role: "analyst", isApproved: true });

  return NextResponse.json({
    success: true,
    analysts: analysts.map((u) => ({
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      isApproved: u.isApproved,
      createdAt: u.createdAt,
    })),
  });
}

// app/api/admin/analysts/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { userId } = await req.json();

  const user = await UserModel.findById(userId);

  if (!user || user.role !== "analyst") {
    return NextResponse.json(
      { success: false, message: "Analyst not found" },
      { status: 404 }
    );
  }

  user.isApproved = true;
  await user.save();

  return NextResponse.json(
    { success: true, message: "Analyst approved successfully" },
    { status: 200 }
  );
}
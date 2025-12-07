// these are the routes for handling requests of signin

// app/api/admin/analysts/reject/route.ts
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

  // Option 1: soft reject
  user.isActive = false;
  user.isApproved = false;
  await user.save();

  // Option 2: hard delete
  // await user.deleteOne();

  return NextResponse.json(
    { success: true, message: "Analyst rejected / deactivated" },
    { status: 200 }
  );
}
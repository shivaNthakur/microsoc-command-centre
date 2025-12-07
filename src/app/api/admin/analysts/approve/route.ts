// app/api/admin/analysts/pending/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET(req: NextRequest) {
  await dbConnect();

  const pendingAnalysts = await UserModel.find({
    role: "analyst",
    isApproved: false,
  }).select("_id name email createdAt");

  return NextResponse.json(
    { success: true, analysts: pendingAnalysts },
    { status: 200 }
  );
}
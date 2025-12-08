import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Analyst not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Analyst removed successfully",
  });
}

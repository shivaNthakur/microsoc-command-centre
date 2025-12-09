import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Analyst not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Analyst approved successfully",
      user,
    });
  } catch (error) {
    console.error("Error approving analyst:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// // app/api/admin/analysts/pending/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { dbConnect } from "@/lib/dbConnect";
// import UserModel from "@/models/User";

// export async function GET(req: NextRequest) {
//   await dbConnect();

//   const pendingAnalysts = await UserModel.find({
//     role: "analyst",
//     isApproved: false,
//   }).select("_id name email createdAt");

//   return NextResponse.json(
//     { success: true, analysts: pendingAnalysts },
//     { status: 200 }
//   );
// }
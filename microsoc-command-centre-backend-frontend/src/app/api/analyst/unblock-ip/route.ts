import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { AttackLogModel } from "@/models/AttackLog";

/**
 * POST /api/analyst/unblock-ip
 * Unblock an IP address (analyst endpoint - no auth required for dashboard)
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { ip } = await req.json();

    if (!ip) {
      return NextResponse.json(
        { success: false, message: "IP address is required" },
        { status: 400 }
      );
    }

    // Update all logs for this IP to unblock
    const result = await AttackLogModel.updateMany(
      { ip: ip, is_blocked_now: true },
      { $set: { is_blocked_now: false } }
    );

    console.log(`✅ IP ${ip} unblocked by analyst`);

    return NextResponse.json(
      {
        success: true,
        message: `IP ${ip} has been unblocked`,
        updated_count: result.modifiedCount
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error unblocking IP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to unblock IP", error: error.message },
      { status: 500 }
    );
  }
}

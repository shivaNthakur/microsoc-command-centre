import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import { AttackLogModel } from "@/models/AttackLog";
import { publishAttackLog } from "@/lib/redis";

/**
 * POST /api/admin/unblock-ip
 * Unblock an IP address (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    // Check admin authorization
    await verifyAdmin(req);

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

    // Publish unblock event to Redis for real-time update
    await publishAttackLog({
      type: "ip_unblocked",
      ip: ip,
      timestamp: Date.now()
    });

    console.log(`✅ IP ${ip} unblocked`);

    return NextResponse.json(
      {
        success: true,
        message: `IP ${ip} has been unblocked`,
        updated_count: result.modifiedCount
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Unblock IP Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to unblock IP", error: error.message },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
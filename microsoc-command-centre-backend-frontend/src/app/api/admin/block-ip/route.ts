import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { AttackLogModel } from '@/models/AttackLog';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { ip } = body;

    if (!ip) {
      return NextResponse.json(
        { success: false, message: 'IP address is required' },
        { status: 400 }
      );
    }

    // Update all logs with this IP to mark as blocked
    const updated_count = await AttackLogModel.updateMany(
      { ip },
      { $set: { is_blocked_now: true } }
    ).then(result => result.modifiedCount);

    return NextResponse.json(
      {
        success: true,
        message: `IP ${ip} blocked successfully`,
        updated_count,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error blocking IP:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to block IP',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

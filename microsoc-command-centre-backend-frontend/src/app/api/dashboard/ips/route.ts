import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { AttackLogModel } from '@/models/AttackLog';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    const attackType = searchParams.get('attackType') || 'brute_force';

    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);
    const startTimestamp = Math.floor(startTime.getTime() / 1000);

    const matchQuery: any = {
      timestamp: { $gte: startTimestamp }
    };

    if (attackType) {
      matchQuery.attack_type = attackType;
    }

    // Get top source IPs
    const topIPs = await AttackLogModel.aggregate([
      {
        $match: matchQuery
      },
      {
        $group: {
          _id: '$ip',
          count: { $sum: 1 },
          lastSeen: { $max: '$timestamp' },
          attackTypes: { $addToSet: '$attack_type' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Format the response
    const formattedIPs = topIPs.map(ip => ({
      ip: ip._id,
      count: ip.count,
      lastSeen: ip.lastSeen,
      attackTypes: ip.attackTypes
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedIPs
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching IP data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch IP data',
        error: error.message
      },
      { status: 500 }
    );
  }
}


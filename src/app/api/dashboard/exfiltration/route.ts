import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import LogModel from '@/models/AttackLog';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const hours = parseInt(searchParams.get('hours') || '24');

    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    // Get data exfiltration attempts over time (assuming sensitive_paths, dos might indicate exfiltration)
    const exfiltrationOverTime = await LogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime },
          attackType: { $in: ['sensitive_paths', 'dos', 'DataExfiltration'] }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
            month: { $month: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1, '_id.day': 1, '_id.hour': 1 }
      }
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          exfiltrationOverTime
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching exfiltration data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch exfiltration data',
        error: error.message
      },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { AttackLogModel } from '@/models/AttackLog';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const hours = parseInt(searchParams.get('hours') || '24');

    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);
    const startTimestamp = Math.floor(startTime.getTime() / 1000);

    // Get data exfiltration attempts over time (assuming sensitive_paths, dos might indicate exfiltration)
    const exfiltrationOverTime = await AttackLogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTimestamp },
          attack_type: { $in: ['sensitive_path_access', 'directory_scan'] }
        }
      },
      {
        $addFields: {
          date: {
            $toDate: { $multiply: ['$timestamp', 1000] }
          }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$date' },
            day: { $dayOfMonth: '$date' },
            month: { $month: '$date' }
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


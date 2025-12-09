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

    // Get attack counts over time (grouped by hour)
    // Note: timestamp is stored as Unix timestamp (number), not Date
    const startTimestamp = Math.floor(startTime.getTime() / 1000);
    const attacksOverTime = await AttackLogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTimestamp }
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

    // Get attack type distribution
    const attackTypeDistribution = await AttackLogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: Math.floor(startTime.getTime() / 1000) }
        }
      },
      {
        $group: {
          _id: '$attack_type',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get severity distribution
    const severityDistribution = await AttackLogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTimestamp }
        }
      },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get brute force attempts over time
    const bruteForceOverTime = await AttackLogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTimestamp },
          attack_type: 'brute_force'
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
          attacksOverTime,
          attackTypeDistribution,
          severityDistribution,
          bruteForceOverTime
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching attack data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch attack data',
        error: error.message
      },
      { status: 500 }
    );
  }
}


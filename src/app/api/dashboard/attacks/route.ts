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

    // Get attack counts over time (grouped by hour)
    const attacksOverTime = await LogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime }
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

    // Get attack type distribution
    const attackTypeDistribution = await LogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: '$attackType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get severity distribution
    const severityDistribution = await LogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime }
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
    const bruteForceOverTime = await LogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime },
          attackType: { $in: ['brute_force', 'BruteForce'] }
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


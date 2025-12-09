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

    // Get DNS queries over time (assuming dirscan, gobuster_scan, nikto_scan might involve DNS)
    const dnsQueriesOverTime = await AttackLogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTimestamp },
          attack_type: { $in: ['directory_scan', 'sensitive_path_access'] }
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

    // Get requested paths/domains
    const requestedPaths = await AttackLogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTimestamp },
          attack_type: { $in: ['directory_scan', 'sensitive_path_access'] }
        }
      },
      {
        $group: {
          _id: '$path',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          dnsQueriesOverTime,
          requestedPaths: requestedPaths.map(p => ({
            path: p._id,
            count: p.count
          }))
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching DNS data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch DNS data',
        error: error.message
      },
      { status: 500 }
    );
  }
}


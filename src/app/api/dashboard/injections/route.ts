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

    // Get injection-related attacks (sqli, xss)
    const injections = await LogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime },
          attackType: { $in: ['sqli', 'xss', 'SQLi', 'XSS'] }
        }
      },
      {
        $group: {
          _id: '$attackType',
          count: { $sum: 1 },
          critical: {
            $sum: {
              $cond: [{ $eq: ['$severity', 'CRITICAL'] }, 1, 0]
            }
          },
          high: {
            $sum: {
              $cond: [{ $eq: ['$severity', 'HIGH'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get top injected paths
    const topInjectedPaths = await LogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime },
          attackType: { $in: ['sqli', 'xss', 'SQLi', 'XSS'] }
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

    const totalCritical = injections.reduce((sum, item) => sum + item.critical, 0);

    return NextResponse.json(
      {
        success: true,
        data: {
          injections,
          topInjectedPaths: topInjectedPaths.map(p => ({
            path: p._id,
            count: p.count
          })),
          totalCritical
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching injection data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch injection data',
        error: error.message
      },
      { status: 500 }
    );
  }
}


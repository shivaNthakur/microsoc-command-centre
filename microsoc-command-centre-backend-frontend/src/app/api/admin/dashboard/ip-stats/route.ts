import { NextRequest, NextResponse } from 'next/server';
import { getTopIPs, getIPStats } from '@/services/ipAggregator';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const ip = searchParams.get('ip');

    if (ip) {
      // Get specific IP stats
      const stats = await getIPStats(ip);
      if (!stats) {
        return NextResponse.json(
          { success: false, message: 'IP not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, data: stats },
        { status: 200 }
      );
    }

    // Get top IPs
    const topIPs = await getTopIPs(limit);

    return NextResponse.json(
      { success: true, data: topIPs },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching IP stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch IP stats',
        error: error.message
      },
      { status: 500 }
    );
  }
}


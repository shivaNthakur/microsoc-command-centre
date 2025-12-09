import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { AttackLogModel } from '@/models/AttackLog';
import IncidentModel from '@/models/Incident';
import { getTopIPs } from '@/services/ipAggregator';
import { cacheGet, cacheSet } from '@/lib/redis';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Check cache first (5 minute TTL)
    const cached = await cacheGet('dashboard:summary');
    if (cached) {
      return NextResponse.json({ success: true, data: cached }, { status: 200 });
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneDayAgoTimestamp = Math.floor(oneDayAgo.getTime() / 1000);

    // Get total attacks in last 24h (timestamp is stored as Unix timestamp)
    const totalAttacks = await AttackLogModel.countDocuments({
      timestamp: { $gte: oneDayAgoTimestamp }
    });

    // Get blocked attacks
    const blockedAttacks = await AttackLogModel.countDocuments({
      timestamp: { $gte: oneDayAgoTimestamp },
      status: 'BLOCK'
    });

    // Get active incidents
    const activeIncidents = await IncidentModel.countDocuments({
      status: { $in: ['Open', 'In Progress'] }
    });

    // Get critical alerts
    const criticalAlerts = await AttackLogModel.countDocuments({
      timestamp: { $gte: oneDayAgoTimestamp },
      severity: { $in: ['CRITICAL', 'Critical'] }
    });

    // Get top IPs
    const topIPs = await getTopIPs(5);

    const summary = {
      timestamp: now,
      totalAttacks,
      blockedAttacks,
      activeIncidents,
      criticalAlerts,
      topIPs: topIPs.map(ip => ({
        ip: ip.ip,
        count: ip.count,
        country: ip.geo?.country || 'Unknown',
        severity: ip.severity,
      })),
    };

    // Cache for 5 minutes
    await cacheSet('dashboard:summary', summary, 300);

    return NextResponse.json(
      { success: true, data: summary },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch dashboard summary',
        error: error.message
      },
      { status: 500 }
    );
  }
}


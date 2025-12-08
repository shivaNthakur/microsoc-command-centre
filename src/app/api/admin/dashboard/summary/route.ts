import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import LogModel from '@/models/AttackLog';
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

    // Get total attacks in last 24h
    const totalAttacks = await LogModel.countDocuments({
      timestamp: { $gte: oneDayAgo }
    });

    // Get blocked attacks
    const blockedAttacks = await LogModel.countDocuments({
      timestamp: { $gte: oneDayAgo },
      status: 'BLOCK'
    });

    // Get active incidents
    const activeIncidents = await IncidentModel.countDocuments({
      status: { $in: ['Open', 'In Progress'] }
    });

    // Get critical alerts
    const criticalAlerts = await LogModel.countDocuments({
      timestamp: { $gte: oneDayAgo },
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


import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import LogModel from '@/models/AttackLog';
import { publishAttackLogToRedis } from '@/services/realtimePublisher';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    
    // Handle both single object and array of logs
    const logs = Array.isArray(body) ? body : [body];

    const savedLogs = [];

    for (const logData of logs) {
      // Normalize attack_type to match our enum
      let attackType = logData.attack_type || logData.attackType;
      
      // Map common variations
      if (attackType === 'brute_force_login' || attackType === 'brute_force_login_attempt') {
        attackType = 'brute_force';
      }

      // Normalize severity to uppercase
      const severity = (logData.severity || 'MEDIUM').toUpperCase();

      // Convert timestamp (assuming Unix timestamp)
      const timestamp = logData.timestamp 
        ? new Date(logData.timestamp * 1000) 
        : new Date();

      const log = new LogModel({
        timestamp,
        attackType,
        sourceIP: logData.ip,
        path: logData.path || '/',
        method: logData.method || 'GET',
        status: logData.status || 'DETECTED',
        severity,
        reason: logData.reason,
        suggestion: logData.suggestion,
        is_blocked_now: logData.is_blocked_now || false,
        targetSystem: logData.path || '/',
        logStatus: 'New',
      });

      const savedLog = await log.save();
      savedLogs.push(savedLog);
      
      // Publish to Redis for real-time updates (non-blocking)
      publishAttackLogToRedis({
        _id: savedLog._id,
        ip: savedLog.sourceIP,
        attackType: savedLog.attackType,
        severity: savedLog.severity,
        timestamp: savedLog.timestamp,
        path: savedLog.path,
        method: savedLog.method,
        status: savedLog.status,
        reason: savedLog.reason,
        suggestion: savedLog.suggestion,
        is_blocked_now: savedLog.is_blocked_now,
      }).catch(err => console.error('Error publishing log:', err));
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully ingested ${savedLogs.length} log(s)`,
        count: savedLogs.length 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Log ingestion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to ingest logs',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve logs (optional, for testing)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    const attackType = searchParams.get('attackType');
    const severity = searchParams.get('severity');

    const query: any = {};
    if (attackType) query.attackType = attackType;
    if (severity) query.severity = severity.toUpperCase();

    const logs = await LogModel.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await LogModel.countDocuments(query);

    return NextResponse.json(
      { 
        success: true, 
        logs,
        total,
        limit,
        skip 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch logs',
        error: error.message 
      },
      { status: 500 }
    );
  }
}


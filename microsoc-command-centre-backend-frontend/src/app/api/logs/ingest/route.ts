import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { AttackLogModel } from "@/models/AttackLog";
import { publishAttackLog } from "@/lib/redis";

/**
 * POST /api/logs/ingest
 * Receives attack logs from Python threat engine
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    
    // Handle both formats:
    // 1. { type: "logs", data: [...] } - from Python
    // 2. [...] - direct array (from Postman/manual testing)
    let logs;
    
    if (Array.isArray(body)) {
      // Direct array format
      logs = body;
      console.log("📥 Received direct array format");
    } else if (body.type && body.data) {
      // Wrapped format from Python
      logs = Array.isArray(body.data) ? body.data : [body.data];
      console.log(`📥 Received wrapped format: type=${body.type}`);
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid format. Expected array or {type, data}" },
        { status: 400 }
      );
    }
    console.log(`📥 Received ${logs.length} log(s)`);

    // Validate logs
    const validLogs = logs.filter(log => 
      log.ip && log.path && log.method && log.status && log.timestamp
    );

    if (validLogs.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid logs provided" },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const savedLogs = await AttackLogModel.insertMany(validLogs, {
      ordered: false
    });

    console.log(`✅ Saved ${savedLogs.length} logs to MongoDB`);

    // Publish each log to Redis for real-time updates
    const publishPromises = savedLogs.map(async (log) => {
      const logData = {
        ...log.toObject(),
        _id: log._id.toString()
      };
      
      console.log(`📡 Publishing log to Redis: ${log.ip}`);
      return publishAttackLog(logData);
    });

    await Promise.allSettled(publishPromises);
    console.log(`✅ Published ${savedLogs.length} logs to Redis`);

    return NextResponse.json(
      {
        success: true,
        message: `${savedLogs.length} logs ingested successfully`,
        count: savedLogs.length
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Ingest Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to ingest logs",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/logs/ingest
 * Returns recent logs (for testing and initial load)
 */
export async function GET() {
  try {
    await dbConnect();
    
    const recentLogs = await AttackLogModel
      .find()
      .sort({ timestamp: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      logs: recentLogs,
      count: recentLogs.length
    });

  } catch (error: any) {
    console.error("❌ GET Logs Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}



// import { NextRequest, NextResponse } from 'next/server';
// import { dbConnect } from '@/lib/dbConnect';
// import { AttackLogModel } from '@/models/AttackLog';
// import { publishAttackLogToRedis } from '@/services/realtimePublisher';
// import { checkAndCreateIncident } from '@/services/incidentDetector';

// export async function POST(req: NextRequest) {
//   try {
//     await dbConnect();

//     const body = await req.json();
    
//     // Handle both single object and array of logs
//     const logs = Array.isArray(body) ? body : [body];
    
//     // Log received data for debugging
//     console.log(`📥 Received ${logs.length} log(s) from ${req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'unknown'}`);

//     const savedLogs = [];

//     for (const logData of logs) {
//       // Normalize attack_type to match our enum
//       let attackType = logData.attack_type || logData.attackType;
      
//       // Map common variations
//       if (attackType === 'brute_force_login' || attackType === 'brute_force_login_attempt') {
//         attackType = 'brute_force';
//       }

//       // Normalize severity to uppercase
//       const severity = (logData.severity || 'MEDIUM').toUpperCase();

//       // Convert timestamp (assuming Unix timestamp)
//       const timestamp = logData.timestamp 
//         ? new Date(logData.timestamp * 1000) 
//         : new Date();

//       const log = new AttackLogModel({
//         ip: logData.ip,
//         path: logData.path || '/',
//         method: logData.method || 'GET',
//         status: logData.status || 'BLOCK',
//         attack_type: attackType || null,
//         severity,
//         timestamp: Math.floor(logData.timestamp || Date.now() / 1000),
//         reason: logData.reason || 'Security detection',
//         suggestion: logData.suggestion || null,
//         is_blocked_now: logData.is_blocked_now || false,
//       });

//       const savedLog = await log.save();
//       savedLogs.push(savedLog);
      
//       // Publish to Redis for real-time updates (non-blocking)
//       publishAttackLogToRedis({
//         _id: savedLog._id,
//         ip: savedLog.ip,
//         attack_type: savedLog.attack_type,
//         severity: savedLog.severity,
//         timestamp: savedLog.timestamp,
//         path: savedLog.path,
//         method: savedLog.method,
//         status: savedLog.status,
//         reason: savedLog.reason,
//         suggestion: savedLog.suggestion,
//         is_blocked_now: savedLog.is_blocked_now,
//       }).catch(err => console.error('Error publishing log:', err));
      
//       // Check and create incident if pattern matches (non-blocking)
//       checkAndCreateIncident(savedLog._id.toString(), {
//         ip: savedLog.ip,
//         attack_type: savedLog.attack_type,
//         severity: savedLog.severity,
//         timestamp: savedLog.timestamp,
//         path: savedLog.path,
//         method: savedLog.method,
//         status: savedLog.status,
//         reason: savedLog.reason,
//         suggestion: savedLog.suggestion,
//         is_blocked_now: savedLog.is_blocked_now,
//       }).catch(err => console.error('Error checking incident:', err));
//     }

//     const response = NextResponse.json(
//       { 
//         success: true, 
//         message: `Successfully ingested ${savedLogs.length} log(s)`,
//         count: savedLogs.length 
//       },
//       { status: 201 }
//     );
    
//     // Add CORS headers to allow cross-origin requests from Threat Engine
//     response.headers.set('Access-Control-Allow-Origin', '*');
//     response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
//     response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
//     console.log(`✅ Successfully ingested ${savedLogs.length} log(s)`);
//     return response;
//   } catch (error: any) {
//     console.error('Log ingestion error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Failed to ingest logs',
//         error: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// // GET endpoint to retrieve logs (optional, for testing)
// export async function GET(req: NextRequest) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const limit = parseInt(searchParams.get('limit') || '100');
//     const skip = parseInt(searchParams.get('skip') || '0');
//     const attackType = searchParams.get('attackType');
//     const severity = searchParams.get('severity');

//     const query: any = {};
//     if (attackType) query.attack_type = attackType;
//     if (severity) query.severity = severity.toUpperCase();

//     const logs = await AttackLogModel.find(query)
//       .sort({ timestamp: -1 })
//       .limit(limit)
//       .skip(skip)
//       .lean();

//     const total = await AttackLogModel.countDocuments(query);

//     return NextResponse.json(
//       { 
//         success: true, 
//         logs,
//         total,
//         limit,
//         skip 
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error('Error fetching logs:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Failed to fetch logs',
//         error: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }


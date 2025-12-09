import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { AttackLogModel } from '@/models/AttackLog';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const hours = parseInt(searchParams.get('hours') || '24');

    const now = new Date();
    const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
    const startTimestamp = Math.floor(startTime.getTime() / 1000);

    // Get attack statistics by type
    const attackStats = await AttackLogModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startTimestamp },
          attack_type: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$attack_type',
          count: { $sum: 1 },
          severitySum: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ['$severity', 'CRITICAL'] }, then: 10 },
                  { case: { $eq: ['$severity', 'HIGH'] }, then: 8 },
                  { case: { $eq: ['$severity', 'MEDIUM'] }, then: 5 },
                  { case: { $eq: ['$severity', 'LOW'] }, then: 3 },
                  { case: { $eq: ['$severity', 'NORMAL'] }, then: 1 }
                ],
                default: 5
              }
            }
          }
        }
      },
      {
        $project: {
          type: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'sql_injection'] }, then: 'SQL Injection' },
                { case: { $eq: ['$_id', 'xss_attempt'] }, then: 'XSS' },
                { case: { $eq: ['$_id', 'brute_force'] }, then: 'Bruteforce' },
                { case: { $eq: ['$_id', 'directory_scan'] }, then: 'Directory Scan' },
                { case: { $eq: ['$_id', 'dns_attack'] }, then: 'DNS Attack' },
                { case: { $eq: ['$_id', 'bot_detection'] }, then: 'Bot Traffic' },
                { case: { $eq: ['$_id', 'sensitive_path_access'] }, then: 'Sensitive Path' },
                { case: { $eq: ['$_id', 'threat_intelligence'] }, then: 'Threat Intel' }
              ],
              default: { $concat: [{ $toUpper: { $substr: ['$_id', 0, 1] } }, { $substr: ['$_id', 1, { $strLenCP: '$_id' }] }] }
            }
          },
          count: 1,
          severity: { $divide: ['$severitySum', '$count'] }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get total attacks
    const totalAttacks = await AttackLogModel.countDocuments({
      timestamp: { $gte: startTimestamp }
    });

    // Get analysts count
    const analystsRequested = await User.countDocuments({ 
      role: 'analyst',
      isApproved: false 
    });
    
    const analystsApproved = await User.countDocuments({ 
      role: 'analyst',
      isApproved: true 
    });

    // Calculate model accuracy (mock for now - can be replaced with real ML accuracy)
    const blockedCount = await AttackLogModel.countDocuments({
      timestamp: { $gte: startTimestamp },
      status: 'BLOCK'
    });
    const modelAccuracy = totalAttacks > 0 
      ? Math.round((blockedCount / totalAttacks) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        attacks: attackStats.map(stat => ({
          type: stat.type,
          count: stat.count,
          severity: Math.round(stat.severity)
        })),
        totalAttacks,
        modelAccuracy,
        analystsRequested,
        analystsApproved
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching attack stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch attack statistics',
        error: error.message
      },
      { status: 500 }
    );
  }
}


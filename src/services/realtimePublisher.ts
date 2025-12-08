import { publishAttackLog, REDIS_CHANNELS, getRedisClient } from '@/lib/redis';
import { updateIPStats } from './ipAggregator';
import { getIPGeoLocation } from '@/utils/ipInfo';

export interface AttackLogData {
  id: string;
  ip: string;
  attackType: string;
  severity: string;
  timestamp: Date;
  path: string;
  method: string;
  status: string;
  reason?: string;
  suggestion?: string;
  isBlocked: boolean;
  geo?: {
    country: string;
    city: string;
    lat: number;
    lng: number;
  };
}

export async function publishAttackLogToRedis(logData: any): Promise<void> {
  try {
    // Get geo-location
    const geo = await getIPGeoLocation(logData.ip);
    
    // Update IP statistics
    const ipStats = await updateIPStats(
      logData.ip,
      logData.attackType,
      logData.severity,
      logData.is_blocked_now || false
    );
    
    // Prepare data for publishing
    const attackData: AttackLogData = {
      id: logData._id?.toString() || logData.id,
      ip: logData.ip || logData.sourceIP,
      attackType: logData.attackType,
      severity: logData.severity,
      timestamp: logData.timestamp || new Date(),
      path: logData.path,
      method: logData.method,
      status: logData.status,
      reason: logData.reason,
      suggestion: logData.suggestion,
      isBlocked: logData.is_blocked_now || false,
      geo: geo ? {
        country: geo.country,
        city: geo.city,
        lat: geo.lat,
        lng: geo.lng,
      } : undefined,
    };
    
    // Publish to Redis channel
    await publishAttackLog(attackData);
    
    // Update dashboard summary cache
    await updateDashboardSummary();
    
  } catch (error: any) {
    console.error('Error publishing attack log:', error);
  }
}

async function updateDashboardSummary(): Promise<void> {
  try {
    const redis = getRedisClient();
    
    // Invalidate cache so it gets recalculated on next request
    await redis.del('dashboard:summary');
  } catch (error: any) {
    console.error('Error updating dashboard summary cache:', error);
  }
}


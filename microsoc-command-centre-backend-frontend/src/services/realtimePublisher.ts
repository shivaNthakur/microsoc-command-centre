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
    // Normalize field names (handle both snake_case and camelCase)
    const attackType = logData.attack_type || logData.attackType;
    const severity = logData.severity || 'MEDIUM';
    const ip = logData.ip || logData.sourceIP;
    
    // Get geo-location
    const geo = await getIPGeoLocation(ip);
    
    // Update IP statistics
    await updateIPStats(
      ip,
      attackType,
      severity,
      logData.is_blocked_now || false
    );
    
    // Prepare data for publishing
    const attackData = {
      _id: logData._id?.toString() || logData.id,
      ip,
      attack_type: attackType,
      severity,
      timestamp: logData.timestamp || Date.now(),
      path: logData.path || '/',
      method: logData.method || 'GET',
      status: logData.status || 'BLOCK',
      reason: logData.reason,
      suggestion: logData.suggestion,
      is_blocked_now: logData.is_blocked_now || false,
      geo: geo ? {
        country: geo.country,
        city: geo.city,
        lat: geo.lat,
        lng: geo.lng,
      } : undefined,
    };
    
    console.log('📤 Publishing attack log to Redis:', { ip, attack_type: attackType, severity });
    
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


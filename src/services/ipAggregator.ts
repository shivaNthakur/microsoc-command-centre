import { getRedisClient, cacheGet, cacheSet } from '@/lib/redis';
import { getIPGeoLocation } from '@/utils/ipInfo';

export interface IPStats {
  ip: string;
  count: number;
  attackTypes: string[];
  severity: string;
  firstSeen: Date;
  lastSeen: Date;
  blocked: boolean;
  geo?: {
    country: string;
    city: string;
    lat: number;
    lng: number;
  };
}

export async function updateIPStats(ip: string, attackType: string, severity: string, isBlocked: boolean): Promise<IPStats> {
  const redis = getRedisClient();
  const cacheKey = `ip:stats:${ip}`;
  
  // Get existing stats
  const existing = await cacheGet(cacheKey);
  
  const now = new Date();
  const stats: IPStats = existing || {
    ip,
    count: 0,
    attackTypes: [],
    severity: 'LOW',
    firstSeen: now,
    lastSeen: now,
    blocked: false,
  };
  
  // Update stats
  stats.count += 1;
  stats.lastSeen = now;
  if (!stats.firstSeen) stats.firstSeen = now;
  
  // Add attack type if not present
  if (!stats.attackTypes.includes(attackType)) {
    stats.attackTypes.push(attackType);
  }
  
  // Update severity (take highest)
  const severityOrder = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const currentIndex = severityOrder.indexOf(stats.severity);
  const newIndex = severityOrder.indexOf(severity);
  if (newIndex > currentIndex) {
    stats.severity = severity;
  }
  
  // Update blocked status
  if (isBlocked) {
    stats.blocked = true;
  }
  
  // Get geo-location if not cached
  if (!stats.geo) {
    const geo = await getIPGeoLocation(ip);
    if (geo) {
      stats.geo = {
        country: geo.country,
        city: geo.city,
        lat: geo.lat,
        lng: geo.lng,
      };
    }
  }
  
  // Cache for 1 hour
  await cacheSet(cacheKey, stats, 3600);
  
  // Also update sorted set for top IPs
  await redis.zadd('ip:counts', stats.count, ip);
  
  return stats;
}

export async function getTopIPs(limit: number = 10): Promise<IPStats[]> {
  const redis = getRedisClient();
  
  // Get top IPs by count
  const topIPs = await redis.zrevrange('ip:counts', 0, limit - 1, 'WITHSCORES');
  
  const results: IPStats[] = [];
  
  for (let i = 0; i < topIPs.length; i += 2) {
    const ip = topIPs[i];
    const count = parseInt(topIPs[i + 1]);
    
    const stats = await cacheGet(`ip:stats:${ip}`);
    if (stats) {
      results.push({
        ...stats,
        count,
      });
    }
  }
  
  return results;
}

export async function getIPStats(ip: string): Promise<IPStats | null> {
  return await cacheGet(`ip:stats:${ip}`);
}


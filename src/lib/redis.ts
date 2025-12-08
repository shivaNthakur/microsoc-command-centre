import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: ReturnType<typeof createClient> | null = null;

export function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({ url: REDIS_URL });
    redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
    redisClient.connect().then(() => console.log('✅ Redis Client Connected')).catch(err => console.error('❌ Redis connect failed:', err));
  }
  return redisClient;
}

export const REDIS_CHANNELS = {
  ATTACK_LOGS: 'soc:attack_logs',
  INCIDENTS: 'soc:incidents',
  NOTIFICATIONS: 'soc:notifications',
  ANALYST_ACTIONS: 'soc:analyst_actions',
} as const;

export async function publishAttackLog(data: any) {
  const client = getRedisClient();
  try {
    await client.publish(REDIS_CHANNELS.ATTACK_LOGS, JSON.stringify(data));
  } catch (err) {
    console.error('❌ Failed to publish attack log:', err);
  }
}

// Cache helpers
export async function cacheSet(key: string, value: any, expiry = 3600) {
  const client = getRedisClient();
  await client.set(key, JSON.stringify(value), { EX: expiry });
}

export async function cacheGet(key: string) {
  const client = getRedisClient();
  const raw = await client.get(key);
  return raw ? JSON.parse(raw) : null;
}

export async function cacheDel(key: string) {
  const client = getRedisClient();
  await client.del(key);
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
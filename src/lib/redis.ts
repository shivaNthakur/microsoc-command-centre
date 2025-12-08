import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let redisClient: Redis | null = null;
let redisSubscriber: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(REDIS_URL, {
      retryStrategy(times) {
        if (times > 10) return null;
        return Math.min(times * 500, 2000);
      },
    });

    redisClient.on("connect", () => console.log("✅ Redis Client Connected"));
    redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
  }
  return redisClient;
}

export function getRedisSubscriber(): Redis {
  if (!redisSubscriber) {
    redisSubscriber = new Redis(REDIS_URL);
  }
  return redisSubscriber;
}

// Channels
export const REDIS_CHANNELS = {
  ATTACK_LOGS: "soc:attack_logs",
  INCIDENTS: "soc:incidents",
  NOTIFICATIONS: "soc:notifications",
  ANALYST_ACTIONS: "soc:analyst_actions",
} as const;

// Publish event
export async function publishAttackLog(data: any) {
  const client = getRedisClient();
  await client.publish(REDIS_CHANNELS.ATTACK_LOGS, JSON.stringify(data));
  console.log("📡 Published attack log");
}

// Cache helpers
export async function cacheSet(key: string, value: any, expiry = 3600) {
  const client = getRedisClient();
  await client.set(key, JSON.stringify(value), "EX", expiry);
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
  if (redisClient) await redisClient.quit();
  if (redisSubscriber) await redisSubscriber.quit();
}
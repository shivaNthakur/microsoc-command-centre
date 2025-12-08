import { Server } from "socket.io";
import { getRedisSubscriber, REDIS_CHANNELS } from "@/lib/redis";

let io: Server | null = null;
let redisSubscriber: any = null;

export default function getIO(server?: any) {
  if (!io && server) {
    io = new Server(server, {
      cors: { 
        origin: process.env.NEXT_PUBLIC_SOCKET_URL || "*",
        methods: ["GET", "POST"]
      },
      path: "/api/socket",
    });
    console.log("✅ Socket.IO started");
    
    // Initialize Redis subscriber for real-time updates
    initializeRedisSubscriber();
    
    // Handle socket connections
    io.on("connection", (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);
      
      // Admin joins dashboard room
      socket.on("admin:join", () => {
        socket.join("admin-dashboard");
        console.log(`👤 Admin joined dashboard: ${socket.id}`);
      });
      
      // Analyst joins dashboard room
      socket.on("analyst:join", () => {
        socket.join("analyst-dashboard");
        console.log(`👤 Analyst joined dashboard: ${socket.id}`);
      });
      
      socket.on("disconnect", () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });
  }
  return io!;
}

function initializeRedisSubscriber() {
  if (redisSubscriber) return;
  
  try {
    redisSubscriber = getRedisSubscriber();
    
    // Subscribe to channels
    redisSubscriber.subscribe(REDIS_CHANNELS.ATTACK_LOGS, (err: any) => {
      if (err) {
        console.error("❌ Redis subscription error:", err);
      } else {
        console.log(`📡 Subscribed to Redis channel: ${REDIS_CHANNELS.ATTACK_LOGS}`);
      }
    });
    
    redisSubscriber.subscribe(REDIS_CHANNELS.INCIDENTS, (err: any) => {
      if (err) {
        console.error("❌ Redis subscription error:", err);
      } else {
        console.log(`📡 Subscribed to Redis channel: ${REDIS_CHANNELS.INCIDENTS}`);
      }
    });
    
    // Handle messages from Redis (ioredis uses 'message' event)
    redisSubscriber.on("message", (channel: string, message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (channel === REDIS_CHANNELS.ATTACK_LOGS) {
          // Broadcast to admin dashboard
          if (io) {
            io.to("admin-dashboard").emit("attack:new", data);
            console.log(`📤 Broadcasted attack log to admin dashboard`);
          }
        } else if (channel === REDIS_CHANNELS.INCIDENTS) {
          // Broadcast incident updates
          if (io) {
            io.to("admin-dashboard").emit("incident:update", data);
            io.to("analyst-dashboard").emit("incident:update", data);
          }
        }
      } catch (error: any) {
        console.error("❌ Error parsing Redis message:", error);
      }
    });
    
  } catch (error: any) {
    console.error("❌ Error initializing Redis subscriber:", error);
  }
}
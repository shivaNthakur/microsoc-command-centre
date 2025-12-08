import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createClient } from 'redis';

const PORT = process.env.SOCKET_PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Create HTTP server
const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.io Server Running\n');
});

// Initialize Socket.io with CORS
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Redis subscriber
const redisSubscriber = createClient({ url: REDIS_URL });

async function startServer() {
  try {
    // Connect to Redis
    await redisSubscriber.connect();
    console.log('✅ Redis Subscriber Connected');

    // Subscribe to all channels
    const channels = [
      'soc:attack_logs',
      'soc:attacks',
      'soc:incidents',
      'soc:incident_updates',
      'soc:stats_update',
      'soc:critical_alert'
    ];

    for (const channel of channels) {
      await redisSubscriber.subscribe(channel, (message) => {
        try {
          const data = JSON.parse(message);
          handleRedisMessage(channel, data);
        } catch (err) {
          console.error(`❌ Failed to parse message from ${channel}:`, err);
        }
      });
      console.log(`✅ Subscribed to: ${channel}`);
    }

  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    process.exit(1);
  }

  // Handle Redis messages
  function handleRedisMessage(channel: string, data: any) {
    console.log(`📡 Received from ${channel}:`, data);

    switch (channel) {
      case 'soc:attack_logs':
        // Broadcast to all analysts
        io.to('analysts').emit('attack_log', data);
        io.to('dashboard').emit('new_log', data);
        
        // Send critical logs to alerts room
        if (data.severity === 'CRITICAL' || data.severity === 'HIGH') {
          io.to('alerts').emit('high_severity_log', data);
        }
        break;

      case 'soc:attacks':
        // Broadcast attack aggregations
        io.to('dashboard').emit('attack_update', data);
        io.to('analytics').emit('attack_analytics', data);
        break;

      case 'soc:incidents':
        // Broadcast new incidents
        io.to('analysts').emit('new_incident', data);
        io.to('incidents').emit('incident_created', data);
        
        // Play alert sound for critical incidents
        if (data.severity === 'CRITICAL') {
          io.to('alerts').emit('critical_incident', data);
        }
        break;

      case 'soc:incident_updates':
        // Broadcast incident status changes
        io.to('incidents').emit('incident_updated', data);
        break;

      case 'soc:stats_update':
        // Broadcast dashboard statistics
        io.to('dashboard').emit('stats_update', data);
        break;

      case 'soc:critical_alert':
        // Broadcast critical alerts to everyone
        io.emit('critical_alert', data);
        break;
    }
  }

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Client joins rooms based on their needs
    socket.on('join_rooms', (rooms: string[]) => {
      rooms.forEach(room => {
        socket.join(room);
        console.log(`📥 ${socket.id} joined: ${room}`);
      });
    });

    // Auto-join analysts to default rooms
    socket.on('join_analyst', () => {
      socket.join('analysts');
      socket.join('dashboard');
      socket.join('alerts');
      console.log(`👤 ${socket.id} joined as analyst`);
    });

    // Join specific incident room
    socket.on('join_incident', (incidentId: string) => {
      socket.join(`incident:${incidentId}`);
      console.log(`📋 ${socket.id} joined incident: ${incidentId}`);
    });

    // Leave room
    socket.on('leave_room', (room: string) => {
      socket.leave(room);
      console.log(`📤 ${socket.id} left: ${room}`);
    });

    // Analyst actions (for collaboration)
    socket.on('analyst_action', (data) => {
      console.log('🔧 Analyst action:', data);
      socket.broadcast.emit('analyst_activity', {
        socketId: socket.id,
        action: data
      });
    });

    // Ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to MicroSOC Socket Server',
      socketId: socket.id,
      timestamp: Date.now()
    });
  });

  // Start HTTP server
  httpServer.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║  🚀 Socket.io Server Running                 ║
    ║  📡 Port: ${PORT}                              ║
    ║  🔗 Redis: Connected                          ║
    ║  ✅ Ready to broadcast real-time data        ║
    ╚═══════════════════════════════════════════════╝
    `);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down gracefully...');
  await redisSubscriber.quit();
  io.close();
  httpServer.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await redisSubscriber.quit();
  io.close();
  httpServer.close();
  process.exit(0);
});

// Start server
startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
const redis = require('redis');
const { io } = require('socket.io-client');

console.log('\n🧪 E2E Integration Test\n');

// Test 1: Check Redis connection
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

// Test 2: Monitor Redis publish
const redisMonitor = redis.createClient({ url: 'redis://localhost:6379' });

async function runTests() {
  try {
    await redisClient.connect();
    console.log('✅ Redis Connected');
    
    await redisMonitor.connect();
    console.log('✅ Redis Monitor Connected');

    // Subscribe to attack_logs channel
    const subscriber = redis.createClient({ url: 'redis://localhost:6379' });
    await subscriber.connect();
    
    let redisMessages = 0;
    await subscriber.subscribe('soc:attack_logs', (message) => {
      redisMessages++;
      const data = JSON.parse(message);
      console.log(`📨 [Redis ${redisMessages}] soc:attack_logs: ${data.ip} - ${data.attack_type}`);
    });
    console.log('✅ Redis Subscriber Listening on soc:attack_logs');

    // Test 3: Connect Socket.io client
    const socket = io('http://localhost:3001', { transports: ['websocket'] });
    
    socket.on('connect', () => {
      console.log(`✅ Socket Connected: ${socket.id}`);
      socket.emit('join_analyst');
    });

    let socketMessages = 0;
    socket.on('attack_log', (data) => {
      socketMessages++;
      console.log(`📡 [Socket ${socketMessages}] attack_log: ${data.ip}`);
    });

    socket.on('new_log', (data) => {
      socketMessages++;
      console.log(`📡 [Socket ${socketMessages}] new_log: ${data.ip}`);
    });

    // Wait for connections
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('\n🚀 Sending test ingest...\n');

    // This would be called from another terminal
    // For now, just report state
    setTimeout(async () => {
      console.log('\n📊 Final Results:');
      console.log(`   - Redis messages received: ${redisMessages}`);
      console.log(`   - Socket messages received: ${socketMessages}`);
      
      socket.disconnect();
      await subscriber.unsubscribe();
      await subscriber.quit();
      await redisMonitor.quit();
      await redisClient.quit();
      process.exit(0);
    }, 20000);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

runTests();

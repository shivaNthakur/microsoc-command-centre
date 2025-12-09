const io = require('socket.io-client');

const socket = io('http://localhost:3001', { transports: ['websocket'], reconnection: false });

let received = 0;

socket.on('connect', () => {
  console.log('✅ Connected to socket server:', socket.id);
  socket.emit('join_analyst');
});

socket.on('attack_log', (data) => {
  received++;
  console.log(`✅ [${received}] attack_log: ${data.ip} - ${data.attack_type} (${data.severity})`);
});

socket.on('new_log', (data) => {
  received++;
  console.log(`✅ [${received}] new_log: ${data.ip} - ${data.attack_type} (${data.severity})`);
});

socket.on('error', (err) => {
  console.error('❌ Socket error:', err);
});

setTimeout(() => {
  console.log(`\n✅ Test complete. Events received: ${received}`);
  socket.disconnect();
}, 15000);

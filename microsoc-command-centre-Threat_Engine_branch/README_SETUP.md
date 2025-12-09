# Threat Engine Setup & Configuration

## Quick Start

### 1. Install Dependencies
```bash
pip install fastapi uvicorn pymongo redis requests python-dotenv tensorflow numpy
```

### 2. Configure Environment
Create a `.env` file in the threat engine directory:
```bash
# Copy the example
cp .env.example .env

# Edit .env and set your backend URL
BACKEND_URL=http://10.255.32.169:3000/api/logs/ingest
```

### 3. Start Threat Engine
```bash
uvicorn app:app --host 127.0.0.1 --port 8000
```

### 4. Test Connection
```bash
python test_backend_connection.py
```

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://10.255.32.169:3000/api/logs/ingest` | Frontend API endpoint |
| `REDIS_HOST` | `localhost` | Redis server host |
| `REDIS_PORT` | `6379` | Redis server port |
| `MONGO_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `BLOCK_DURATION` | `600` | IP block duration in seconds |
| `REDIS_BLOCK_TTL` | `300` | Redis block TTL in seconds |

## Features

### ✅ Auto-Blocking ML Model
- Uses LSTM model for threat detection
- Auto-blocks IPs based on ML predictions (confidence > 0.85)
- Integrated with rule-based detection

### ✅ Rate Limiting
- Brute Force Detection: 5+ failed login attempts in 60s
- DoS Detection: 100+ requests in 60s
- Automatic IP blocking

### ✅ Rule-Based Detection
- SQL Injection detection
- XSS attempt detection
- Sensitive path access blocking
- Threat intelligence integration

### ✅ Real-Time Log Forwarding
- Queues logs in Redis
- Batch processing for efficiency
- Automatic retry on failure (3 attempts)
- Sends to frontend API in real-time

## Troubleshooting

### Issue: Cannot connect to backend API
1. Check if frontend is running: `curl http://10.255.32.169:3000/api/logs/ingest`
2. Verify network connectivity: `ping 10.255.32.169`
3. Check firewall rules
4. Verify BACKEND_URL in .env file

### Issue: ML model not loading
1. Check if model files exist:
   - `ml/threat_lstm.keras`
   - `ml/protocol_encoder.pkl`
   - `ml/label_encoder.pkl`
   - `ml/scaler.pkl`
2. Install TensorFlow: `pip install tensorflow`

### Issue: Redis connection failed
1. Check Redis is running: `redis-cli ping`
2. Verify REDIS_HOST and REDIS_PORT in .env
3. Check Redis connection: `redis-cli -h localhost -p 6379`

### Issue: MongoDB connection failed
1. Check MongoDB is running: `mongosh --eval "db.version()"`
2. Verify MONGO_URI in .env
3. Check MongoDB connection string format

## Log Messages

### Success Messages
- `✅ [Backend] Successfully sent X logs` - Logs sent successfully
- `✓ MongoDB connected successfully` - MongoDB connected
- `✓ Redis connected successfully` - Redis connected
- `✓ ML models loaded successfully` - ML models loaded

### Error Messages
- `❌ [Backend] Connection error` - Cannot connect to backend
- `⚠️  MongoDB connection failed` - MongoDB connection issue
- `⚠️  Redis connection failed` - Redis connection issue
- `⚠️  Failed to load ML models` - ML model loading issue

## Testing

### Test Backend Connection
```bash
python test_backend_connection.py
```

### Test Threat Engine API
```bash
curl -X POST http://127.0.0.1:8000/security/decision \
  -H "Content-Type: application/json" \
  -d '{
    "ip": "192.168.1.100",
    "path": "/login",
    "method": "POST",
    "user_agent": "Mozilla/5.0",
    "payload": {"username": "admin", "password": "wrong"}
  }'
```

### Monitor Logs
Watch the Threat Engine console for:
- `[Backend] Sent: X logs` - Successful sends
- `[Mongo] Batch saved: X` - MongoDB saves
- Connection status messages


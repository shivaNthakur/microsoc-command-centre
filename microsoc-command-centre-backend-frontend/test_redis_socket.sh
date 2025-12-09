#!/bin/zsh
set -e

echo "🧪 Testing Redis → Socket Flow"
echo ""

# Check Redis channels
echo "📍 Redis Subscriptions:"
redis-cli PUBSUB CHANNELS | grep soc:

echo ""
echo "🚀 Sending test ingest..."

# Send ingest
RESPONSE=$(curl -s -X POST http://localhost:3000/api/logs/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "ip": "198.51.100.200",
    "path": "/api/v1/admin",
    "method": "POST",
    "status": "BLOCK",
    "attack_type": "sqli",
    "severity": "CRITICAL",
    "timestamp": '$(date +%s)',
    "reason": "SQL injection payload",
    "suggestion": "Block immediately",
    "is_blocked_now": true
  }')

echo "✅ Ingest Response: $RESPONSE"

echo ""
echo "📊 Checking database..."
# Count logs
COUNT=$(curl -s "http://localhost:3000/api/logs/ingest?limit=1" | jq '.total')
echo "   Total logs in DB: $COUNT"

echo ""
echo "✅ E2E Flow Test Complete"

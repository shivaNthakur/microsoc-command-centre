#!/bin/bash

# Quick test script for Threat Engine Backend Connection

echo "🔍 Testing Threat Engine Backend Connection"
echo "=========================================="
echo ""

BACKEND_URL="http://10.255.32.169:3000/api/logs/ingest"

# Test 1: Check if backend is reachable
echo "Test 1: Checking backend connectivity..."
if curl -s --connect-timeout 5 "$BACKEND_URL" > /dev/null 2>&1; then
    echo "✅ Backend is reachable"
else
    echo "❌ Cannot reach backend at $BACKEND_URL"
    echo "   Please check:"
    echo "   1. Frontend server is running"
    echo "   2. Network connectivity"
    echo "   3. Firewall rules"
    exit 1
fi

# Test 2: Send test log
echo ""
echo "Test 2: Sending test log..."
TIMESTAMP=$(date +%s)
TEST_LOG=$(cat <<EOF
{
  "ip": "192.168.1.100",
  "path": "/test",
  "method": "POST",
  "status": "BLOCK",
  "attack_type": "test",
  "severity": "MEDIUM",
  "timestamp": $TIMESTAMP,
  "reason": "Test connection from Threat Engine",
  "suggestion": "This is a test",
  "is_blocked_now": false
}
EOF
)

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_LOG")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Test log sent successfully!"
    echo "   Response: $BODY"
else
    echo "❌ Failed to send test log"
    echo "   HTTP Code: $HTTP_CODE"
    echo "   Response: $BODY"
    exit 1
fi

# Test 3: Check Threat Engine
echo ""
echo "Test 3: Checking Threat Engine status..."
if curl -s --connect-timeout 5 "http://127.0.0.1:8000/" > /dev/null 2>&1; then
    echo "✅ Threat Engine is running"
else
    echo "⚠️  Threat Engine is not running"
    echo "   Start it with: uvicorn app:app --host 127.0.0.1 --port 8000"
fi

echo ""
echo "=========================================="
echo "✅ All tests completed!"
echo ""
echo "Next steps:"
echo "1. Start Threat Engine: uvicorn app:app --host 127.0.0.1 --port 8000"
echo "2. Monitor logs for: [Backend] Sent: X logs"
echo "3. Check admin dashboard for incoming attacks"



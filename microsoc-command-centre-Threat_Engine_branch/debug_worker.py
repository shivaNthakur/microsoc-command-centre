#!/usr/bin/env python3
"""
Debug script to check why Threat Engine is not sending data to backend
"""
import os
import sys
import json
import redis
from dotenv import load_dotenv

load_dotenv()

# Configuration
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
LOG_QUEUE = "attack_logs_queue"
BACKEND_URL = os.getenv("BACKEND_URL") or os.getenv("BACKEND_INGEST_URI") or "http://10.255.32.169:3000/api/logs/ingest"

print("=" * 60)
print("THREAT ENGINE DEBUG - Why not sending to backend?")
print("=" * 60)
print()

# Test 1: Redis Connection
print("1. Testing Redis Connection...")
try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    r.ping()
    print(f"   ✅ Redis connected: {REDIS_HOST}:{REDIS_PORT}")
except Exception as e:
    print(f"   ❌ Redis connection failed: {e}")
    print("   Solution: Start Redis with 'redis-server'")
    sys.exit(1)

# Test 2: Check Queue
print()
print("2. Checking Redis Queue...")
try:
    queue_length = r.llen(LOG_QUEUE)
    print(f"   Queue '{LOG_QUEUE}' has {queue_length} items")
    
    if queue_length > 0:
        print("   ⚠️  There are logs waiting in queue!")
        print("   This means the worker might not be processing them.")
        print()
        print("   First item in queue:")
        first_item = r.lindex(LOG_QUEUE, 0)
        if first_item:
            try:
                log_data = json.loads(first_item)
                print(f"   {json.dumps(log_data, indent=2)}")
            except:
                print(f"   {first_item[:200]}")
    else:
        print("   ✅ Queue is empty (no logs waiting)")
except Exception as e:
    print(f"   ❌ Error checking queue: {e}")

# Test 3: Backend URL
print()
print("3. Checking Backend URL Configuration...")
print(f"   BACKEND_URL: {BACKEND_URL}")
print(f"   BACKEND_INGEST_URI: {os.getenv('BACKEND_INGEST_URI', 'Not set')}")
print(f"   BACKEND_URL env: {os.getenv('BACKEND_URL', 'Not set')}")

# Test 4: Test Backend Connection
print()
print("4. Testing Backend Connection...")
import requests
try:
    test_log = {
        "ip": "192.168.1.100",
        "path": "/test",
        "method": "POST",
        "status": "BLOCK",
        "attack_type": "test",
        "severity": "MEDIUM",
        "timestamp": 1234567890,
        "reason": "Debug test",
        "is_blocked_now": False
    }
    
    response = requests.post(BACKEND_URL, json=test_log, timeout=5)
    if response.status_code in [200, 201]:
        print(f"   ✅ Backend is reachable!")
        print(f"   Response: {response.json()}")
    else:
        print(f"   ⚠️  Backend returned status {response.status_code}")
        print(f"   Response: {response.text[:200]}")
except requests.exceptions.ConnectionError:
    print(f"   ❌ Cannot connect to backend at {BACKEND_URL}")
    print("   Check if backend is running and URL is correct")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 5: Simulate Worker
print()
print("5. Simulating Worker Processing...")
try:
    if queue_length > 0:
        print(f"   Processing {min(5, queue_length)} items from queue...")
        processed = 0
        for i in range(min(5, queue_length)):
            log_json = r.rpop(LOG_QUEUE)
            if log_json:
                log = json.loads(log_json)
                print(f"   ✅ Processed log {i+1}: {log.get('ip')} - {log.get('attack_type')}")
                processed += 1
        
        if processed > 0:
            print(f"   ✅ Successfully processed {processed} logs")
            print("   These logs should now be sent to backend")
    else:
        print("   ⚠️  No logs in queue to process")
        print("   Add a test log to queue:")
        test_log = {
            "ip": "192.168.1.200",
            "path": "/test",
            "method": "GET",
            "status": "BLOCK",
            "attack_type": "test",
            "severity": "HIGH",
            "timestamp": 1234567890,
            "reason": "Test from debug script",
            "is_blocked_now": False
        }
        r.lpush(LOG_QUEUE, json.dumps(test_log))
        print(f"   ✅ Added test log to queue")
        print(f"   Now check if Threat Engine worker processes it")
except Exception as e:
    print(f"   ❌ Error: {e}")
    import traceback
    traceback.print_exc()

print()
print("=" * 60)
print("DIAGNOSIS SUMMARY")
print("=" * 60)
print()
print("Common Issues:")
print("1. Redis not running → Start with 'redis-server'")
print("2. Worker not processing → Check Threat Engine logs")
print("3. Backend not reachable → Check URL and network")
print("4. Logs stuck in queue → Worker might have crashed")
print()
print("Next Steps:")
print("1. Check Threat Engine console for error messages")
print("2. Verify Threat Engine is running: curl http://127.0.0.1:8000/")
print("3. Check if worker started: Look for '🔥 Mongo Writer Worker started'")
print("4. Monitor logs for: '[Backend] Successfully sent X logs'")



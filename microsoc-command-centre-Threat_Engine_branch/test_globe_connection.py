#!/usr/bin/env python3
"""
Test script to verify Python → Next.js → Globe connection
"""

import requests
import time
import json

# Configuration
THREAT_ENGINE_URL = "http://127.0.0.1:8000/security/decision"
NEXTJS_API_URL = "http://localhost:3000/api/logs/ingest"
NEXTJS_GEO_URL = "http://localhost:3000/api/admin/dashboard/geo"

def test_threat_engine():
    """Test 1: Check if Threat Engine is running"""
    print("\n🧪 Test 1: Checking Threat Engine...")
    try:
        response = requests.get("http://127.0.0.1:8000/", timeout=5)
        if response.status_code == 200:
            print("✅ Threat Engine is running")
            data = response.json()
            print(f"   Backend URL configured: {data.get('backend_url', 'N/A')}")
            return True
        else:
            print(f"❌ Threat Engine returned {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Threat Engine is not running")
        print("   Start it with: uvicorn app:app --host 127.0.0.1 --port 8000")
        return False

def test_nextjs_api():
    """Test 2: Check if Next.js API is accessible"""
    print("\n🧪 Test 2: Checking Next.js API...")
    try:
        response = requests.get(NEXTJS_API_URL, timeout=5)
        if response.status_code in [200, 404, 405]:  # Any response is good
            print("✅ Next.js API is accessible")
            return True
        else:
            print(f"⚠️ Next.js API returned {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot reach Next.js API")
        print("   Make sure Next.js is running: npm run dev")
        return False

def test_geo_api():
    """Test 3: Check geolocation API"""
    print("\n🧪 Test 3: Testing Geo API...")
    test_ips = ["8.8.8.8", "192.168.1.100"]
    
    for ip in test_ips:
        try:
            response = requests.get(f"{NEXTJS_GEO_URL}?ip={ip}", timeout=5)
            data = response.json()
            
            if data.get("success"):
                geo = data.get("data", {})
                print(f"✅ {ip} → {geo.get('city')}, {geo.get('country')}")
            else:
                print(f"❌ Geo API failed for {ip}: {data.get('message')}")
        except Exception as e:
            print(f"❌ Geo API error for {ip}: {e}")

def test_send_attack():
    """Test 4: Send test attack through Threat Engine"""
    print("\n🧪 Test 4: Sending test attack...")
    
    test_attacks = [
        {
            "name": "Private IP (will show in Lucknow)",
            "data": {
                "ip": "192.168.1.200",
                "path": "/test",
                "method": "POST",
                "payload": "test=1"
            }
        },
        {
            "name": "Public IP (Google DNS - USA)",
            "data": {
                "ip": "8.8.8.8",
                "path": "/api/test",
                "method": "GET"
            }
        },
        {
            "name": "Public IP (Cloudflare - Australia)",
            "data": {
                "ip": "1.1.1.1",
                "path": "/test",
                "method": "GET"
            }
        }
    ]
    
    for attack in test_attacks:
        print(f"\n   Sending: {attack['name']}")
        try:
            response = requests.post(
                THREAT_ENGINE_URL,
                json=attack['data'],
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Status: {result.get('status')}")
                print(f"   Attack Type: {result.get('attack_type')}")
                print(f"   IP: {result.get('ip')}")
            else:
                print(f"   ❌ Failed: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
        
        time.sleep(1)  # Wait 1 second between attacks

def test_direct_api():
    """Test 5: Send directly to Next.js API (bypass Threat Engine)"""
    print("\n🧪 Test 5: Testing direct API submission...")
    
    test_log = {
        "type": "logs",
        "data": [
            {
                "ip": "203.0.113.1",  # Public IP (documentation range)
                "path": "/direct-test",
                "method": "GET",
                "status": "ALLOW",
                "attack_type": "test",
                "severity": "LOW",
                "timestamp": int(time.time()),
                "reason": "Direct API test",
                "suggestion": "Test successful",
                "is_blocked_now": False
            }
        ]
    }
    
    try:
        response = requests.post(
            NEXTJS_API_URL,
            json=test_log,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"✅ Direct API test successful")
            print(f"   Response: {result.get('message')}")
        else:
            print(f"❌ Direct API test failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            
    except Exception as e:
        print(f"❌ Direct API error: {e}")

def check_redis_queue():
    """Test 6: Check Redis queue length"""
    print("\n🧪 Test 6: Checking Redis queue...")
    try:
        response = requests.get("http://127.0.0.1:8000/health", timeout=5)
        if response.status_code == 200:
            health = response.json()
            print(f"✅ Queue length: {health.get('queue_length', 'N/A')}")
            print(f"   Redis: {health.get('redis')}")
            print(f"   MongoDB: {health.get('mongodb')}")
        else:
            print("⚠️ Health endpoint not available")
    except:
        print("⚠️ Cannot check health endpoint")

if __name__ == "__main__":
    print("="*60)
    print("🌍 GLOBE CONNECTION TEST")
    print("="*60)
    
    # Run all tests
    engine_ok = test_threat_engine()
    api_ok = test_nextjs_api()
    
    if engine_ok and api_ok:
        test_geo_api()
        test_send_attack()
        test_direct_api()
        check_redis_queue()
        
        print("\n" + "="*60)
        print("✅ ALL TESTS COMPLETED")
        print("="*60)
        print("\n📋 Next steps:")
        print("1. Open Globe page: http://localhost:3000/admin/dashboard/location")
        print("2. You should see 3 red dots appearing:")
        print("   - 192.168.1.200 → Lucknow, India")
        print("   - 8.8.8.8 → Mountain View, USA")
        print("   - 1.1.1.1 → Sydney, Australia")
        print("3. Arcs should connect the dots")
        print("\n💡 If dots don't appear:")
        print("   - Check browser console for errors")
        print("   - Make sure Socket.io server is running: npm run socket")
        print("   - Check Redis is running: redis-cli ping")
    else:
        print("\n" + "="*60)
        print("❌ TESTS FAILED - Fix errors above first")
        print("="*60)
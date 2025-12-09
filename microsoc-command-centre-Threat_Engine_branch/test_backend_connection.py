#!/usr/bin/env python3
"""
Test script to verify Threat Engine can connect to Backend API
"""
import requests
import json
import time
import sys

# Configuration
BACKEND_URL = "http://10.255.32.169:3000/api/logs/ingest"
THREAT_ENGINE_URL = "http://127.0.0.1:8000/security/decision"

def test_backend_direct():
    """Test direct connection to backend API"""
    print("=" * 60)
    print("TEST 1: Direct Backend API Connection")
    print("=" * 60)
    
    test_log = {
        "ip": "192.168.1.100",
        "path": "/test",
        "method": "POST",
        "status": "BLOCK",
        "attack_type": "test",
        "severity": "MEDIUM",
        "timestamp": int(time.time()),
        "reason": "Test connection",
        "suggestion": "This is a test",
        "is_blocked_now": False
    }
    
    try:
        print(f"📡 Sending test log to: {BACKEND_URL}")
        response = requests.post(
            BACKEND_URL,
            json=test_log,
            timeout=10,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"✅ Status Code: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code in [200, 201]:
            print("✅ SUCCESS: Backend API is reachable!")
            return True
        else:
            print(f"❌ FAILED: Backend returned status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError as e:
        print(f"❌ CONNECTION ERROR: Cannot reach {BACKEND_URL}")
        print(f"   Error: {e}")
        return False
    except requests.exceptions.Timeout as e:
        print(f"⏱️  TIMEOUT: Request to {BACKEND_URL} timed out")
        print(f"   Error: {e}")
        return False
    except Exception as e:
        print(f"❌ ERROR: {type(e).__name__}: {e}")
        return False

def test_threat_engine():
    """Test Threat Engine is running"""
    print("\n" + "=" * 60)
    print("TEST 2: Threat Engine Status")
    print("=" * 60)
    
    try:
        response = requests.get("http://127.0.0.1:8000/", timeout=5)
        print(f"✅ Threat Engine is running")
        print(f"📄 Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Threat Engine is not running: {e}")
        print("   Start it with: uvicorn app:app --host 127.0.0.1 --port 8000")
        return False

def test_full_flow():
    """Test full flow: Threat Engine -> Backend"""
    print("\n" + "=" * 60)
    print("TEST 3: Full Flow (Threat Engine -> Backend)")
    print("=" * 60)
    
    test_request = {
        "ip": "192.168.1.200",
        "path": "/login",
        "method": "POST",
        "user_agent": "Mozilla/5.0 (Test)",
        "payload": {
            "username": "admin",
            "password": "wrong_pass"
        }
    }
    
    try:
        print(f"📡 Sending request to Threat Engine: {THREAT_ENGINE_URL}")
        response = requests.post(
            THREAT_ENGINE_URL,
            json=test_request,
            timeout=10
        )
        
        result = response.json()
        print(f"✅ Threat Engine Response:")
        print(json.dumps(result, indent=2))
        
        print("\n⏳ Waiting 3 seconds for background worker to process...")
        time.sleep(3)
        
        print("\n✅ Test completed! Check Threat Engine logs for:")
        print("   - [Backend] Sent: X logs")
        print("   - Connection status messages")
        
        return True
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def main():
    print("\n" + "🔍 THREAT ENGINE BACKEND CONNECTION TEST" + "\n")
    
    results = []
    
    # Test 1: Direct backend connection
    results.append(("Direct Backend API", test_backend_direct()))
    
    # Test 2: Threat Engine status
    results.append(("Threat Engine Status", test_threat_engine()))
    
    # Test 3: Full flow (only if threat engine is running)
    if results[1][1]:
        results.append(("Full Flow", test_full_flow()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    all_passed = all(result for _, result in results)
    
    if all_passed:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Check the output above.")
        sys.exit(1)

if __name__ == "__main__":
    main()



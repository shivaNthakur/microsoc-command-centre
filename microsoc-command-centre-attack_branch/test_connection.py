#!/usr/bin/env python3
"""
Test script to verify Attack Branch can connect to Threat Engine
"""
import requests
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from attacks.common.config import THREAT_ENGINE_URL

def test_threat_engine_connection():
    """Test connection to Threat Engine"""
    print("=" * 60)
    print("TEST: Attack Branch → Threat Engine Connection")
    print("=" * 60)
    print(f"Threat Engine URL: {THREAT_ENGINE_URL}")
    print()
    
    # Test 1: Check if Threat Engine is running
    try:
        base_url = THREAT_ENGINE_URL.rsplit('/security', 1)[0]
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"✅ Threat Engine is running")
        print(f"   Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to Threat Engine at {base_url}")
        print("   Please start Threat Engine:")
        print("   cd microsoc-command-centre-Threat_Engine_branch")
        print("   uvicorn app:app --host 127.0.0.1 --port 8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    # Test 2: Send test attack
    print()
    print("Sending test attack...")
    test_attack = {
        "ip": "192.168.1.100",
        "path": "/test",
        "method": "POST",
        "user_agent": "Mozilla/5.0 (Test)",
        "payload": {"test": "data"}
    }
    
    try:
        response = requests.post(THREAT_ENGINE_URL, json=test_attack, timeout=10)
        print(f"✅ Test attack sent successfully!")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to Threat Engine endpoint")
        print(f"   URL: {THREAT_ENGINE_URL}")
        return False
    except Exception as e:
        print(f"❌ Error sending attack: {e}")
        return False

def test_attack_script():
    """Test actual attack script"""
    print()
    print("=" * 60)
    print("TEST: Running Brute Force Attack Script")
    print("=" * 60)
    
    try:
        from attacks.brute_force.bruteforce_attack import send_log
        
        # Send one test log
        log = {
            "tool": "brute_force",
            "username": "admin",
            "password": "wrong_pass",
            "severity": "high",
            "source_ip": "192.168.1.90"
        }
        
        print("Sending brute force attack log...")
        send_log(log)
        print("✅ Attack log sent!")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("\n🔍 ATTACK BRANCH CONNECTION TEST\n")
    
    # Test Threat Engine connection
    if not test_threat_engine_connection():
        print("\n⚠️  Threat Engine connection failed. Fix this first.")
        sys.exit(1)
    
    # Test attack script
    if not test_attack_script():
        print("\n⚠️  Attack script test failed.")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✅ All tests passed!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Check Threat Engine logs for: [Backend] Sent: X logs")
    print("2. Check backend API at http://10.255.32.169:3000/api/logs/ingest")
    print("3. Check admin dashboard for incoming attacks")



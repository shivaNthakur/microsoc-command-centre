#!/usr/bin/env python3
"""
Test attacks with PUBLIC IPs to verify Globe display
These IPs will show at their real locations on the Globe
"""

import requests
import time

# Your Threat Engine endpoint
THREAT_ENGINE_URL = "http://127.0.0.1:8000/security/decision"

# Test attacks with PUBLIC IPs from different countries
test_attacks = [
    {
        "name": "SQL Injection from USA (Google DNS)",
        "data": {
            "ip": "8.8.8.8",
            "path": "/login",
            "method": "POST",
            "payload": "admin' OR '1'='1"
        },
        "expected_location": "Mountain View, California, USA"
    },
    {
        "name": "Brute Force from Australia (Cloudflare)",
        "data": {
            "ip": "1.1.1.1",
            "path": "/login",
            "method": "POST",
            "payload": "username=admin&password=wrong1"
        },
        "expected_location": "Sydney, Australia"
    },
    {
        "name": "Directory Scan from UK",
        "data": {
            "ip": "81.2.69.142",  # BBC
            "path": "/admin",
            "method": "GET"
        },
        "expected_location": "London, United Kingdom"
    },
    {
        "name": "XSS Attempt from Germany",
        "data": {
            "ip": "5.9.0.1",  # Hetzner
            "path": "/search",
            "method": "GET",
            "payload": "<script>alert('xss')</script>"
        },
        "expected_location": "Nuremberg, Germany"
    },
    {
        "name": "Sensitive Path from Japan",
        "data": {
            "ip": "210.155.141.200",  # Sony
            "path": "/config",
            "method": "GET"
        },
        "expected_location": "Tokyo, Japan"
    }
]

def send_attack(attack_info):
    """Send attack to Threat Engine"""
    print(f"\n{'='*70}")
    print(f"🎯 {attack_info['name']}")
    print(f"📍 Expected Location: {attack_info['expected_location']}")
    print(f"{'='*70}")
    
    try:
        response = requests.post(
            THREAT_ENGINE_URL,
            json=attack_info['data'],
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Status: {result.get('status')}")
            print(f"🎯 Attack Type: {result.get('attack_type')}")
            print(f"⚠️  Severity: {result.get('severity')}")
            print(f"🌐 IP: {result.get('ip')}")
            print(f"💬 Reason: {result.get('reason')}")
            print(f"🔒 Blocked: {'YES' if result.get('is_blocked_now') else 'NO'}")
            print(f"\n✅ This should appear on Globe at: {attack_info['expected_location']}")
        else:
            print(f"❌ Failed: HTTP {response.status_code}")
            print(f"Response: {response.text[:200]}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return True

def main():
    print("\n" + "="*70)
    print("🌍 GLOBE DISPLAY TEST - PUBLIC IPS")
    print("="*70)
    print("\n📋 Instructions:")
    print("1. Make sure all services are running:")
    print("   - Threat Engine: uvicorn app:app --host 127.0.0.1 --port 8000")
    print("   - Next.js: npm run dev")
    print("   - Socket.io: npm run socket")
    print("   - Redis: redis-server")
    print("   - MongoDB: mongod")
    print("\n2. Open Globe page:")
    print("   http://localhost:3000/admin/dashboard/location")
    print("\n3. Open browser console (F12) to see events")
    print("\n4. Starting attacks in 3 seconds...")
    time.sleep(3)
    
    # Send each attack
    for i, attack in enumerate(test_attacks, 1):
        print(f"\n\n🔥 Attack {i}/{len(test_attacks)}")
        send_attack(attack)
        
        if i < len(test_attacks):
            print(f"\n⏳ Waiting 3 seconds before next attack...")
            time.sleep(3)
    
    print("\n\n" + "="*70)
    print("✅ ALL ATTACKS SENT!")
    print("="*70)
    print("\n📊 Check your Globe - you should see 5 red dots:")
    print("  🔴 Mountain View, California (8.8.8.8)")
    print("  🔴 Sydney, Australia (1.1.1.1)")
    print("  🔴 London, UK (81.2.69.142)")
    print("  🔴 Nuremberg, Germany (5.9.0.1)")
    print("  🔴 Tokyo, Japan (210.155.141.200)")
    print("\n📝 Arcs should connect them in sequence")
    print("\n💡 If you don't see dots:")
    print("  1. Check browser console for errors")
    print("  2. Check Socket.io server logs")
    print("  3. Run: node monitor_redis_events.js")
    print("\n")

if __name__ == "__main__":
    main()
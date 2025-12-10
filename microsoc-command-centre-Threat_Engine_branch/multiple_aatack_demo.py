
import requests
import time
import random

URL = "http://127.0.0.1:8000/security/decision"

# More diverse public IPs from different countries
DIVERSE_PUBLIC_IPS = [
    "8.8.8.8",          # USA - Google
    "1.1.1.1",          # Australia - Cloudflare
    "208.67.222.222",   # USA - OpenDNS
    "77.88.8.8",        # Russia - Yandex
    "185.228.168.9",    # Netherlands - CleanBrowsing
    "94.140.14.14",     # Germany - AdGuard
    "156.154.70.1",     # USA - Neustar
    "64.6.64.6",        # USA - Verisign
    "9.9.9.9",          # Switzerland - Quad9
    "76.76.19.19",      # USA - Alternate DNS
    "216.146.35.35",    # USA - Dyn
    "84.200.69.80",     # Germany - DNS.WATCH
    "91.239.100.100",   # Switzerland - Swiss Privacy
    "103.86.96.100",    # India - JioFiber
    "180.76.76.76",     # China - Baidu
]

attacks = [
    {
        "name": "SQL Injection",
        "data": {
            "path": "/login",
            "method": "POST",
            "payload": "admin' OR '1'='1"
        }
    },
    {
        "name": "XSS Attempt",
        "data": {
            "path": "/search",
            "method": "GET",
            "payload": "<script>alert('xss')</script>"
        }
    },
    {
        "name": "Directory Scan",
        "data": {
            "path": "/admin",
            "method": "GET"
        }
    },
    {
        "name": "Sensitive Path",
        "data": {
            "path": "/.env",
            "method": "GET"
        }
    },
    {
        "name": "Config Access",
        "data": {
            "path": "/config",
            "method": "GET"
        }
    },
]

print("="*60)
print("🌍 GLOBE POPULATION DEMO")
print("="*60)
print(f"Sending {len(attacks)} different attacks from random IPs")
print("Watch your Globe fill up with dots across the world!")
print("="*60)

for i, attack in enumerate(attacks, 1):
    # Pick random IP for each attack
    attack_ip = random.choice(DIVERSE_PUBLIC_IPS)
    
    data = attack["data"].copy()
    data["ip"] = attack_ip
    
    print(f"\n[{i}/{len(attacks)}] {attack['name']} from {attack_ip}")
    
    try:
        response = requests.post(URL, json=data, timeout=5)
        result = response.json()
        print(f"  Status: {result['status']}")
        print(f"  Attack Type: {result.get('attack_type', 'normal')}")
        print(f"  Severity: {result.get('severity')}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    time.sleep(2)  # 2 second delay between attacks

print("\n" + "="*60)
print("✅ DEMO COMPLETE!")
print("="*60)
print("🌍 Check your Globe - you should see dots at:")
print("  • USA, Australia, Russia, Netherlands, Germany")
print("  • Switzerland, India, China, and more!")
print("\n💡 Refresh the page - dots should PERSIST!")
print("="*60)
import requests
import random

URL = "http://127.0.0.1:8000/security/decision"

PUBLIC_IPS = [
    "8.8.8.8", "1.1.1.1", "208.67.222.222", "9.9.9.9",
    "185.228.168.9", "76.76.19.19", "94.140.14.14",
    "64.6.64.6", "77.88.8.8", "156.154.70.1"
]

attack_ip = random.choice(PUBLIC_IPS)
print(f"🎯 Directory Scan from: {attack_ip}")

paths = [
    "/admin", "/admin/login", "/admin/config", "/dashboard",
    "/config", "/phpmyadmin", "/wp-admin", "/etc/passwd",
    "/server-status", "/backup", "/hidden", "/secrets"
]

print(f"Scanning {len(paths)} paths...")

for p in paths:
    data = {
        "ip": attack_ip,
        "path": p,
        "method": "GET",
        "payload": ""
    }

    response = requests.post(URL, json=data)
    result = response.json()
    print(f"{p:20} → {result['status']:6} | {result.get('attack_type', 'normal')}")

print(f"\n✅ Scan complete! Check Globe for dot at IP: {attack_ip}")

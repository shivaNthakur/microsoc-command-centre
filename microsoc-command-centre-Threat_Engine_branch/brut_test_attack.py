import requests
import time
import random

URL = "http://127.0.0.1:8000/security/decision"

PUBLIC_IPS = [
    "8.8.8.8", "1.1.1.1", "208.67.222.222", "9.9.9.9",
    "185.228.168.9", "76.76.19.19", "94.140.14.14",
    "64.6.64.6", "77.88.8.8", "156.154.70.1"
]

attack_ip = random.choice(PUBLIC_IPS)
print(f"🎯 Brute Force Test from: {attack_ip}")

for i in range(12):
    payload = {
        "ip": attack_ip,
        "path": "/login",
        "method": "POST",
        "payload": {
            "src_ip": attack_ip,
            "dst_ip": "10.0.0.1",
            "port": 443,
            "protocol": "TCP",
            "packet_size": 600,
            "status": "failed"
        }
    }

    response = requests.post(URL, json=payload)
    result = response.json()
    print(f"{i+1}. Status: {result['status']} | Attack: {result.get('attack_type', 'none')}")
    time.sleep(0.5)

print(f"\n✅ Check Globe for dot at IP: {attack_ip}")

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
print(f"🎯 DoS Attack from: {attack_ip}")

data = {
    "ip": attack_ip,
    "path": "/api/data",
    "method": "GET",
    "payload": ""
}

print("Sending rapid requests...")
for i in range(150):   # 150 requests → should trigger DoS detection
    response = requests.post(URL, json=data)
    if i % 20 == 0:
        result = response.json()
        print(f"{i+1}. Status: {result['status']} | Attack: {result.get('attack_type', 'none')}")
    time.sleep(0.02)

print(f"\n✅ DoS complete! Check Globe for dot at IP: {attack_ip}")

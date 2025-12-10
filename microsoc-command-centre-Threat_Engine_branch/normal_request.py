import requests
import random

URL = "http://127.0.0.1:8000/security/decision"

PUBLIC_IPS = [
    "8.8.8.8", "1.1.1.1", "208.67.222.222", "9.9.9.9",
    "185.228.168.9", "76.76.19.19", "94.140.14.14",
    "64.6.64.6", "77.88.8.8", "156.154.70.1"
]

attack_ip = random.choice(PUBLIC_IPS)
print(f"🎯 Normal Request from: {attack_ip}")

data = {
    "ip": attack_ip,
    "path": "/",
    "method": "GET",
    "user_agent": "Mozilla/5.0"
}

response = requests.post(URL, json=data)
result = response.json()

print(f"Status: {result['status']}")
print(f"Attack Type: {result.get('attack_type')}")
print(f"Severity: {result.get('severity')}")
print(f"\n✅ Check Globe for dot at IP: {attack_ip}")
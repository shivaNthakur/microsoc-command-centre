import requests
import time
import random

URL = "http://127.0.0.1:8000/security/decision"

# CREATE IP GENRATOR WITH REAL PUBLIC IPS

# Pool of real public IPs from different countries
PUBLIC_IPS = [
    "8.8.8.8",          # USA - Google DNS
    "1.1.1.1",          # Australia - Cloudflare
    "208.67.222.222",   # USA - OpenDNS
    "9.9.9.9",          # USA - Quad9
    "185.228.168.9",    # Netherlands - CleanBrowsing
    "76.76.19.19",      # USA - Alternate DNS
    "94.140.14.14",     # Germany - AdGuard
    "64.6.64.6",        # USA - Verisign
    "77.88.8.8",        # Russia - Yandex
    "156.154.70.1",     # USA - Neustar
]

# Select random IP for this attack session
attack_ip = random.choice(PUBLIC_IPS)
print(f"🎯 Brute Force Attack from: {attack_ip}")

for i in range(15):   # Brute force threshold = 5-10
    data = {
        "ip": attack_ip,
        "path": "/login",
        "method": "POST",
        "payload": f"user=admin&pass=wrong{i}"
    }

    response = requests.post(URL, json=data)
    result = response.json()
    print(f"{i+1}. Status: {result['status']} | Attack: {result.get('attack_type', 'none')}")
    time.sleep(0.5)

print(f"\n✅ Attack complete! Check Globe for dot at IP: {attack_ip}")









# import requests
# import time

# URL = "http://127.0.0.1:8000/security/decision"

# for i in range(15):   # Brute force threshold = 10
#     data = {
#         "ip": "192.168.1.120",
#         "path": "/login",
#         "method": "POST",
#         "payload": f"user=admin&pass=wrong{i}"
#     }

#     response = requests.post(URL, json=data)
#     print(i+1, response.json())
#     time.sleep(0.5)  # half-second between attempts
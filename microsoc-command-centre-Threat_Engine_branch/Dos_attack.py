import requests
import time

URL = "http://127.0.0.1:8000/security/decision"

data = {
    "ip": "192.168.1.105",
    "path": "/api/data",
    "method": "GET",
    "payload": ""
}

for i in range(300):   # 300 requests → should cross DoS threshold
    response = requests.post(URL, json=data)
    print(i+1, response.json())
    time.sleep(0.02)  # 20ms delay (DoS-like)
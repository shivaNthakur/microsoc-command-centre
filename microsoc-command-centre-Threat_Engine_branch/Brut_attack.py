import requests
import time

URL = "http://127.0.0.1:8000/security/decision"

for i in range(15):   # Brute force threshold = 10
    data = {
        "ip": "192.168.1.120",
        "path": "/login",
        "method": "POST",
        "payload": f"user=admin&pass=wrong{i}"
    }

    response = requests.post(URL, json=data)
    print(i+1, response.json())
    time.sleep(0.5)  # half-second between attempts
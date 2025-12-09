

import requests   

URL = "http://127.0.0.1:8000/security/decision"

data = {
  "path": "/login",
  "method": "POST",
  "user_agent": "Mozilla/5.0",
  "payload": "' OR '1'='1"
}

response = requests.post(URL, json=data)
print(response.json())

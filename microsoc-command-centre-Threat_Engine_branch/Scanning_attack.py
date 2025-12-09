import requests

URL = "http://127.0.0.1:8000/security/decision"

paths = [
    "/admin", "/admin/login", "/admin/config", "/dashboard",
    "/config", "/phpmyadmin", "/wp-admin", "/etc/passwd",
    "/server-status", "/backup", "/hidden", "/secrets"
]

for p in paths:
    data = {
        "ip": "192.168.1.150",
        "path": p,
        "method": "GET",
        "payload": ""
    }

    response = requests.post(URL, json=data)
    print(p, response.json())
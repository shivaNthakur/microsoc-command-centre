import requests
from .config import BACKEND_URL   # imports config from same folder

def send_log(log: dict):
    try:
        r = requests.post(BACKEND_URL, json=log)
        print("✔ Log sent:", log)
        print("⬅ Backend:", r.text)
    except Exception as e:
        print("✘ Error sending log:", e)

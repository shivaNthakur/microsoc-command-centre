# blocklist.py
import redis
import time
r = redis.Redis(host='localhost', port=6379, db=0)  # DB 0 for blocklist

def add_block(ip, duration=600):
    expire_time = int(time.time()) + duration
    r.set(f"blocked:{ip}", expire_time)
    r.expire(f"blocked:{ip}", duration)

def remove_block(ip):
    r.delete(f"blocked:{ip}")

def is_blocked(ip):
    expire_time = r.get(f"blocked:{ip}")
    if expire_time is None:
        return False
    try:
        return int(expire_time) > int(time.time())
    except:
        return False

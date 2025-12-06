# rate_limiter.py
import redis
import time

r = redis.Redis(host='localhost', port=6379, db=1)  # DB 1 for realtime counters

def add_request(ip, path, timestamp=None):
    """
    - req_ts_key: sorted set of timestamps (members are string of timestamp)
    - paths_key: sorted set of paths with last-seen timestamp as score (unique path tracking)
    - path_hits_key: simple counter key per ip+path for repeated same-path hits
    """
    if timestamp is None:
        timestamp = int(time.time())
    else:
        timestamp = int(timestamp)

    req_ts_key = f"req_ts:{ip}"
    paths_key = f"req_paths:{ip}"
    # store timestamp as member and score (allow duplicates because member is unique string of timestamp)
    member = str(timestamp)  # unique per event
    r.zadd(req_ts_key, {member: timestamp})
    r.expire(req_ts_key, 120)

    # store path with latest timestamp as score (unique per path)
    r.zadd(paths_key, {path: timestamp})
    r.expire(paths_key, 120)

    # increment per-path hits (counter)
    path_hits_key = f"path_hits:{ip}:{path}"
    r.incr(path_hits_key)
    r.expire(path_hits_key, 120)

def count_requests(ip, seconds):
    key = f"req_ts:{ip}"
    now = int(time.time())
    return r.zcount(key, now - seconds, now)

def count_unique_paths(ip, seconds):
    key = f"req_paths:{ip}"
    now = int(time.time())
    return r.zcount(key, now - seconds, now)

def count_same_path_hits(ip, path):
    key = f"path_hits:{ip}:{path}"
    v = r.get(key)
    try:
        return int(v) if v is not None else 0
    except:
        return 0

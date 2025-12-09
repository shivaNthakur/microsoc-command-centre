import time
import re
import redis
import json
import os
from rate_limiter import count_requests, count_unique_paths
from threat_intel import check_abuseipdb
from ml.predict import predict_payload
from ml.Hybrid_recommend import hybrid_remediation
from dotenv import load_dotenv

load_dotenv()

# ----------------- REDIS CONFIG -----------------
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
LOG_QUEUE = "attack_logs_queue"
REDIS_BLOCK_TTL = int(os.getenv("REDIS_BLOCK_TTL", 300))

try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    r.ping()
    print("✓ Redis connected in classifier")
except Exception as e:
    print(f"⚠️  Redis connection failed in classifier: {e}")
    r = None

# ----------------- HELPER FUNCTIONS -----------------
def push_log(log):
    try:
        if r:
            r.lpush(LOG_QUEUE, json.dumps(log))
    except Exception as e:
        print("Failed to push log to Redis:", e)

def block_ip(ip, reason, source, severity="HIGH"):
    record = {
        "ip": ip,
        "reason": reason,
        "source": source,
        "severity": severity,
        "timestamp": int(time.time())
    }
    try:
        if r:
            r.set(f"block:{ip}", json.dumps(record), ex=REDIS_BLOCK_TTL)
    except Exception as e:
        print(f"Failed to block IP {ip}: {e}")
    push_log(record)

def is_blocked(ip):
    try:
        if r:
            return r.exists(f"block:{ip}")
    except Exception as e:
        print(f"Failed to check if IP is blocked: {e}")
    return False

# ----------------- PATTERNS -----------------
SQLI = re.compile(r"(union|select|insert|update|delete|drop|create|alter|information_schema|--|;|'\s*or|or\s*'|'\s*=\s*'|=\s*'|'\s*=)", re.IGNORECASE)
XSS = re.compile(r"(<script|onerror=|onload=|javascript:|<iframe|<img|<svg)", re.IGNORECASE)
SENSITIVE_PATHS = {"/admin", "/phpmyadmin", "/backup.zip", "/.git", "/api/admin", "/config", "/admin.php"}

# ----------------- CLASSIFIER -----------------
def classify_request(ip, path, method, ua, payload=None, timestamp=None):
    timestamp = int(timestamp or time.time())
    ua = (ua or "").lower()
    path = path or "/"

    # --- Check if IP is blocked in Redis ---
    if is_blocked(ip):
        log = {
            "status": "BLOCK",
            "attack_type": "previous_block",
            "severity": "CRITICAL",
            "reason": "IP already blocked",
            "suggestion": "Wait TTL",
            "ip": ip,
            "path": path,
            "method": method,
            "timestamp": timestamp,
            "is_blocked_now": True
        }
        push_log(log)
        return log

# --- SQL Injection ---
    if payload:
        payload_str = str(payload).lower() if isinstance(payload, str) else json.dumps(payload).lower()
        if SQLI.search(payload_str) or SQLI.search(path.lower()):
            block_ip(ip, "SQL Injection", "RuleEngine", "HIGH")
            log = {
                "status": "BLOCK",
                "attack_type": "sql_injection",
                "severity": "HIGH",
                "reason": "SQL injection detected",
                "suggestion": "Sanitize input",
                "ip": ip,
                "path": path,
                "method": method,
                "timestamp": timestamp,
                "is_blocked_now": True
            }
            push_log(log)
            return log
    elif SQLI.search(path.lower()):
        block_ip(ip, "SQL Injection", "RuleEngine", "HIGH")
        log = {
            "status": "BLOCK",
            "attack_type": "sql_injection",
            "severity": "HIGH",
            "reason": "SQL injection detected in path",
            "suggestion": "Sanitize input",
            "ip": ip,
            "path": path,
            "method": method,
            "timestamp": timestamp,
            "is_blocked_now": True
        }
        push_log(log)
        return log

    # --- XSS Attempt ---
    if payload:
        payload_str = str(payload) if isinstance(payload, str) else json.dumps(payload)
        if XSS.search(payload_str):
            log = {
                "status": "WARN",
                "attack_type": "xss_attempt",
                "severity": "MEDIUM",
                "reason": "Possible XSS attempt",
                "suggestion": "Escape output",
                "ip": ip,
                "path": path,
                "method": method,
                "timestamp": timestamp,
                "is_blocked_now": False
            }
            push_log(log)
            return log

    # --- Rate Limiting / Brute Force Detection ---
    from rate_limiter import add_request, count_requests, add_path, count_same_path_hits, add_same_path
    
    add_request(ip, timestamp)
    add_path(ip, path, timestamp)
    add_same_path(ip, path, timestamp)
    
    # Check for brute force: multiple failed login attempts to same path
    if path.lower() in ["/login", "/auth", "/api/login", "/admin/login"]:
        same_path_hits = count_same_path_hits(ip, path, window=60)
        if same_path_hits >= 5:  # 5 failed attempts in 60 seconds
            block_ip(ip, f"Brute Force: {same_path_hits} failed login attempts", "RateLimiter", "CRITICAL")
            log = {
                "status": "BLOCK",
                "attack_type": "brute_force",
                "severity": "CRITICAL",
                "reason": f"Brute force detected: {same_path_hits} failed login attempts in 60s",
                "suggestion": "IP blocked automatically",
                "ip": ip,
                "path": path,
                "method": method,
                "timestamp": timestamp,
                "is_blocked_now": True
            }
            push_log(log)
            return log
    
    # Check for rapid requests (potential DoS)
    request_count = count_requests(ip, window=60)
    if request_count >= 100:  # 100 requests in 60 seconds
        block_ip(ip, f"DoS: {request_count} requests in 60s", "RateLimiter", "HIGH")
        log = {
            "status": "BLOCK",
            "attack_type": "dns_attack",  # Using dns_attack as DoS type
            "severity": "HIGH",
            "reason": f"DoS detected: {request_count} requests in 60s",
            "suggestion": "Rate limit exceeded",
            "ip": ip,
            "path": path,
            "method": method,
            "timestamp": timestamp,
            "is_blocked_now": True
        }
        push_log(log)
        return log

    # --- Sensitive Paths ---
    if path.lower() in SENSITIVE_PATHS:
        block_ip(ip, "Sensitive Path Access", "RuleEngine")
        log = {
            "status": "BLOCK",
            "attack_type": "sensitive_path_access",
            "severity": "HIGH",
            "reason": f"Accessed sensitive path {path}",
            "suggestion": "Restrict access",
            "ip": ip,
            "path": path,
            "method": method,
            "timestamp": timestamp,
            "is_blocked_now": True
        }
        push_log(log)
        return log

    # --- ML / AI Prediction ---
    if payload:
        try:
            src = payload.get("src_ip")
            dst = payload.get("dst_ip")
            port = payload.get("port")
            protocol = payload.get("protocol")
            size = payload.get("packet_size")

            if None not in (src, dst, port, protocol, size):
                label, conf = predict_payload(src, dst, port, protocol, size)
                if label != "normal" and conf > 0.85:
                    status = "BLOCK"
                    log = {
                        "status": status,
                        "attack_type": f"ML_{label}",
                        "severity": "HIGH",
                        "reason": f"AI detected {label}",
                        "suggestion": "Investigate",
                        "ip": ip,
                        "path": path,
                        "method": method,
                        "timestamp": timestamp,
                        "confidence": conf,
                        "is_blocked_now": True
                    }
                    push_log(log)
                    return log
        except Exception as e:
            print("ML prediction failed:", e)

    # --- Normal Request ---
    rec = hybrid_remediation("normal")
    allow_log = {
        "status": "ALLOW",
        "attack_type": "normal",
        "severity": rec["severity"],
        "reason": "Hybrid passed",
        "suggestion": rec["suggestion"],
        "ip": ip,
        "path": path,
        "method": method,
        "timestamp": timestamp,
        "is_blocked_now": False
    }
    push_log(allow_log)
    return allow_log

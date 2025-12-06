import time
import re
from rate_limiter import add_request, count_requests, count_unique_paths, count_same_path_hits
from threat_intel import check_abuseipdb  
from blocker import block_ip, is_blocked




# Precompile regex for performance
SQLI_PATTERNS = re.compile(r"(\bunion\b|\bselect\b|\binformation_schema\b|--|;|'\s+or\s+1=1|\bdrop\b)", re.IGNORECASE)
XSS_PATTERNS = re.compile(r"(<script\b|onerror=|onload=|javascript:)", re.IGNORECASE)

# Sensitive paths (immediate high severity)
SENSITIVE_PATHS = {
    "/.env", "/wp-login.php", "/admin", "/phpmyadmin", "/backup.zip", "/.git", "/config.php"
}

# Known bot user-agent keywords (expandable)
BOT_UA_KEYWORDS = ["python-requests", "python", "curl", "wget", "nmap", "masscan", "nikto", "sqlmap", "httpclient"]

# thresholds (tweakable)
BRUTE_FORCE_THRESHOLD = 10       # attempts in 60s
BRUTE_FORCE_WINDOW = 60
DIR_SCAN_THRESHOLD = 20         # unique paths in 30s
DIR_SCAN_WINDOW = 30
DOS_THRESHOLD = 200             # total requests in 10s
DOS_WINDOW = 10
SAME_PATH_HITS_THRESHOLD = 50   # same path hits in 60s
SAME_PATH_HITS_WINDOW = 60


from collections import defaultdict

failed_logins = defaultdict(list)

def detect_brute_force(ip, path, payload, timestamp):
    if "/login" in path and payload:
        if payload.get("status") == "failed":
            failed_logins[ip].append(timestamp)

        # remove events older than 60s
        failed_logins[ip] = [t for t in failed_logins[ip] if timestamp - t < 60]

        if len(failed_logins[ip]) >= 5:  # 5 failed attempts inside 1 minute
            return {
                "status": "BLOCK",
                "attack_type": "brute_force_login",
                "severity": "HIGH",
                "reason": "Multiple failed login attempts detected",
                "suggestion": "Enable CAPTCHA or Multi-Factor Authentication"
            }
    return None



def classify_request(ip, path, method, ua, timestamp=None, payload=None):
    """
    Return a dict:
    {
      "status": "ALLOW"/"WARN"/"BLOCK",
      "attack_type": ...,
      "severity": "LOW/MEDIUM/HIGH",
      "reason": "...",
      "suggestion": "..."
    }
    """
    if timestamp is None:
        timestamp = int(time.time())
    else:
        timestamp = int(timestamp)

    # normalize
    path = path or "/"
    method = (method or "GET").upper()
    ua = (ua or "").lower()

    if is_blocked(ip):
    return {
        "status": "BLOCK",
        "attack_type": "blocked_ip",
        "severity": "CRITICAL",
        "reason": "IP is blocked due to previous malicious activity",
        "suggestion": "Unblock manually or wait for timeout"
    }

    # record event into redis counters
    add_request(ip, path, timestamp)

   
    try:
        intel = check_abuseipdb(ip) 
        if intel and intel.get("is_malicious"):
            return {"status":"BLOCK", "attack_type":"threat_intel", "severity":"HIGH",
                    "reason": f"IP listed in AbuseIPDB (confidence {intel.get('confidence')})",
                    "suggestion":"Block IP & investigate"}
    except Exception:
        # do not fail if external check errors
        pass

    # 1) SQL Injection detection (payload or path)
    combined = ""
    if payload:
        try:
            combined = str(payload)
        except:
            combined = ""
    combined += " " + str(path)
    if SQLI_PATTERNS.search(combined):
        block_ip(ip)
        return {"status":"BLOCK", "attack_type":"sql_injection", "severity":"HIGH",
                "reason":"SQL injection pattern detected", "suggestion":"Sanitize inputs and block IP"}

    # 2) XSS detection
    if XSS_PATTERNS.search(combined):
        return {"status":"WARN", "attack_type":"xss_attempt", "severity":"MEDIUM",
                "reason":"Possible XSS payload detected", "suggestion":"Sanitize output and review input"}

    # 3) Sensitive file access
    lower_path = path.lower()
    for sp in SENSITIVE_PATHS:
        if lower_path.startswith(sp) or lower_path == sp:
            block_ip(ip)
            return {"status":"BLOCK", "attack_type":"sensitive_path_access", "severity":"HIGH",
                    "reason":f"Access to sensitive path {sp}", "suggestion":"Block & investigate"}
    #  Brute Force Login Detection Based on failed attempts pattern
    bf = detect_brute_force(ip, lower_path, payload, timestamp)
    if bf:
        return bf


    # 4) Brute-force login 
    if lower_path.startswith("/login") and method == "POST":
        attempts = count_requests(ip, BRUTE_FORCE_WINDOW)
        if attempts > BRUTE_FORCE_THRESHOLD:
            block_ip(ip)
            return {"status":"BLOCK", "attack_type":"bruteforce", "severity":"HIGH",
                    "reason":f"{attempts} requests in {BRUTE_FORCE_WINDOW}s targeting login", "suggestion":"Block IP temporarily"}

    # 5) Directory scan detection 
    uniq = count_unique_paths(ip, DIR_SCAN_WINDOW)
    if uniq > DIR_SCAN_THRESHOLD:
        return {"status":"BLOCK", "attack_type":"directory_scan", "severity":"MEDIUM",
                "reason":f"{uniq} unique paths in {DIR_SCAN_WINDOW}s", "suggestion":"Block or throttle source"}

    # 6) DDoS / request flood detection
    reqs = count_requests(ip, DOS_WINDOW)
    if reqs > DOS_THRESHOLD:
        block_ip(ip)
        return {"status":"BLOCK", "attack_type":"dos_flood", "severity":"CRITICAL",
                "reason":f"{reqs} requests in last {DOS_WINDOW}s", "suggestion":"Apply rate-limiting and block"}

    # 7) Repeated same-path hits 
    same_hits = count_same_path_hits(ip, path)
    if same_hits > SAME_PATH_HITS_THRESHOLD:
        return {"status":"WARN", "attack_type":"repeated_same_path", "severity":"MEDIUM",
                "reason":f"{same_hits} hits to {path} in short time", "suggestion":"Throttle or block if continues"}

    # 8) Bot / automation UA detection
    for k in BOT_UA_KEYWORDS:
        if k in ua:
            # escalate to block if combined with high request rate
            if reqs > (DOS_THRESHOLD // 4):
                block_ip(ip)
                return {"status":"BLOCK", "attack_type":"automated_bot", "severity":"HIGH",
                        "reason":f"Bot UA {k} with high request rate", "suggestion":"Block automation and require challenge"}
            return {"status":"WARN", "attack_type":"automated_bot", "severity":"LOW",
                    "reason":f"User-Agent contains {k}", "suggestion":"Monitor or challenge user"}
    from ml.model import predict_payload

    label, confidence = predict_payload(combined)

    if confidence > 0.80 and label != "normal":
        return {
            "status": "WARN" if confidence < 0.92 else "BLOCK",
            "attack_type": f"ML_{label}",
            "severity": "HIGH" if confidence > 0.92 else "MEDIUM",
            "reason": f"AI model detected possible {label} payload",
            "confidence": confidence,
            "suggestion": "Review request / apply filter"
        }


    return {"status":"ALLOW", "severity":"NORMAL", "reason":"No rule matched"}
@app.post("/classify")
async def classify_api(payload: dict):
    request_body = json.dumps(payload)

    classification = classify_threat(request_body)

    # Send To Backend
    send_to_backend({
        "attack": classification,
        "payload": payload,
        "timestamp": time.time()
    })

    return {"result": classification}
send_to_backend()

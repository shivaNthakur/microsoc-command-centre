from attacks.common.log_utils import send_log

payloads = [
    "' OR 1=1 --",
    "' UNION SELECT * FROM users --",
    "' OR 'a'='a"
]

for p in payloads:
    log = {
        "tool": "sqli",
        "payload": p,
        "target": "/login",
        "severity": "critical",
        "source_ip": "192.168.1.70"
    }
    send_log(log)

from attacks.common.log_utils import send_log

payloads = [
    "<script>alert('xss')</script>",
    "<img src=x onerror=alert(1)>",
    "<svg onload=alert('hack')>"
]

for p in payloads:
    log = {
        "tool": "xss",
        "payload": p,
        "target": "/search",
        "severity": "medium",
        "source_ip": "192.168.1.80"
    }
    send_log(log)

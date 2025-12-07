from attacks.common.log_utils import send_log

vulns = [
    "Outdated Apache version",
    "X-Frame-Options header missing",
    "Exposed server-status page"
]

for v in vulns:
    log = {
        "tool": "nikto",
        "vulnerability": v,
        "severity": "high",
        "source_ip": "192.168.1.60"
    }
    send_log(log)

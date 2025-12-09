from attacks.common.log_utils import send_log

paths = ["admin", "login", "dashboard", "config", "backup"]

for p in paths:
    log = {
        "tool": "gobuster",
        "path": f"/{p}",
        "source_ip": "192.168.1.50",
        "severity": "medium"
    }
    send_log(log)

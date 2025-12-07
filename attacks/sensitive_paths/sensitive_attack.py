from attacks.common.log_utils import send_log

paths = ["/.env", "/backup.zip", "/config.json"]

for p in paths:
    log = {
        "tool": "sensitive_path",
        "path": p,
        "severity": "high",
        "source_ip": "192.168.1.100"
    }
    send_log(log)

from attacks.common.log_utils import send_log

paths = [
    "/admin",
    "/config",
    "/hidden",
    "/private",
    "/backup"
]

for p in paths:
    log = {
        "tool": "dirscan",
        "path": p,
        "severity": "medium",
        "source_ip": "192.168.1.200"
    }
    send_log(log)

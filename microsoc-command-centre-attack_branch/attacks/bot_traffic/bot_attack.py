from attacks.common.log_utils import send_log

for i in range(30):
    log = {
        "tool": "bot",
        "endpoint": f"/random{i}",
        "severity": "low",
        "source_ip": "10.0.0.5"
    }
    send_log(log)

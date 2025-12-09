from attacks.common.log_utils import send_log

for i in range(100):
    log = {
        "tool": "dos",
        "request_id": i,
        "severity": "critical",
        "source_ip": "10.0.0.9"
    }
    send_log(log)

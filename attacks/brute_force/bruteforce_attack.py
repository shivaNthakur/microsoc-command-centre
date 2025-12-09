from attacks.common.log_utils import send_log

for i in range(30):
    log = {
        "tool": "brute_force",
        "username": "admin",
        "password": f"wrong_pass_{i}",
        "severity": "high",
        "source_ip": "192.168.1.90"
    }
    send_log(log)

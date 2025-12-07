RULES = [
    # 1. Brute Force
    {
        "name": "Brute Force Login",
        "condition": lambda logs, log: (
            log.tool == "bruteforce" and
            len([l for l in logs if l.tool == "bruteforce" and l.source_ip == log.source_ip]) >= 5
        ),
        "severity": "high"
    },

    # 2. Bot Traffic
    {
        "name": "Bot Traffic Spike",
        "condition": lambda logs, log: (
            log.tool == "bot" and
            len([l for l in logs if l.tool == "bot"]) >= 20
        ),
        "severity": "medium"
    },

    # 3. SQL Injection
    {
        "name": "SQL Injection Attempt",
        "condition": lambda logs, log: log.tool == "sqli",
        "severity": "high"
    },

    # 4. XSS Attempt
    {
        "name": "XSS Attempt",
        "condition": lambda logs, log: log.tool == "xss",
        "severity": "medium"
    },

    # 5. Directory Scan (Gobuster)
    {
        "name": "Directory Bruteforce",
        "condition": lambda logs, log: (
            log.tool == "dirscan" and
            len([l for l in logs if l.tool == "dirscan" and l.source_ip == log.source_ip]) >= 10
        ),
        "severity": "medium"
    },

    # 6. Sensitive Path Hit
    {
        "name": "Sensitive Path Probing",
        "condition": lambda logs, log: log.tool == "sensitive",
        "severity": "high"
    },

    # 7. DoS (too many hits)
    {
        "name": "DoS Attack",
        "condition": lambda logs, log: (
            log.tool == "dos" and
            len([l for l in logs if l.tool == "dos"]) >= 100
        ),
        "severity": "critical"
    },

    # 8. Port Scan (Nmap)
    {
        "name": "Port Scan Detected",
        "condition": lambda logs, log: (
            log.tool == "nmap" and
            len(log.details.get("open_ports", [])) >= 10
        ),
        "severity": "medium"
    },

    # 9. Gobuster Scan
    {
        "name": "Directory Enumeration",
        "condition": lambda logs, log: log.tool == "gobuster",
        "severity": "low"
    },

    # 10. Nikto Vulnerability Scan
    {
        "name": "High Risk Web Vulnerability",
        "condition": lambda logs, log: (
            log.tool == "nikto" and "high" in log.details.get("risk", "")
        ),
        "severity": "high"
    }
]

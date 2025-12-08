Features Implemented in This Branch
1. Log Model

A unified log structure for all attack scripts.

2. Incident Model

Stores detected threats with fields like:

attack name

severity

related logs

attacker IP

3. Rule Engine

Includes rules for:

brute force

bot traffic

SQL injection

DoS

XSS

gobuster

nmap port scan

nikto high-risk scan

sensitive resource probing

4. Real-time Log Processing

Each incoming log is immediately evaluated against all rules.

5. Automatic Incident Creation

Whenever a rule matches, an Incident object is generated.

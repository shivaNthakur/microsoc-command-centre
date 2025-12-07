import xmltodict
import json
from attacks.common.log_utils import send_log

with open("attacks/nmap_scan/nmap_output.xml", "r") as f:
    xml_data = f.read()

parsed = xmltodict.parse(xml_data)
host = parsed["nmaprun"]["host"]
source_ip = host["address"]["@addr"]

ports = host["ports"]["port"]
open_ports = []

if not isinstance(ports, list):
    ports = [ports]

for p in ports:
    if p["state"]["@state"] == "open":
        open_ports.append({
            "port": p["@portid"],
            "service": p["service"]["@name"]
        })

log = {
    "tool": "nmap",
    "source_ip": source_ip,
    "open_ports": open_ports,
    "severity": "info"
}

send_log(log)

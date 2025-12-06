import xmltodict
import json
import requests


with open("nmap_output.xml", "r", encoding="utf-8") as f:
    xml_data = f.read()


parsed = xmltodict.parse(xml_data)


host = parsed["nmaprun"]["host"]

source_ip = host["address"]["@addr"]


ports_data = host["ports"]["port"]

open_ports = []


if isinstance(ports_data, list):
    ports_list = ports_data
else:
    ports_list = [ports_data]


for p in ports_list:
    if p["state"]["@state"] == "open":
        open_ports.append({
            "port": int(p["@portid"]),
            "service": p["service"]["@name"]
        })


final_json = {
    "tool": "nmap",
    "source_ip": source_ip,
    "open_ports": open_ports,
    "severity": "info"
}

print("\nGenerated JSON:\n")
print(json.dumps(final_json, indent=4))


response = requests.post(
    "http://127.0.0.1:8000/logs/ingest",
    json=final_json
)

print("\nBackend Response:\n")
print(response.json())

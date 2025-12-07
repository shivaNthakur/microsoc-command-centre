from models.incident import Incident
from rules_engine.rules import RULES

INCIDENTS = []
ALL_LOGS = []


def process_log(log):
    ALL_LOGS.append(log)

    for rule in RULES:
        if rule["condition"](ALL_LOGS, log):
            incident = Incident(
                title=rule["name"],
                severity=rule["severity"],
                related_logs=[log.dict()],
                source_ip=log.source_ip
            )
            INCIDENTS.append(incident)
            print("\n🔥 INCIDENT CREATED:", incident.title)
            print("Severity:", incident.severity)
            print("Source IP:", incident.source_ip)
            return incident

    return None

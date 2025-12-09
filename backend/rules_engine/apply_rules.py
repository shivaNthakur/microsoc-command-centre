# backend/rules_engine/apply_rules.py
from backend.models.incident import Incident
from backend.rules_engine.rules import RULES
import backend.ws as ws_helper

INCIDENTS = []
ALL_LOGS = []

# main function: called synchronously from FastAPI handler
def process_log(log):
    ALL_LOGS.append(log)

    for rule in RULES:
        try:
            if rule["condition"](ALL_LOGS, log):
                incident = Incident(
                    title=rule["name"],
                    severity=rule["severity"],
                    related_logs=[log.dict()],
                    source_ip=log.source_ip
                )
                INCIDENTS.append(incident)

                print(f"\n🔥 INCIDENT CREATED: {incident.title}")
                print("Severity:", incident.severity)
                print("Source IP:", incident.source_ip)

                # Broadcast a raw incident (frontend handles both raw and wrapped)
                # We send the raw incident so the client can parse it directly.
                ws_helper.broadcast(incident.dict())

                return incident
        except Exception as e:
            print(f"⚠ Error evaluating rule: {rule.get('name')} error: {e}")

    return None

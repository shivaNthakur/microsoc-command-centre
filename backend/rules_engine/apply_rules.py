
from backend.models.incident import Incident
from backend.rules_engine.rules import RULES

ALL_LOGS = []
INCIDENTS = []
WS_CLIENTS = []  # WebSocket subscribers


# -----------------------------
# BROADCAST INCIDENT TO ALL WEBSOCKET CLIENTS
# -----------------------------
async def broadcast_to_clients(incident_dict):
    dead_clients = []

    for ws in WS_CLIENTS:
        try:
            await ws.send_json(incident_dict)
        except:
            dead_clients.append(ws)

    for ws in dead_clients:
        WS_CLIENTS.remove(ws)


# -----------------------------
# MAIN RULE ENGINE FUNCTION
# -----------------------------
def process_log(log):
    ALL_LOGS.append(log)

    for rule in RULES:
        if rule["condition"](ALL_LOGS, log):

            # Create new Incident
            incident = Incident(
                title=rule["name"],
                severity=rule["severity"],
                related_logs=[log.dict()],
                source_ip=log.source_ip
            )

            INCIDENTS.append(incident)
            print(f"\n🔥 INCIDENT CREATED: {incident.title}")

            # Send incident through WebSocket
            import asyncio
            asyncio.create_task(broadcast_to_clients(incident.dict()))

            return incident

    return None


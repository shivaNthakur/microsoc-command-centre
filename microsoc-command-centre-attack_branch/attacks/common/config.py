import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Threat Engine endpoint for security decision
# Can be configured via .env file or defaults to localhost
THREAT_ENGINE_URL = os.getenv("THREAT_ENGINE_URL", "http://127.0.0.1:8000/security/decision")

# Optional: Direct backend URL (if you want to bypass threat engine)
# BACKEND_URL = os.getenv("BACKEND_URL", "http://10.255.32.169:3000/api/logs/ingest")

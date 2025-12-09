import requests
from .config import THREAT_ENGINE_URL   # imports config from same folder

def send_log(log: dict):
    """
    Transform attack log format to match Threat Engine expected format
    and send to Threat Engine /security/decision endpoint
    """
    try:
        # Transform attack log to threat engine format
        # Threat engine expects: ip, path, method, user_agent, payload (optional)
        
        # Extract IP (handle both source_ip and ip)
        ip = log.get("source_ip") or log.get("ip") or "192.168.1.100"
        
        # Extract path/target
        path = log.get("target") or log.get("path") or log.get("endpoint") or "/"
        
        # Determine method based on attack type
        method = log.get("method") or "POST"  # Most attacks are POST
        
        # Extract user agent or use default
        user_agent = log.get("user_agent") or "Mozilla/5.0 (Attack-Simulator)"
        
        # Build payload based on attack type
        payload = None
        tool = log.get("tool", "").lower()
        
        if tool in ["sqli", "sql_injection"]:
            # SQL injection attack
            payload = log.get("payload") or log.get("query") or "' OR 1=1 --"
            path = log.get("target") or "/login"
        elif tool in ["xss", "xss_attempt"]:
            # XSS attack
            payload = log.get("payload") or "<script>alert('xss')</script>"
            path = log.get("target") or "/search"
        elif tool in ["brute_force", "bruteforce"]:
            # Brute force attack
            payload = {
                "username": log.get("username") or "admin",
                "password": log.get("password") or "wrong_pass",
                "src_ip": ip,
                "dst_ip": "10.0.0.1",
                "port": 443,
                "protocol": "TCP",
                "packet_size": 600,
                "status": "failed"
            }
            path = log.get("target") or "/login"
        elif tool in ["bot", "bot_traffic"]:
            # Bot traffic
            path = log.get("endpoint") or log.get("target") or "/random"
            method = "GET"
        else:
            # Generic attack - include payload if available
            if "payload" in log:
                payload = log.get("payload")
        
        # Build request payload for threat engine
        threat_engine_payload = {
            "ip": ip,
            "path": path,
            "method": method,
            "user_agent": user_agent
        }
        
        # Add payload if available
        if payload:
            threat_engine_payload["payload"] = payload
        
        # Send to threat engine
        r = requests.post(THREAT_ENGINE_URL, json=threat_engine_payload, timeout=10)
        
        if r.status_code in [200, 201]:
            print(f"✔ Attack sent to Threat Engine: {tool} from {ip}")
            print(f"   Status: {r.status_code}")
            try:
                response_data = r.json()
                print(f"   Response: {response_data}")
            except:
                print(f"   Response: {r.text[:100]}")
        else:
            print(f"⚠️  Threat Engine returned status {r.status_code}")
            print(f"   Response: {r.text[:200]}")
        
    except requests.exceptions.ConnectionError as e:
        print(f"❌ CONNECTION ERROR: Cannot reach Threat Engine at {THREAT_ENGINE_URL}")
        print(f"   Make sure Threat Engine is running:")
        print(f"   cd microsoc-command-centre-Threat_Engine_branch")
        print(f"   uvicorn app:app --host 127.0.0.1 --port 8000")
    except requests.exceptions.Timeout as e:
        print(f"⏱️  TIMEOUT: Threat Engine did not respond in time")
        print(f"   URL: {THREAT_ENGINE_URL}")
    except Exception as e:
        print(f"✘ Error sending attack to Threat Engine: {e}")
        import traceback
        traceback.print_exc()

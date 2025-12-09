import sys, os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, ROOT_DIR)

print("PYTHONPATH → ", ROOT_DIR)


import time

from attacks.nmap_scan.parse_nmap import *
from attacks.gobuster_scan.gobuster_attack import *
from attacks.nikto_scan.nikto_attack import *
from attacks.sqli.sqli_attack import *
from attacks.xss.xss_attack import *
from attacks.brute_force.bruteforce_attack import *
from attacks.dirscan.dirscan_attack import *
from attacks.sensitive_paths.sensitive_attack import *
from attacks.bot_traffic.bot_attack import *
from attacks.dos.dos_attack import *

print("\n🔥 Running full attack simulation...\n")

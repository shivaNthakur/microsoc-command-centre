# MICROSOC-Command-Centre

## 📌 Project Overview

MICROSOC-Command-Centre is a real-time cybersecurity monitoring platform that integrates:

- **Next.js Web Dashboard**
- **Node.js + Redis + Socket.IO Backend**
- **Python Rule-Engine for Threat Detection**

The system monitors **10 cyber-attacks**, processes logs in real time, generates incidents, and streams them live to Admin and Analyst dashboards — designed like a modern **Security Operations Centre (SOC)**.

---

## 🧩 Technology Stack

### **Frontend**
- Next.js  
- React  
- TypeScript  
- Tailwind CSS  
- Framer Motion  
- Chart.js  
- Three.js + React-Three-Fiber  

### **Backend**
- Node.js  
- Express / Koa  
- MongoDB  
- Redis (Pub/Sub)  
- Socket.IO  

### **Python Threat Engine**
- Python  
- FastAPI  
- Pydantic  
- Custom rule engine  
- 10 attack simulation scripts  

---

## 🎛 Features by Role

### 🔹 Landing & Authentication
- Landing Page  
- Admin + Analyst Login  
- Analyst Signup + Approval Flow  

### 🔹 Analyst Dashboard
- Assigned Tasks  
- Real-Time Incident Timeline  
- Attack Cards for 10 Threat Types  

### 🔹 Admin Dashboard
- Severity Graphs  
- Attack Distribution  
- 3D Globe (Attack Origin Map)  
- System Stats (Total Attacks, Analysts, LSTM Accuracy)

---

## 🛡 Python Cybersecurity Engine

### **Attack Simulation**
- 10 Python scripts generating cyber-attack logs  
- Master orchestrator for controlling all attacks  

### **Rule Engine**
- `rules.py` → Snort/YARA-style logic  
- `apply_rules.py` → converts logs into incidents  

### **Incident Format**
```json
{
  "title": "",
  "severity": "",
  "source_ip": "",
  "timestamp": "",
  "related_logs": []
}
```
```
📁 Folder Structure
1️⃣ Python Attack Scripts
attacks/
│   __init__.py
├── bot_traffic/
│     bot_attack.py
│     __pycache__/
├── brute_force/
│     bruteforce_attack.py
│     __pycache__/
├── common/
│     config.py
│     log_utils.py
│     __pycache__/
├── dirscan/
│     dirscan_attack.py
│     __pycache__/
├── dos/
│     dos_attack.py
│     __pycache__/
├── gobuster_scan/
│     gobuster_attack.py
│     __pycache__/
├── master/
│     run_all_attacks.py
│     __pycache__/
├── nikto_scan/
│     nikto_attack.py
│     __pycache__/
├── nmap_scan/
│     parse_nmap.py
│     nmap_output.xml
│     __pycache__/
├── sensitive_paths/
│     sensitive_attack.py
│     __pycache__/
├── sqli/
│     sqli_attack.py
│     __pycache__/
├── xss/
│     xss_attack.py
│     __pycache__/


2️⃣ Threat Engine (Python)
microsoc-command-centre/
│   app.py
│   AI_predict.py
│   log_reciver.py
│   blocker.py
│   blocklist.py
│   rate_limiter.py
│   SQL_injection.py
│   XSS_attack.py
│   threat_intel.py
│   normal_request.py
│   decisions.log
├── ml/
│     dataset.csv
│     dataset_making.py
│     Hybrid_recommend.py
│     train.py
│     predict.py
│     scaler.pkl
│     tokenizer.pkl
│     threat_lstm.h5
│     protocol_encoder.pkl
│     label_encoder.pkl
│     lstm_threat_dataset.csv

3️⃣ Frontend (Next.js)
public/
│   logo.jpg
│   landing_background.jpg
│   power-ranger3.png
├── attack_images/
│     bot_traffic.jpg
│     brute_force.jpg
│     dir_scan.jpg
│     dos.jpg
│     gobuster.jpg
│     nikto.jpg
│     nmap.jpg
│     sensitive.jpg
│     sqli.jpg
│     xss.jpg

src/
├── app/
│   layout.tsx
│   page.tsx
│
│   ├── admin/
│   │     dashboard/page.tsx
│   │     dashboard/location/page.tsx
│   │     notifications/page.tsx
│   │     pending-analysts/page.tsx
│
│   ├── analyst/
│   │     dashboard/page.tsx
│   │     incidents/page.tsx
│
│   ├── login/page.tsx
│   ├── signup/page.tsx
│
├── components/
│   AboutSection.tsx
│   FeaturesSection.tsx
│   FooterSection.tsx
│   HeroSection.tsx
│   NavBar.tsx
│
├── dashboard_admin/
│     AdminDashboard.tsx
│     Globe.tsx
│     Sidebar.tsx
│     Topbar.tsx
│
├── dashboard_analyst/
│     AttackCards.tsx
│     AttackModal.tsx
│     AttackTypeStats.tsx
│     Topbar.tsx
│     AttackerIPTable.tsx

4️⃣ Backend (Node.js)
microsoc-command-centre/
├── package.json
├── tsconfig.json
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (auth)/signup/page.tsx
│   │   ├── admin/
│   │   ├── analyst/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── incidents/
│   │   ├── logs/
│   │   ├── socket/
│   │   └── users/
│
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── models/
│   ├── schema/
│   ├── services/
│   ├── socket/
│   ├── types/
│   └── utils/
```
📦 Packages to Install

Python
pip install fastapi uvicorn redis python-dotenv pydantic aiofiles websockets python-multipart requests aiohttp python-socketio fastapi-socketio aioredis sqlalchemy psycopg2-binary regex black isort pytest


Node.js / Frontend
npm install react react-dom next socket.io-client axios zustand recharts lucide-react

npm install -D tailwindcss postcss autoprefixer

# UI Overview

=> Landing Page

<img width="1891" height="848" alt="image" src="https://github.com/user-attachments/assets/503af3d5-6630-4bcd-bea3-ca81ab2ab584" />

=> About Section

<img width="1867" height="783" alt="image" src="https://github.com/user-attachments/assets/5f2ad5ad-65b2-44dc-8fa3-25c190ad6f52" />

=> Locations on Globe

<img width="1024" height="471" alt="image" src="https://github.com/user-attachments/assets/047e03af-a847-49b4-887f-224aa1f72f98" />

=> Attacks

<img width="1896" height="866" alt="image" src="https://github.com/user-attachments/assets/6b6f1038-1f73-4411-b30e-932877eca009" />


=> Future Admin and Analyst Dashboard

<img width="1887" height="936" alt="image" src="https://github.com/user-attachments/assets/52748bce-a5c5-4260-a295-8aa8f14776eb" />

<img width="1888" height="864" alt="image" src="https://github.com/user-attachments/assets/39e0bc15-9434-4a3c-97e6-a3dd7b7e8d27" />




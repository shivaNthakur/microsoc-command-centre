# Attack Analytics Dashboard - Architecture & Component Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ANALYST DASHBOARD                            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    Dashboard Page                           │ │
│  │         (src/app/analyst/dashboard/page.tsx)               │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────────────────────────┐   │ │
│  │  │          AttackTypeStats Component                │   │ │
│  │  │  (src/components/dashboard_analyst/...)           │   │ │
│  │  │                                                    │   │ │
│  │  │  ┌─────────────────────────────────────────────┐ │   │ │
│  │  │  │  Bar Chart - Attack Counts by Type         │ │   │ │
│  │  │  │  (Recharts BarChart)                       │ │   │ │
│  │  │  │                                            │ │   │ │
│  │  │  │  SQL Injection: 45 │ XSS: 32 │ DDoS: 15 │ │   │ │
│  │  │  └─────────────────────────────────────────────┘ │   │ │
│  │  │                                                    │   │ │
│  │  │  ┌─────────────────────────────────────────────┐ │   │ │
│  │  │  │  Pie Chart - Severity Distribution         │ │   │ │
│  │  │  │  (Recharts PieChart)                       │ │   │ │
│  │  │  │                                            │ │   │ │
│  │  │  │  Critical: 5 | High: 20 | Medium: 15    │ │   │ │
│  │  │  └─────────────────────────────────────────────┘ │   │ │
│  │  │                                                    │   │ │
│  │  │  ┌─────────────────────────────────────────────┐ │   │ │
│  │  │  │  Clickable Attack Type Cards               │ │   │ │
│  │  │  │                                            │ │   │ │
│  │  │  │  ┌────────────┐ ┌────────────────┐       │ │   │ │
│  │  │  │  │ SQL Inject │ │ XSS Attack    │  ...  │ │   │ │
│  │  │  │  │ Count: 45  │ │ Count: 32     │       │ │   │ │
│  │  │  │  │ Severity:H │ │ Severity: M   │       │ │   │ │
│  │  │  │  └────────────┘ └────────────────┘       │ │   │ │
│  │  │  └─────────────────────────────────────────────┘ │   │ │
│  │  └────────────────────────────────────────────────┘   │ │
│  │                       │                               │ │
│  │                      Click                            │ │
│  │                       ▼                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                   Navigate to Details Page
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ATTACK DETAILS PAGE                              │
│              (/analyst/attacks/details?type=SQL%20Injection)       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │          Statistics Cards (Top Row)                         │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │  Total   │ │ Critical │ │   High   │ │  Medium  │  ... │ │
│  │  │   45     │ │    5     │ │    20    │ │    15    │      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐  │
│  │   Time Series Chart      │  │  Severity Pie Chart          │  │
│  │  (Area Chart)            │  │  (Pie Chart)                 │  │
│  │                          │  │                              │  │
│  │  Attacks                 │  │   Critical    5              │  │
│  │    ▲                     │  │   ┌─────────┐               │  │
│  │    │    ╱╲              │  │   │         │               │  │
│  │    │   ╱  ╲             │  │   │  High 20│   Medium 15   │  │
│  │    │  ╱    ╲            │  │   │         │               │  │
│  │    │ ╱      ╲           │  │   └─────────┘               │  │
│  │    │                    │  │                              │  │
│  │    └────────────────────┼──│──────────────────────────────┤  │
│  │    0  4  8 12 16 20 24 │  │                              │  │
│  │         Hour of Day     │  │                              │  │
│  └──────────────────────────┘  └──────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Recent Attack Incidents Table                   │ │
│  │                                                              │ │
│  │  Timestamp  │ IP Address    │ Method│ Target  │ Severity   │ │
│  │ ─────────────────────────────────────────────────────────── │ │
│  │ 10:30:45   │ 192.168.1.100 │ POST │ /api... │ High  ██   │ │
│  │ 10:30:32   │ 10.0.0.50     │ GET  │ /search │ Crit  ██   │ │
│  │ 10:30:15   │ 172.16.5.20   │ POST │ /upload │ Med   ██   │ │
│  │ 10:29:48   │ 203.0.113.45  │ GET  │ /admin  │ High  ██   │ │
│  │            │               │      │         │            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
ATTACK EXECUTION
      │
      ▼
┌───────────────────────────────────────────────────────┐
│  Attack Detection Systems (Nmap, Nikto, Gobuster...)  │
└───────────────────────────────────────────────────────┘
      │
      │  Log Entry
      │
      ▼
┌───────────────────────────────────────────────────────┐
│         POST /logs/ingest (FastAPI Endpoint)          │
│                                                       │
│  log: {                                               │
│    "timestamp": "2025-12-09T10:30:00Z",              │
│    "source_ip": "192.168.1.100",                     │
│    "attack_type": "SQL Injection",                   │
│    "severity": "high",                               │
│    "payload": "SELECT * FROM users"                  │
│  }                                                    │
└───────────────────────────────────────────────────────┘
      │
      ▼
┌───────────────────────────────────────────────────────┐
│  process_log() - Rules Engine Processing              │
│                                                       │
│  Extracts:                                            │
│  • attack_type                                        │
│  • severity level                                     │
│  • source IP                                          │
│  • attack patterns                                    │
└───────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  Update Statistics & Broadcast                              │
│                                                             │
│  ┌─────────────────────────────┐                          │
│  │ Update ATTACK_STATS Dict    │                          │
│  │ SQL Injection: 45 → 46      │                          │
│  │ Severity: high              │                          │
│  │ lastSeen: 2025-12-09...     │                          │
│  └─────────────────────────────┘                          │
│           │                                               │
│           ├──────────────┬──────────────┬─────────────┐  │
│           ▼              ▼              ▼             ▼  │
│      ┌────────┐   ┌──────────┐   ┌──────────┐    ┌──┐  │
│      │ Redis  │   │ Broadcast│   │Broadcast │    │DB│  │
│      │ Cache  │   │Attack    │   │Attack    │    │  │  │
│      │        │   │Stats     │   │Details   │    └──┘  │
│      │OPTIONAL│   │WS        │   │WS        │          │
│      └────────┘   └──────────┘   └──────────┘          │
└─────────────────────────────────────────────────────────────┘
      │              │                 │
      │              │                 │
      ▼              ▼                 ▼
┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Frontend   │  │  Frontend WS     │  │  Frontend WS     │
│   /api/     │  │  /ws/attack-     │  │  /ws/attack-     │
│ attack-     │  │   stats          │  │   details        │
│  types      │  │                  │  │                  │
│  (REST)     │  │  Connected       │  │  Connected       │
└─────────────┘  │  Clients Listen  │  │  Clients Listen  │
      │          │  for Updates     │  │  for Updates     │
      ▼          └──────────────────┘  └──────────────────┘
┌────────────────────────────────────────────────────────┐
│         ANALYST DASHBOARD - React Components           │
│                                                        │
│  AttackTypeStats                 Details Page          │
│  • Bar Chart ◄────────Update─────► • Area Chart       │
│  • Pie Chart ◄────────Update─────► • Pie Chart        │
│  • Cards     ◄────────Update─────► • Stats Cards      │
│                                   │ • Table            │
└────────────────────────────────────────────────────────┘
      │
      │  User Interaction
      │  (Click on attack type)
      │
      ▼
┌────────────────────────────────────────────┐
│  Navigate to /analyst/attacks/details      │
│  ?type=SQL%20Injection                     │
│                                            │
│  Fetch: GET /attack-details?type=...       │
│  Connect: WS /ws/attack-details?type=...   │
│                                            │
│  Display detailed charts & table           │
│  with real-time incident updates           │
└────────────────────────────────────────────┘
```

## WebSocket Communication

```
FRONTEND (Browser)                    BACKEND (FastAPI)
      │                                      │
      │                                      │
      │        WS Connection Upgrade         │
      ├─────────────────────────────────────→│
      │                                      │
      │     ✓ Connection Established        │
      ├←─────────────────────────────────────┤
      │                                      │
      │     Listening for Messages...        │
      │                                      │
      │                                      │
      │                  New Attack Incident│
      │                                    │
      │         ┌─ /ws/attack-stats ──→ │
      │         │                       │
      │    ┌────┴────┐                 │
      │    │ Message │                 │
      │    │ Event:  │  Broadcast to  │
      │    │ attack_ │  All Connected │
      │    │ type_   │  Clients       │
      │    │ update  │                 │
      │    └────┬────┘                 │
      │         │                       │
      │    JSON: {                      │
      │      "event": "attack_type...  │
      │      "data": {                 │
      │        "type": "SQL Injection"│
      │        "count": 46            │
      │        "severity": "high"     │
      │        "lastSeen": "2025..."  │
      │      }                        │
      │    }                          │
      │                               │
      ├←────────────────────────────────┤
      │                                 │
      │    ┌─────────────────────────┐ │
      │    │ Parse Message           │ │
      │    │ Update React State      │ │
      │    │ Re-render Charts        │ │
      │    └─────────────────────────┘ │
      │                                 │
      ▼                                 ▼
   [UI Updated]                    [Waiting for next event]
   [Charts animate]                [Ready to broadcast]
   [Table appends]
```

## Component Dependencies

```
AnalystDashboard (Page)
├── Topbar
├── AttackCards
└── AttackTypeStats
    ├── BarChart (Recharts)
    ├── PieChart (Recharts)
    ├── AttackTypeCard (repeated)
    └── WebSocket (ws://...attack-stats)
        └── Message Handler (onmessage)

AttackDetailsPage (Page)
├── Back Link
├── Header & Stats Cards
├── AreaChart (Recharts) ◄── Real-time
├── PieChart (Recharts)
├── IncidentsTable
│   └── TableRow (repeated) ◄── Real-time
└── WebSocket (ws://...attack-details)
    └── Message Handler (onmessage)
```

## Real-time Update Flow

```
┌──────────────────────────────────────────────────────────────┐
│ New Attack Detected by Rules Engine                          │
└──────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ Update ATTACK_STATS in Memory                               │
│ SQL Injection: 45 → 46                                       │
└──────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ Call broadcast_attack_stats("SQL Injection")                 │
└──────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ Iterate through WS_ATTACK_STATS_CLIENTS list                │
│                                                              │
│ For each connected WebSocket client:                        │
│   ├─ Create JSON message                                    │
│   │  {                                                      │
│   │    "event": "attack_type_update",                       │
│   │    "data": {                                            │
│   │      "type": "SQL Injection",                           │
│   │      "count": 46,                                       │
│   │      "severity": "high",                                │
│   │      "lastSeen": "2025-12-09T10:30:46Z"                │
│   │    }                                                    │
│   │  }                                                      │
│   │                                                          │
│   ├─ Send to client via asyncio.create_task()              │
│   │  (Non-blocking, fire-and-forget)                       │
│   │                                                          │
│   └─ Handle exceptions silently                            │
└──────────────────────────────────────────────────────────────┘
                        │
         ┌──────────────┴──────────────┬─────────────────┐
         ▼                             ▼                 ▼
    [Client 1]                     [Client 2]       [Client N]
    Browser receives               Browser receives Browser receives
         │                              │                 │
         ▼                              ▼                 ▼
    ws.onmessage()               ws.onmessage()   ws.onmessage()
         │                              │                 │
         ├─ Parse JSON                ├─ Parse JSON    ├─ Parse JSON
         │                              │                 │
         ├─ Extract attack_type_update │                 │
         │                              │                 │
         ├─ Update setAttackStats()    │                 │
         │                              │                 │
         ▼                              ▼                 ▼
    State Updated              State Updated       State Updated
    React Re-render            React Re-render     React Re-render
    Chart animates             Chart animates      Chart animates
```

This architecture enables:
- ✅ Real-time data streaming to multiple clients
- ✅ Non-blocking broadcast operations
- ✅ Automatic UI updates without page refresh
- ✅ Scalable to hundreds of concurrent connections

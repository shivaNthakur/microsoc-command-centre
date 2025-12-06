src/
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  │   ├─ login/
│  │  │   │    └─ route.ts
│  │  │   ├─ register/
│  │  │   │    └─ route.ts
│  │  │   └─ me/
│  │  │        └─ route.ts         ← returns logged-in user details
│  │  │
│  │  ├─ users/
│  │  │   └─ route.ts              ← admin only: list users / delete users
│  │  │
│  │  ├─ logs/
│  │  │   ├─ ingest/
│  │  │   │    └─ route.ts         ← log ingestion for simulated attacks
│  │  │   └─ recent/
│  │  │        └─ route.ts         ← fetch recent logs for dashboard
│  │  │
│  │  ├─ incidents/
│  │  │    ├─ create/route.ts      ← create incident
│  │  │    ├─ update/route.ts      ← change status: open→progress→resolved
│  │  │    ├─ assign/route.ts      ← assign to analyst
│  │  │    └─ list/route.ts        ← filter by status, analyst, severity
│  │  │
│  │  ├─ dashboard/
│  │  │    ├─ attacks/
│  │  │    │    └─ route.ts        ← attack type distribution
│  │  │    ├─ severity/
│  │  │    │    └─ route.ts        ← severity stats
│  │  │    ├─ ips/
│  │  │    │    └─ route.ts        ← top attacker IPs
│  │  │    ├─ timeline/
│  │  │    │    └─ route.ts        ← logs over time (chart)
│  │  │    └─ incidents/
│  │  │         └─ route.ts        ← incident metrics
│  │  │
│  │  └─ socket/
│  │       └─ server.ts           ← WebSocket endpoint for edge runtime
│  │
│  └─ (other Next.js frontend pages)
│
├─ lib/
│  ├─ dbConnect.ts                 ← Mongoose connection (Next.js 16 safe)
│  ├─ redis.ts                     ← redis client connection
│  ├─ auth.ts                      ← verifyUser, verifyAdmin middlewares
│  ├─ jwt.ts                       ← generateToken, verifyToken utils
│  ├─ rules.ts                     ← threat rules engine (log → incident)
│  ├─ socket.ts                    ← socket.io initialization (server only)
│  └─ utils/
│       ├─ rateLimit.ts            ← optional: limit login attempts
│       └─ ipInfo.ts               ← optional: geo lookup for attacks
│
├─ models/
│  ├─ User.ts                      ← admin/analyst
│  ├─ Log.ts                       ← all log entries
│  ├─ Incident.ts                  ← SOC incidents
│  ├─ Ticket.ts                    ← optional: tasks for analysts
│  └─ Rule.ts                      ← optional: custom threat detection rules
│
├─ types/
│  ├─ log.ts                       ← AttackLog interface
│  ├─ incident.ts                  ← IncidentTypes
│  ├─ user.ts                      ← UserType
│  └─ api-response.ts              ← standard API response types
│
├─ socket/
│  └─ index.ts                     ← actual socket.io server
│
└─ utils/
   ├─ logger.ts                    ← winston logger (optional)
   └─ constants.ts                 ← app constants

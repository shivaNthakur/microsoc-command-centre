# MicroSOC Command Center - Complete File Structure

## Project Overview
- **Teammate 1**: Frontend (Next.js) - Admin pages, login, signup, landing pages ✅
- **Teammate 2**: Attack logs & incidents generator (JSON format) - Will provide data
- **Your Task**: Real-time admin dashboard with Socket.io + Redis + Geo-location

---

## Complete File Structure

```
microsoc-command-centre/
├── src/
│   ├── app/
│   │   ├── (auth)/                          # Auth routes (Teammate 1)
│   │   │   ├── login/
│   │   │   │   └── page.tsx                  # Login page
│   │   │   └── sign-up/
│   │   │       └── page.tsx                 # Analyst signup
│   │   │
│   │   ├── admin/                           # Admin routes (Teammate 1 + Your work)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx                 # ⭐ Admin Dashboard (Real-time) - TO CREATE
│   │   │   │   └── components/              # Dashboard components
│   │   │   │       ├── AttackMap.tsx        # ⭐ Geo-location map component
│   │   │   │       ├── AttackStats.tsx      # ⭐ Attack statistics cards
│   │   │   │       ├── IPTable.tsx          # ⭐ Top IPs with counts
│   │   │   │       ├── RealTimeLogs.tsx     # ⭐ Live log stream
│   │   │   │       ├── AttackCharts.tsx     # ⭐ Charts (bar, line, pie)
│   │   │   │       └── IncidentList.tsx     # ⭐ Active incidents list
│   │   │   │
│   │   │   ├── analysts/                     # Admin analyst management (Teammate 1)
│   │   │   │   ├── page.tsx                 # List all analysts
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx              # Analyst details
│   │   │   │
│   │   │   └── incidents/                    # Admin incident management
│   │   │       └── page.tsx                 # All incidents view
│   │   │
│   │   ├── analyst/                         # Analyst routes (Your work)
│   │   │   └── dashboard/
│   │   │       └── page.tsx                  # ✅ Analyst dashboard (already created)
│   │   │
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── analysts/                # Analyst management APIs
│   │   │   │   │   ├── approve/
│   │   │   │   │   │   └── route.ts         # ✅ Approve analyst
│   │   │   │   │   ├── pending/
│   │   │   │   │   │   └── route.ts         # ✅ Get pending analysts
│   │   │   │   │   └── reject/
│   │   │   │   │       └── route.ts         # ✅ Reject analyst
│   │   │   │   │
│   │   │   │   └── dashboard/               # ⭐ Admin dashboard APIs - TO CREATE
│   │   │   │       ├── realtime/
│   │   │   │       │   └── route.ts         # ⭐ Real-time data endpoint
│   │   │   │       ├── geo/
│   │   │   │       │   └── route.ts         # ⭐ Geo-location data
│   │   │   │       ├── ip-stats/
│   │   │   │       │   └── route.ts         # ⭐ IP-based statistics
│   │   │   │       └── summary/
│   │   │   │           └── route.ts         # ⭐ Dashboard summary stats
│   │   │   │
│   │   │   ├── auth/                        # Auth APIs (Teammate 1)
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   ├── options.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   └── sign-up/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── dashboard/                   # Dashboard APIs (Your work)
│   │   │   │   ├── attacks/
│   │   │   │   │   └── route.ts            # ✅ Attack trends
│   │   │   │   ├── ips/
│   │   │   │   │   └── route.ts            # ✅ Top IPs
│   │   │   │   ├── dns/
│   │   │   │   │   └── route.ts            # ✅ DNS queries
│   │   │   │   ├── injections/
│   │   │   │   │   └── route.ts            # ✅ Injection data
│   │   │   │   └── exfiltration/
│   │   │   │       └── route.ts            # ✅ Exfiltration data
│   │   │   │
│   │   │   ├── incidents/                  # Incident APIs
│   │   │   │   ├── assign/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── create/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── list/
│   │   │   │   │   └── route.ts
│   │   │   │   └── update/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   └── logs/                       # Log ingestion (Your work)
│   │   │       └── ingest/
│   │   │           └── route.ts            # ✅ Accept JSON logs from Teammate 2
│   │   │
│   │   ├── socket/                         # ⭐ Socket.io API route - TO CREATE
│   │   │   └── route.ts                    # ⭐ Socket.io handler for Next.js
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                        # Landing page (Teammate 1)
│   │
│   │
│   ├── lib/
│   │   ├── dbConnect.ts                    # ✅ MongoDB connection
│   │   ├── redis.ts                        # ✅ Redis client (needs enhancement)
│   │   ├── socket.ts                       # ⭐ Socket.io server setup - TO ENHANCE
│   │   ├── auth.ts                         # ✅ Auth utilities
│   │   └── utils/
│   │       ├── ipInfo.ts                   # ⭐ Geo-location utility - TO CREATE
│   │       └── rateLimit.ts                # ✅ Rate limiting
│   │
│   ├── models/
│   │   ├── User.ts                         # ✅ User model
│   │   ├── Log.ts                          # ✅ Log model (updated)
│   │   ├── Incident.ts                     # ✅ Incident model
│   │   ├── Rule.ts                         # ✅ Rule model
│   │   └── Ticket.ts                       # ✅ Ticket model
│   │
│   ├── services/                           # ⭐ Business logic layer - TO CREATE
│   │   ├── logProcessor.ts                 # ⭐ Process incoming logs
│   │   ├── geoService.ts                   # ⭐ Geo-location service
│   │   ├── ipAggregator.ts                 # ⭐ IP-based aggregation
│   │   ├── incidentCreator.ts              # ⭐ Auto-create incidents from logs
│   │   └── realtimePublisher.ts            # ⭐ Redis pub/sub publisher
│   │
│   ├── socket/                             # ⭐ Socket.io handlers - TO CREATE
│   │   ├── index.ts                        # ✅ Basic setup (needs enhancement)
│   │   ├── handlers/
│   │   │   ├── attackLogs.ts               # ⭐ Handle attack log events
│   │   │   ├── incidents.ts                # ⭐ Handle incident events
│   │   │   └── adminDashboard.ts            # ⭐ Admin dashboard events
│   │   └── middleware/
│   │       └── auth.ts                     # ⭐ Socket.io auth middleware
│   │
│   ├── types/
│   │   ├── api-response.ts                 # ✅ API response types
│   │   ├── incident.ts                     # ✅ Incident types
│   │   ├── log.ts                          # ✅ Log types
│   │   ├── user.ts                         # ✅ User types
│   │   └── dashboard.ts                    # ⭐ Dashboard types - TO CREATE
│   │
│   ├── utils/
│   │   ├── constants.ts                    # ✅ Constants
│   │   └── logger.ts                      # ✅ Logger utility
│   │
│   └── middleware.ts                       # ✅ Route protection
│
├── public/
│   └── (static assets)
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Key Files to Create/Enhance

### 🔴 HIGH PRIORITY - Real-time Admin Dashboard

#### 1. **Admin Dashboard Page**
```
src/app/admin/dashboard/page.tsx
```
- Main admin dashboard with real-time updates
- Uses Socket.io client for live data
- Displays: Attack map, IP stats, live logs, charts

#### 2. **Socket.io Server Setup**
```
src/lib/socket.ts (enhance existing)
src/app/api/socket/route.ts (new)
```
- Initialize Socket.io server
- Handle Redis pub/sub subscriptions
- Broadcast to connected admin clients

#### 3. **Log Ingestion with Real-time Publishing**
```
src/app/api/logs/ingest/route.ts (enhance existing)
src/services/realtimePublisher.ts (new)
```
- Accept JSON from Teammate 2
- Store in MongoDB
- Publish to Redis channel
- Trigger Socket.io broadcast

#### 4. **Geo-location Service**
```
src/utils/ipInfo.ts (new)
src/services/geoService.ts (new)
src/app/api/admin/dashboard/geo/route.ts (new)
```
- Get IP geo-location (use free API like ipapi.co or ip-api.com)
- Cache in Redis
- Return lat/lng for map visualization

#### 5. **IP Aggregation Service**
```
src/services/ipAggregator.ts (new)
src/app/api/admin/dashboard/ip-stats/route.ts (new)
```
- Count attacks per IP
- Track attack types per IP
- Calculate risk scores

#### 6. **Dashboard Components**
```
src/app/admin/dashboard/components/
├── AttackMap.tsx          # World map with attack markers
├── AttackStats.tsx       # Summary cards (total attacks, blocked, etc.)
├── IPTable.tsx            # Top IPs with counts and geo info
├── RealTimeLogs.tsx       # Live scrolling log feed
├── AttackCharts.tsx       # Bar/line/pie charts
└── IncidentList.tsx       # Active incidents table
```

---

## Data Flow Architecture

```
Teammate 2 (JSON logs)
    ↓
POST /api/logs/ingest
    ↓
1. Store in MongoDB (Log model)
2. Get Geo-location (cache in Redis)
3. Aggregate IP stats (update Redis)
4. Publish to Redis channel: "soc:attack_logs"
    ↓
Socket.io Server (subscribes to Redis)
    ↓
Broadcast to connected admin clients
    ↓
Admin Dashboard (Socket.io client)
    ↓
Update UI in real-time
```

---

## Redis Data Structure

```javascript
// Attack log channel
REDIS_CHANNELS.ATTACK_LOGS = "soc:attack_logs"

// Cache keys
"ip:geo:{ip}"              // Geo-location cache (24h TTL)
"ip:stats:{ip}"            // IP statistics (1h TTL)
"dashboard:summary"         // Dashboard summary (5min TTL)
"ip:count:{ip}"            // Attack count per IP (1h TTL)
```

---

## Socket.io Events

### Client → Server
- `admin:join` - Admin joins dashboard room
- `admin:leave` - Admin leaves dashboard room

### Server → Client
- `attack:new` - New attack log received
- `attack:batch` - Batch of new attacks
- `incident:created` - New incident created
- `incident:updated` - Incident status updated
- `stats:update` - Dashboard statistics updated
- `ip:update` - IP statistics updated

---

## Implementation Order

### Phase 1: Core Infrastructure
1. ✅ Log model (already done)
2. ✅ Log ingestion API (already done)
3. ⭐ Enhance Redis utilities
4. ⭐ Setup Socket.io server
5. ⭐ Create geo-location service

### Phase 2: Real-time Pipeline
1. ⭐ Enhance log ingestion to publish to Redis
2. ⭐ Socket.io Redis subscriber
3. ⭐ IP aggregation service
4. ⭐ Dashboard summary service

### Phase 3: Admin Dashboard
1. ⭐ Admin dashboard page
2. ⭐ Dashboard components
3. ⭐ Socket.io client integration
4. ⭐ Real-time updates

### Phase 4: Geo-location & Maps
1. ⭐ Geo-location API integration
2. ⭐ Map component (use react-simple-maps or leaflet)
3. ⭐ IP markers on map

---

## Environment Variables Needed

```env
# Existing
MONGODB_URI=...
REDIS_URL=redis://localhost:6379
JWT_SECRET=...

# New
GEO_API_KEY=...              # Optional (for paid geo APIs)
GEO_API_URL=https://ipapi.co  # Free geo API
SOCKET_PORT=3001              # Optional (if separate socket server)
```

---

## Dependencies to Install

```bash
npm install socket.io-client          # Client-side Socket.io
npm install react-simple-maps         # For world map
npm install @react-leaflet/core       # Alternative map library
npm install @react-leaflet/leaflet    # Leaflet maps
leaflet                                # Map tiles
```

---

## Next Steps

1. **Start with Socket.io setup** - Create server and client connection
2. **Enhance log ingestion** - Add Redis publishing
3. **Create geo-location service** - IP to location mapping
4. **Build admin dashboard** - Main page with components
5. **Add real-time updates** - Connect Socket.io to dashboard

---

## Notes

- ✅ = Already implemented
- ⭐ = Needs to be created/enhanced
- Admin dashboard should be accessible at `/admin/dashboard`
- Real-time updates should work without page refresh
- Geo-location should be cached to avoid API rate limits
- IP statistics should update in real-time as new logs arrive


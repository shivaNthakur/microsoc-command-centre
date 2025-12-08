# Implementation Guide - Real-time Admin Dashboard

## Quick Start Checklist

### ✅ Already Completed
- [x] Log model with all attack types
- [x] Log ingestion API endpoint
- [x] Analyst dashboard
- [x] Redis client setup
- [x] Basic Socket.io setup
- [x] Dashboard API endpoints (attacks, IPs, DNS, etc.)

### ⭐ To Be Implemented

#### 1. Socket.io Server Enhancement
**File**: `src/lib/socket.ts` (enhance) + `src/app/api/socket/route.ts` (new)

**Purpose**: 
- Initialize Socket.io server properly in Next.js
- Subscribe to Redis channels
- Broadcast events to admin clients

**Key Code Structure**:
```typescript
// src/lib/socket.ts
export function initializeSocketIO(server: any) {
  const io = getIO(server);
  
  // Subscribe to Redis channels
  const subscriber = getRedisSubscriber();
  subscriber.subscribe(REDIS_CHANNELS.ATTACK_LOGS);
  
  subscriber.on('message', (channel, message) => {
    const data = JSON.parse(message);
    io.to('admin-dashboard').emit('attack:new', data);
  });
  
  // Handle admin connections
  io.on('connection', (socket) => {
    socket.on('admin:join', () => {
      socket.join('admin-dashboard');
    });
  });
}
```

---

#### 2. Geo-location Service
**Files**: 
- `src/utils/ipInfo.ts` (new)
- `src/services/geoService.ts` (new)

**Purpose**: Get latitude/longitude for IP addresses

**Implementation**:
```typescript
// Use free API: ipapi.co or ip-api.com
// Cache results in Redis for 24 hours
// Return: { ip, country, city, lat, lng, isp }
```

**API Options**:
- **Free**: ipapi.co (1000 requests/day free)
- **Free**: ip-api.com (45 requests/minute free)
- **Paid**: MaxMind GeoIP2 (more accurate)

---

#### 3. Enhanced Log Ingestion
**File**: `src/app/api/logs/ingest/route.ts` (enhance existing)

**Add**:
1. Get geo-location for IP
2. Aggregate IP statistics
3. Publish to Redis channel
4. Trigger Socket.io broadcast

**Flow**:
```
Receive JSON → Validate → Store in DB → 
Get Geo → Cache → Aggregate IP → 
Publish to Redis → Socket.io broadcast
```

---

#### 4. IP Aggregation Service
**File**: `src/services/ipAggregator.ts` (new)

**Purpose**: 
- Count attacks per IP
- Track attack types per IP
- Calculate risk scores
- Store in Redis for fast access

**Redis Structure**:
```
ip:stats:127.0.0.1 = {
  count: 15,
  attackTypes: ['brute_force', 'sqli'],
  firstSeen: timestamp,
  lastSeen: timestamp,
  severity: 'HIGH',
  blocked: true
}
```

---

#### 5. Admin Dashboard Page
**File**: `src/app/admin/dashboard/page.tsx` (new)

**Features**:
- Real-time attack map (world map with markers)
- Top IPs table with counts
- Live log stream
- Attack statistics cards
- Charts (bar, line, pie)
- Active incidents list

**Socket.io Client Integration**:
```typescript
useEffect(() => {
  const socket = io();
  
  socket.emit('admin:join');
  
  socket.on('attack:new', (data) => {
    // Update state
    setAttacks(prev => [data, ...prev]);
    updateIPStats(data.ip);
    updateMap(data.geo);
  });
  
  return () => socket.disconnect();
}, []);
```

---

#### 6. Dashboard Components

**a. AttackMap.tsx** - World map with attack markers
- Use `react-simple-maps` or `react-leaflet`
- Show IP locations
- Color-code by severity
- Click to see details

**b. IPTable.tsx** - Top attacking IPs
- Columns: IP, Count, Country, Attack Types, Status
- Sortable
- Real-time updates

**c. RealTimeLogs.tsx** - Live log feed
- Auto-scrolling
- Filter by attack type
- Search functionality

**d. AttackStats.tsx** - Summary cards
- Total attacks (24h)
- Blocked attacks
- Active incidents
- Critical alerts

**e. AttackCharts.tsx** - Visualizations
- Attacks over time (line chart)
- Attack type distribution (pie chart)
- Severity distribution (bar chart)

**f. IncidentList.tsx** - Active incidents
- Table of open incidents
- Status badges
- Assign to analyst button

---

## Data Flow Diagram

```
┌─────────────────┐
│  Teammate 2     │
│  (JSON Logs)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ /api/logs/ingest│
│  (POST)         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ MongoDB│ │ Geo API  │
│ (Store)│ │ (Get Lat │
│        │ │  / Lng)  │
└────────┘ └────┬─────┘
                │
                ▼
         ┌──────────────┐
         │ Redis Cache  │
         │ (Geo Data)   │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ IP Aggregator │
         │ (Count Stats) │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Redis Publish │
         │ (Channel:     │
         │ attack_logs)  │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Socket.io    │
         │ Server       │
         │ (Subscribes) │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Admin        │
         │ Dashboard    │
         │ (Socket.io   │
         │  Client)     │
         └──────────────┘
```

---

## API Endpoints Summary

### Existing (✅)
- `POST /api/logs/ingest` - Accept logs from Teammate 2
- `GET /api/dashboard/attacks` - Attack trends
- `GET /api/dashboard/ips` - Top IPs
- `GET /api/dashboard/dns` - DNS queries
- `GET /api/dashboard/injections` - Injection data
- `GET /api/dashboard/exfiltration` - Exfiltration data

### New (⭐)
- `GET /api/admin/dashboard/summary` - Dashboard summary stats
- `GET /api/admin/dashboard/geo?ip=...` - Get geo-location for IP
- `GET /api/admin/dashboard/ip-stats` - Detailed IP statistics
- `GET /api/admin/dashboard/realtime` - Real-time data stream (SSE or WebSocket)

---

## Socket.io Event Schema

### Client → Server
```typescript
// Join admin dashboard room
socket.emit('admin:join', { userId: '...' });

// Leave admin dashboard room
socket.emit('admin:leave');
```

### Server → Client
```typescript
// New attack log
{
  event: 'attack:new',
  data: {
    id: '...',
    ip: '127.0.0.1',
    attackType: 'brute_force',
    severity: 'HIGH',
    timestamp: 1234567890,
    geo: {
      country: 'US',
      city: 'New York',
      lat: 40.7128,
      lng: -74.0060
    },
    path: '/login',
    method: 'POST',
    status: 'BLOCK'
  }
}

// Batch of attacks (for initial load)
{
  event: 'attack:batch',
  data: [...attacks]
}

// IP statistics update
{
  event: 'ip:update',
  data: {
    ip: '127.0.0.1',
    count: 15,
    attackTypes: ['brute_force', 'sqli'],
    severity: 'HIGH'
  }
}

// Dashboard summary update
{
  event: 'stats:update',
  data: {
    totalAttacks: 150,
    blockedAttacks: 120,
    activeIncidents: 5,
    criticalAlerts: 2
  }
}
```

---

## Redis Channel Structure

```typescript
// Channels
REDIS_CHANNELS = {
  ATTACK_LOGS: "soc:attack_logs",        // New attack logs
  INCIDENTS: "soc:incidents",            // Incident updates
  IP_STATS: "soc:ip_stats",              // IP statistics
  DASHBOARD_SUMMARY: "soc:dashboard_summary" // Summary stats
}

// Cache Keys
`ip:geo:${ip}`              // Geo-location (TTL: 24h)
`ip:stats:${ip}`            // IP statistics (TTL: 1h)
`dashboard:summary`         // Dashboard summary (TTL: 5min)
`ip:count:${ip}`            // Attack count (TTL: 1h)
```

---

## Implementation Priority

### Week 1: Core Infrastructure
1. ✅ Log ingestion (done)
2. ⭐ Enhance with Redis publishing
3. ⭐ Setup Socket.io server
4. ⭐ Create geo-location service

### Week 2: Real-time Pipeline
1. ⭐ IP aggregation service
2. ⭐ Redis pub/sub integration
3. ⭐ Socket.io event handlers
4. ⭐ Dashboard summary service

### Week 3: Admin Dashboard UI
1. ⭐ Admin dashboard page
2. ⭐ Dashboard components
3. ⭐ Socket.io client integration
4. ⭐ Real-time updates

### Week 4: Polish & Testing
1. ⭐ Map visualization
2. ⭐ Performance optimization
3. ⭐ Error handling
4. ⭐ Testing with real data

---

## Testing Strategy

### 1. Test Log Ingestion
```bash
# Send test log
curl -X POST http://localhost:3000/api/logs/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "ip": "8.8.8.8",
    "path": "/login",
    "method": "POST",
    "status": "BLOCK",
    "attack_type": "brute_force",
    "severity": "HIGH",
    "timestamp": 1234567890,
    "reason": "Multiple failed attempts",
    "suggestion": "Enable CAPTCHA",
    "is_blocked_now": true
  }'
```

### 2. Test Socket.io Connection
```javascript
// In browser console
const socket = io('http://localhost:3000');
socket.emit('admin:join');
socket.on('attack:new', console.log);
```

### 3. Test Geo-location
```bash
curl http://localhost:3000/api/admin/dashboard/geo?ip=8.8.8.8
```

---

## Dependencies to Install

```bash
# Socket.io
npm install socket.io-client

# Maps (choose one)
npm install react-simple-maps d3-geo topojson-client
# OR
npm install react-leaflet leaflet @types/leaflet

# Utilities
npm install axios  # For geo API calls
```

---

## Environment Variables

Add to `.env.local`:
```env
# Geo-location API (optional - use free APIs first)
GEO_API_KEY=your_key_here
GEO_API_URL=https://ipapi.co

# Redis (already exists)
REDIS_URL=redis://localhost:6379

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## Next Immediate Steps

1. **Create Socket.io server setup** (`src/lib/socket.ts`)
2. **Enhance log ingestion** to publish to Redis
3. **Create geo-location utility** (`src/utils/ipInfo.ts`)
4. **Create admin dashboard page** (`src/app/admin/dashboard/page.tsx`)
5. **Add Socket.io client** to dashboard
6. **Test with sample data** from Teammate 2

---

## Questions to Clarify with Teammates

1. **Teammate 1**: 
   - Where is the admin dashboard currently? (if exists)
   - What UI library/components are being used?
   - Any specific design requirements?

2. **Teammate 2**:
   - What's the exact JSON format? (we have one example)
   - How frequently will logs be sent?
   - Batch or individual logs?
   - Will incidents be sent separately?

---

## Success Criteria

✅ Admin can see real-time attack logs  
✅ IP addresses show on world map  
✅ Top IPs table updates automatically  
✅ Attack counts per IP are accurate  
✅ Geo-location is cached and fast  
✅ Dashboard loads quickly  
✅ No page refresh needed for updates  
✅ Handles high volume of logs  

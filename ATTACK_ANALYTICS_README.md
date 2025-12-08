# Attack Analytics Dashboard - Real-time Implementation Guide

## Features Implemented

### 1. **Attack Type Statistics Dashboard** (`AttackTypeStats.tsx`)
- **Bar Chart**: Displays attack counts by type with interactive tooltips
- **Pie Chart**: Shows severity distribution across attack types
- **Clickable Cards**: Select any attack type to view detailed analysis
- **Real-time Updates**: WebSocket connection streams live attack statistics

### 2. **Detailed Attack Analysis Page** (`/analyst/attacks/details`)
- **Time Series Chart**: Visualizes attack frequency over hours
- **Severity Breakdown**: Pie chart showing critical/high/medium/low distribution
- **Statistics Cards**: Total, Critical, High, Medium, Low counts
- **Incident Table**: Real-time table showing:
  - Timestamp
  - Source IP
  - HTTP Method
  - Target endpoint
  - Severity level
  - Attack payload (truncated)

### 3. **Real-time Data Streaming**
- **WebSocket Endpoints**:
  - `/ws/incidents`: General incident stream
  - `/ws/attack-stats`: Attack type statistics updates
  - `/ws/attack-details?type={attackType}`: Specific attack type details

### 4. **Redis Integration** (Optional)
- Persistent caching of attack statistics
- Incident history storage (last 100 per type)
- Automatic 24-hour cache expiry
- Graceful fallback to in-memory storage if Redis unavailable

## API Endpoints

### GET `/attack-types`
Returns all attack type statistics:
```json
[
  {
    "type": "SQL Injection",
    "count": 45,
    "severity": "high",
    "lastSeen": "2025-12-09T10:30:00Z"
  }
]
```

### GET `/attack-details?type={attackType}`
Returns detailed incidents for a specific attack type:
```json
{
  "incidents": [
    {
      "timestamp": "2025-12-09T10:30:00Z",
      "ip": "192.168.1.100",
      "severity": "high",
      "method": "POST",
      "target": "/api/login",
      "payload": "SELECT * FROM users"
    }
  ],
  "stats": {
    "total": 45,
    "critical": 5,
    "high": 20,
    "medium": 15,
    "low": 5
  }
}
```

## Frontend Components

### `AttackTypeStats.tsx`
Located at: `src/components/dashboard_analyst/AttackTypeStats.tsx`

**Props:**
- `onSelectAttack`: Callback function when user clicks an attack type
  - Type: `(attackType: string) => void`

**Usage:**
```tsx
<AttackTypeStats onSelectAttack={(type) => {
  router.push(`/analyst/attacks/details?type=${type}`)
}} />
```

### Attack Details Page
Located at: `src/app/analyst/attacks/details/page.tsx`

Automatically reads `type` query parameter and displays:
- Real-time graphs using Recharts
- Live incident table
- Connected via WebSocket for real-time updates

## Backend Setup

### Installation

1. **FastAPI** - Already installed
2. **Redis** (Optional for production):
```bash
pip install redis
```

### Running the Server

```bash
cd MICROSOC-COMMAND-CENTRE
uvicorn main:app --reload
```

The backend will:
- Start on `http://127.0.0.1:8000`
- Attempt Redis connection (gracefully skips if unavailable)
- Listen for log ingestion at `/logs/ingest`
- Stream updates via WebSocket connections

### Database Models

Attack data is ingested via:
```bash
POST /logs/ingest
Content-Type: application/json

{
  "timestamp": "2025-12-09T10:30:00Z",
  "source_ip": "192.168.1.100",
  "attack_type": "SQL Injection",
  "severity": "high",
  "payload": "SELECT * FROM users",
  ...
}
```

## Real-time Data Flow

```
Attack Scripts
    ↓
POST /logs/ingest
    ↓
process_log() [Rules Engine]
    ↓
Incident Created
    ↓
├→ Redis Cache (if available)
├→ Broadcast to /ws/attack-stats clients
└→ Broadcast to /ws/attack-details clients
    ↓
Frontend WebSocket Listeners
    ↓
Update UI with real-time data
    ↓
Re-render Charts & Tables
```

## Frontend Data Flow

```
Analyst Dashboard
    ↓
AttackTypeStats Component
├→ Fetches: GET /attack-types
├→ Connects: WS /ws/attack-stats
└→ Renders: Bar chart + Pie chart + Clickable cards
    ↓
User clicks attack type
    ↓
Navigate to /analyst/attacks/details?type=SQL%20Injection
    ↓
Attack Details Page
├→ Fetches: GET /attack-details?type=SQL Injection
├→ Connects: WS /ws/attack-details?type=SQL Injection
└→ Renders: Time series + Stats + Incident table
    ↓
WebSocket messages arrive in real-time
    ↓
Update chart data + Add new rows to table
```

## Testing

### 1. Manual Testing

**Test Attack Stats:**
```bash
curl http://127.0.0.1:8000/attack-types
```

**Test Attack Details:**
```bash
curl "http://127.0.0.1:8000/attack-details?type=SQL%20Injection"
```

**Test Broadcast:**
```bash
curl http://127.0.0.1:8000/test-broadcast
```

### 2. WebSocket Testing

Using a tool like `wscat`:
```bash
wscat -c ws://127.0.0.1:8000/ws/attack-stats
```

## Severity Levels

| Level | Color | Code |
|-------|-------|------|
| Critical | Red (#ff1744) | `critical` |
| High | Orange (#ff9100) | `high` |
| Medium | Yellow (#ffd600) | `medium` |
| Low | Green (#00e676) | `low` |
| Info | Blue (#00b0ff) | `info` |

## Performance Considerations

### In-Memory Mode (Default)
- **Memory**: Grows linearly with incidents
- **Speed**: Fast (no network latency)
- **Persistence**: Lost on server restart
- **Best for**: Development/testing

### Redis Mode (Production)
- **Memory**: Configurable LRU eviction
- **Speed**: ~1ms latency per operation
- **Persistence**: Survives server restarts
- **Best for**: Production deployments

## Future Enhancements

1. **Database Integration**
   - Replace in-memory storage with PostgreSQL
   - Implement full incident history

2. **Advanced Filtering**
   - Filter by date range
   - Filter by severity level
   - Filter by source IP

3. **Machine Learning**
   - Anomaly detection
   - Attack pattern recognition
   - Predictive threat alerts

4. **Export Capabilities**
   - CSV/JSON export of incidents
   - PDF report generation

5. **Dashboard Customization**
   - Custom chart configurations
   - Widget dragging/resizing
   - Saved views per user

## Troubleshooting

### WebSocket Connection Fails
- Check backend is running on `127.0.0.1:8000`
- Verify CORS middleware is enabled
- Check browser console for error messages

### No Data Appears
- Verify attacks are being sent to `/logs/ingest`
- Check `/attack-types` endpoint returns data
- Inspect browser DevTools → Network tab

### Redis Connection Issues
- Check Redis server is running
- Verify connection parameters in `redis_cache.py`
- Check for permission/firewall issues
- Backend will auto-fallback to in-memory if Redis unavailable

## File Structure

```
src/
├── app/
│   └── analyst/
│       ├── dashboard/
│       │   └── page.tsx (Main dashboard with AttackTypeStats)
│       └── attacks/
│           └── details/
│               └── page.tsx (Detailed attack analysis)
└── components/
    └── dashboard_analyst/
        └── AttackTypeStats.tsx (Statistics component)

MICROSOC-COMMAND-CENTRE/
├── main.py (FastAPI server with all endpoints)
└── backend/
    └── cache/
        ├── __init__.py
        └── redis_cache.py (Optional Redis integration)
```

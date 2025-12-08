# Project Tree Structure

## Current Directory Layout

```
microsoc-command-centre/
├── 📋 Root Configuration Files
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── eslint.config.mjs
│   ├── postcss.config.mjs
│   ├── components.json
│   └── next-env.d.ts
│
├── 📚 Documentation Files
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── CHANGES.md
│   ├── COMPLETION_REPORT.md
│   ├── DASHBOARD_INTEGRATION.md
│   ├── DASHBOARD_QUICKSTART.md
│   ├── DEPLOYMENT.md
│   ├── DOCUMENTATION_INDEX.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── QUICK_FIX_GUIDE.md
│   ├── README_DASHBOARD.md
│   ├── VERIFICATION_CHECKLIST.md
│   └── VISUAL_GUIDE.md
│
├── 🚀 public/ (Static Assets)
│   └── icons/
│
├── 📝 scripts/ (Utility Scripts)
│   ├── createAnalyst.js
│   ├── createAnalyst.ts
│   ├── seedAdmin.ts
│   └── script_test
│
└── 💻 src/ (Source Code)
    │
    ├── 🔐 app/ (Next.js App Router)
    │   ├── 🔑 (auth)/ (Authentication Routes)
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── signup/
    │   │       └── page.tsx
    │   │
    │   ├── 👮 admin/ (Admin Features)
    │   │   ├── dashboard/
    │   │   │   ├── page.tsx
    │   │   │   └── location/
    │   │   │       └── page.tsx
    │   │   ├── notifications/
    │   │   │   └── page.tsx
    │   │   └── pending-analysts/
    │   │       └── page.tsx
    │   │
    │   ├── 👤 analyst/ (Analyst Features)
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   └── incidents/
    │   │
    │   ├── 🔌 api/ (API Routes)
    │   │   ├── admin/
    │   │   │   ├── analysts/
    │   │   │   │   ├── [id]/
    │   │   │   │   │   └── route.ts
    │   │   │   │   ├── route.ts
    │   │   │   │   ├── approve/
    │   │   │   │   │   └── route.ts
    │   │   │   │   ├── pending/
    │   │   │   │   │   └── route.ts
    │   │   │   │   └── reject/
    │   │   │   │       └── route.ts
    │   │   │   └── dashboard/
    │   │   │       ├── geo/
    │   │   │       │   └── route.ts
    │   │   │       ├── ip-stats/
    │   │   │       │   └── route.ts
    │   │   │       └── summary/
    │   │   │           └── route.ts
    │   │   │
    │   │   ├── auth/
    │   │   │   ├── [...nextauth]/
    │   │   │   ├── login/
    │   │   │   │   └── route.ts
    │   │   │   ├── sign-up/
    │   │   │   │   └── route.ts
    │   │   │   └── signup/
    │   │   │       └── route.ts
    │   │   │
    │   │   ├── dashboard/
    │   │   │   ├── attacks/
    │   │   │   │   └── route.ts
    │   │   │   ├── dns/
    │   │   │   │   └── route.ts
    │   │   │   ├── exfiltration/
    │   │   │   │   └── route.ts
    │   │   │   ├── injections/
    │   │   │   │   └── route.ts
    │   │   │   └── ips/
    │   │   │       └── route.ts
    │   │   │
    │   │   ├── incidents/
    │   │   │   ├── assign/
    │   │   │   │   └── route.ts
    │   │   │   ├── create/
    │   │   │   │   └── route.ts
    │   │   │   ├── list/
    │   │   │   │   └── route.ts
    │   │   │   └── update/
    │   │   │       └── route.ts
    │   │   │
    │   │   ├── logs/
    │   │   │   └── ingest/
    │   │   │       └── route.ts
    │   │   │
    │   │   ├── socket/
    │   │   │   └── route.ts
    │   │   │
    │   │   └── users/
    │   │       └── route.ts
    │   │
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── 🧩 components/ (React Components)
    │   ├── 🏠 Landing Page Components
    │   │   ├── AboutSection.tsx
    │   │   ├── FeaturesSection.tsx
    │   │   ├── FooterSection.tsx
    │   │   ├── HeroSection.tsx
    │   │   └── NavBar.tsx
    │   │
    │   ├── 👮 Admin Dashboard Components
    │   │   ├── AdminDashboard.tsx (OPTIMIZED - Main dashboard)
    │   │   ├── Globe.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── Topbar.tsx
    │   │
    │   └── 🎨 UI Components
    │       ├── 3d-card.tsx
    │       ├── aurora-background.tsx
    │       ├── hover-border-gradient.tsx
    │       ├── sticky-scroll-reveal.tsx
    │       └── wavy-background.tsx
    │
    ├── 🔗 context/ (React Context)
    │   └── AuthProvider.tsx
    │
    ├── 📦 lib/ (Library Utilities)
    │   ├── auth.ts (Authentication)
    │   ├── dbConnect.ts (Database Connection)
    │   ├── redis.ts (Redis Cache)
    │   ├── socket.ts (WebSocket)
    │   └── utils.ts (General Utilities)
    │
    ├── 🗄️ models/ (Mongoose Models)
    │   ├── AttackLog.ts
    │   ├── Incident.ts
    │   └── User.ts
    │
    ├── 📐 schema/ (Validation Schemas)
    │   ├── auth.schema.ts
    │   └── userschema.ts
    │
    ├── ⚙️ services/ (Business Logic Services)
    │   ├── ipAggregator.ts
    │   └── realtimePublisher.ts
    │
    ├── 🔌 socket/ (WebSocket Logic)
    │   └── index.ts
    │
    ├── 🎯 types/ (TypeScript Types)
    │   ├── api-response.ts
    │   ├── incident.ts
    │   ├── log.ts
    │   └── user.ts
    │
    ├── 🛠️ utils/ (Utility Functions)
    │   ├── constants.ts
    │   ├── ipInfo.ts
    │   └── logger.ts
    │
    └── 🚦 middleware.ts (Next.js Middleware)
```

## Layer Structure

```
📍 Entry Point
  ↓
src/app/layout.tsx (Root Layout)
  ↓
src/app/page.tsx (Landing Page)
  ├── src/components/NavBar.tsx
  ├── src/components/HeroSection.tsx
  ├── src/components/FeaturesSection.tsx
  ├── src/components/AboutSection.tsx
  └── src/components/FooterSection.tsx

🔐 Authentication Flow
  src/app/(auth)/login/page.tsx
  src/app/(auth)/signup/page.tsx
    ↓
  src/app/api/auth/*/route.ts
    ↓
  src/lib/auth.ts
    ↓
  src/models/User.ts

👮 Admin Dashboard
  src/app/admin/dashboard/page.tsx
    ↓
  src/components/dashboard_admin/AdminDashboard.tsx (OPTIMIZED)
  src/components/dashboard_admin/Sidebar.tsx
  src/components/dashboard_admin/Topbar.tsx
    ↓
  src/app/api/admin/analysts/route.ts
  src/app/api/admin/analysts/approve/route.ts
  src/app/api/admin/analysts/reject/route.ts
    ↓
  src/models/User.ts

👤 Analyst Dashboard
  src/app/analyst/dashboard/page.tsx
    ↓
  src/app/api/dashboard/*/route.ts
  src/app/api/incidents/*/route.ts
    ↓
  src/models/Incident.ts
  src/models/AttackLog.ts

🔌 Real-time Updates
  src/socket/index.ts
  src/services/realtimePublisher.ts
    ↓
  src/lib/redis.ts
  src/lib/socket.ts
```

## File Statistics

| Category | Count | Files |
|----------|-------|-------|
| Pages | 7 | layout, page, login, signup, admin dashboards, etc |
| API Routes | 24+ | Auth, Admin, Dashboard, Incidents, Logs |
| Components | 13 | Admin, UI, Landing, etc |
| Models | 3 | User, Incident, AttackLog |
| Services | 2 | ipAggregator, realtimePublisher |
| Utilities | 15+ | Auth, DB, Redis, Socket, etc |
| Documentation | 13 | MD files |
| **TOTAL** | **~100+** | All source files |

## Technology Stack by Layer

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB + Mongoose
- **Cache**: Redis
- **Real-time**: WebSocket
- **Authentication**: NextAuth.js

### DevTools
- **Linting**: ESLint
- **Build**: Next.js
- **Package Manager**: npm
- **Port**: 3000 (default)

## Key Components

### 🌟 Recently Optimized
- **AdminDashboard.tsx** - Removed heavy animations, parallelized API calls, memoized components, reduced animations

### 🔑 Core Services
- **lib/auth.ts** - Authentication logic
- **lib/dbConnect.ts** - MongoDB connection
- **lib/redis.ts** - Caching layer
- **lib/socket.ts** - WebSocket management

### 📊 Data Models
- **User.ts** - User schema with roles (admin, analyst)
- **Incident.ts** - Security incident tracking
- **AttackLog.ts** - Attack logs and metrics

### 🎯 API Endpoints by Feature

#### Admin Endpoints
- `GET/POST /api/admin/analysts` - List all analysts
- `GET /api/admin/analysts/pending` - Pending requests
- `POST /api/admin/analysts/approve` - Approve analyst
- `POST /api/admin/analysts/reject` - Reject analyst
- `DELETE /api/admin/analysts/[id]` - Remove analyst
- `GET /api/admin/dashboard/*` - Dashboard data

#### Analyst Endpoints
- `GET /api/dashboard/attacks` - Attack data
- `GET /api/dashboard/dns` - DNS logs
- `GET /api/dashboard/ips` - IP information
- `GET /api/incidents/list` - Incidents
- `POST /api/incidents/assign` - Assign incident
- `POST /api/logs/ingest` - Log ingestion

#### Auth Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind CSS config |
| `postcss.config.mjs` | PostCSS configuration |
| `eslint.config.mjs` | ESLint rules |
| `components.json` | Component aliases |
| `package.json` | Dependencies & scripts |

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `node scripts/seedAdmin.ts` | Seed admin user |
| `node scripts/createAnalyst.ts` | Create analyst account |

## Improvements Made (Recent)

✅ **AdminDashboard.tsx** Performance Optimizations:
- Removed staggered animation delays (0.1s × items)
- Parallelized API calls (Promise.all)
- Added component memoization
- Used useCallback for handlers
- Removed expensive animations
- Improved UI/UX with better styling

## Next Steps for Optimization

### Suggested Refactoring
1. **Extract API Clients** → `src/lib/api/`
   - Centralize API calls
   - Type-safe requests

2. **Create Custom Hooks** → `src/hooks/`
   - `useAnalysts()` - Fetch and manage analysts
   - `useDashboard()` - Dashboard data
   - `useAuth()` - Authentication state

3. **Extract Schemas** → `src/validation/`
   - Consolidate validation logic
   - Use Zod or Joi

4. **Organize Types** → `src/types/`
   - Group related types
   - Create type namespaces

5. **Feature Modules** → `src/features/`
   - Admin feature folder
   - Analyst feature folder
   - Auth feature folder

## File Size Overview

```
Large Files (>500 lines):
- src/components/dashboard_admin/AdminDashboard.tsx (~200 lines) ✅ OPTIMIZED

Medium Files (100-500 lines):
- src/lib/auth.ts
- src/models/User.ts
- src/schema/*.ts

Small Files (<100 lines):
- Most API routes
- UI components
- Utilities
```

## Best Practices Applied

✅ TypeScript for type safety
✅ Component memoization for performance
✅ Parallel data fetching
✅ Proper error handling
✅ Separation of concerns
✅ Reusable hooks
✅ Centralized utilities
✅ Clear file organization

---

**Last Updated**: December 8, 2025
**Status**: Production Ready with Optimizations

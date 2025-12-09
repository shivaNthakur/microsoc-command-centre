# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER / FRONTEND                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │         Admin Dashboard Component                     │       │
│  │  (/admin/dashboard)                                  │       │
│  │                                                       │       │
│  │  ┌────────┬───────────┬──────────────┐              │       │
│  │  │Overview│ Analysts  │Pending Reqs  │              │       │
│  │  └────────┴───────────┴──────────────┘              │       │
│  │                                                       │       │
│  │  useEffect → fetch data on mount                    │       │
│  │  Render → Display 3 tabs with real data             │       │
│  │  onClick → Call API to approve/reject/remove        │       │
│  │  Auto-refetch → Update UI after actions             │       │
│  │                                                       │       │
│  └──────────────────────────────────────────────────────┘       │
│           ↓                    ↓                    ↓             │
│    [GET /api/analysts]  [GET /api/pending]   [POST/DELETE]     │
└────────────┼────────────────────┼────────────────────┼──────────┘
             │                    │                    │
             ↓                    ↓                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   NEXT.JS BACKEND / APIs                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Route Handlers:                                                 │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GET /api/admin/analysts                                │   │
│  │ ├─ Query: User.find({ isApproved: true })             │   │
│  │ └─ Response: List of approved analysts                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GET /api/admin/analysts/pending                        │   │
│  │ ├─ Query: User.find({ isApproved: false })            │   │
│  │ └─ Response: List of pending analysts                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /api/admin/analysts/approve                       │   │
│  │ ├─ Receives: { id: string }                            │   │
│  │ ├─ Query: User.findByIdAndUpdate(id, isApproved:true) │   │
│  │ └─ Response: Success message                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /api/admin/analysts/reject                        │   │
│  │ ├─ Receives: { id: string }                            │   │
│  │ ├─ Query: User.findByIdAndDelete(id)                   │   │
│  │ └─ Response: Success message                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ DELETE /api/admin/analysts/[id]                        │   │
│  │ ├─ Param: id (from URL)                                │   │
│  │ ├─ Query: User.findByIdAndDelete(id)                   │   │
│  │ └─ Response: Success message                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────┬────────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  users collection:                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ {                                                       │   │
│  │   _id: ObjectId,                                        │   │
│  │   name: String,                                         │   │
│  │   email: String (unique),                               │   │
│  │   password: String (bcrypt hashed),                     │   │
│  │   role: "admin" | "analyst",                            │   │
│  │   isApproved: Boolean,      ← KEY FIELD               │   │
│  │   isActive: Boolean,                                    │   │
│  │   lastLogin: Date,                                      │   │
│  │   createdAt: Date,                                      │   │
│  │   updatedAt: Date                                       │   │
│  │ }                                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Filter Operations:                                              │
│  • Find approved: { role: "analyst", isApproved: true }        │
│  • Find pending:  { role: "analyst", isApproved: false }       │
│  • Approve:       Set isApproved = true                        │
│  • Reject:        Delete document                              │
│  • Remove:        Delete document                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

```
                    AdminDashboard Component
                     (Main Container)
                            │
                            ↓
    ┌───────────────────────────────────────────┐
    │          State Management                  │
    ├───────────────────────────────────────────┤
    │ activeTab: "overview" | "analysts"        │
    │ analysts: Analyst[]                        │
    │ pendingAnalysts: PendingAnalyst[]          │
    │ actionInProgress: string | null            │
    │ totalAttacks, modelAccuracy, attackData   │
    └───────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │useEffect │  │fetch     │  │handle    │
        │on mount  │  │Analysts  │  │Actions   │
        └──────────┘  └──────────┘  └──────────┘
              │            │              │
              └────────────┼──────────────┘
                           ↓
         ┌─────────────────────────────────────┐
         │    API Calls (fetch)                 │
         ├─────────────────────────────────────┤
         │ GET /api/admin/analysts              │
         │ GET /api/admin/analysts/pending      │
         │ POST /api/admin/analysts/approve     │
         │ POST /api/admin/analysts/reject      │
         │ DELETE /api/admin/analysts/[id]     │
         └─────────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ↓                                   ↓
    ┌──────────────┐              ┌──────────────┐
    │Update State  │              │Alert User    │
    │setAnalysts() │              │Success/Error │
    │setPending()  │              │Message       │
    └──────────────┘              └──────────────┘
         │                              │
         ↓                              ↓
    ┌──────────────────────────────────────────┐
    │    Re-render Component                    │
    ├──────────────────────────────────────────┤
    │ ┌────┬─────┬──────────┐                  │
    │ │Ovr │Ana  │Pending   │ ← Tab Buttons   │
    │ └────┴─────┴──────────┘                  │
    │                                          │
    │ ┌──────────────────────────┐             │
    │ │ Tab Content (Dynamic)    │             │
    │ │ Based on activeTab state │             │
    │ └──────────────────────────┘             │
    └──────────────────────────────────────────┘
```

## User Permission Matrix

```
┌──────────────────────────────────────────────────────────┐
│                    Permission Matrix                      │
├──────────────────────────────────────────────────────────┤
│                                                            │
│ User Type  │ View   │ Approve │ Reject │ Remove │ Login   │
│            │Pending │Analysts │ Analysts│Analysts│         │
│────────────┼────────┼─────────┼────────┼────────┼─────────│
│ Admin      │   ✅   │   ✅    │  ✅    │  ✅    │  ✅      │
│────────────┼────────┼─────────┼────────┼────────┼─────────│
│ Approved   │   ❌   │   ❌    │  ❌    │  ❌    │  ✅      │
│ Analyst    │        │         │        │        │         │
│────────────┼────────┼─────────┼────────┼────────┼─────────│
│ Pending    │   ❌   │   ❌    │  ❌    │  ❌    │  ❌      │
│ Analyst    │        │         │        │        │         │
│────────────┼────────┼─────────┼────────┼────────┼─────────│
│ Anonymous  │   ❌   │   ❌    │  ❌    │  ❌    │  ❌      │
│            │        │         │        │        │ (signup) │
│            │        │         │        │        │ ✅       │
└────────────┴────────┴─────────┴────────┴────────┴─────────┘
```

---

## Workflow State Machine

```
                    ANALYST LIFECYCLE
                    
   ┌──────────────────────────────────────────────────────┐
   │                  START (Signup)                       │
   └────────────────────┬─────────────────────────────────┘
                        │
                        ↓
   ┌──────────────────────────────────────────────────────┐
   │          PENDING STATE                               │
   │  • User exists in database                           │
   │  • isApproved = false                                │
   │  • CANNOT login                                      │
   │  • Waiting for admin approval                        │
   └────────┬──────────────────────────────────┬──────────┘
            │                                  │
     APPROVE│                                  │REJECT
            ↓                                  ↓
   ┌──────────────────┐            ┌──────────────────────┐
   │ APPROVED STATE   │            │ REJECTED STATE       │
   │ • isApproved=✅  │            │ • User deleted       │
   │ • CAN login      │            │ • Cannot rejoin      │
   │ • Active team    │            │ • Must re-signup     │
   │   member         │            │                      │
   └────────┬─────────┘            └──────────────────────┘
            │                       (End of flow)
            │
            ↓
   ┌──────────────────────────────────────────────────────┐
   │          REMOVE (Optional)                           │
   │  • Admin removes active analyst                      │
   │  • User deleted from database                        │
   │  • CANNOT login anymore                              │
   └────────────────────────────────────────────────────────┘
                     (End of flow)
```

---


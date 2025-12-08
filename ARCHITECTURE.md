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

---

## Data Flow Diagram

```
ANALYST SIGNUP FLOW
═══════════════════════════════════════════════════════════════════

1. Analyst visits /auth/signup
   ↓
2. Fills form (name, email, password)
   ↓
3. POST /api/auth/signup
   ├─ Validate input
   ├─ Hash password with bcrypt
   ├─ Create user in MongoDB with isApproved: false
   └─ Return 201 Created
   ↓
4. Analyst redirected to /login
   ↓
5. Analyst CANNOT login yet (awaits approval)


ADMIN APPROVAL FLOW
═══════════════════════════════════════════════════════════════════

1. Admin logs in
   ↓
2. Admin visits /admin/dashboard
   ↓
3. Component mounts → useEffect runs
   ├─ Parallel GET requests:
   │  ├─ GET /api/admin/analysts
   │  └─ GET /api/admin/analysts/pending
   └─ Data loaded into state
   ↓
4. UI renders three tabs
   ├─ Overview (charts + stats)
   ├─ Analysts (list of approved + count badge)
   └─ Pending Requests (list of pending + count badge)
   ↓
5. Admin clicks "Pending Requests" tab
   ↓
6. Sees list of analysts waiting for approval
   ├─ Name
   ├─ Email
   ├─ Application date
   ├─ [Approve] button
   └─ [Reject] button
   ↓
7a. APPROVE PATH:
   ├─ Admin clicks [Approve]
   ├─ Component calls POST /api/admin/analysts/approve
   │  └─ Backend: User.findByIdAndUpdate(id, {isApproved: true})
   ├─ Request removed from pending list
   ├─ Auto-fetch refreshes both lists
   ├─ Success alert shown
   └─ Analyst now appears in "Analysts" tab
      ↓
      └─ Analyst can now login!

7b. REJECT PATH:
   ├─ Admin clicks [Reject]
   ├─ Confirmation dialog appears
   ├─ Admin confirms
   ├─ Component calls POST /api/admin/analysts/reject
   │  └─ Backend: User.findByIdAndDelete(id)
   ├─ Account deleted from database
   ├─ Success alert shown
   └─ Analyst disappears from pending list
      ↓
      └─ Analyst cannot access system


ANALYST MANAGEMENT FLOW
═══════════════════════════════════════════════════════════════════

1. Admin in "Analysts" tab
   ↓
2. Sees list of approved analysts
   ├─ Name
   ├─ Email
   ├─ Join date
   └─ [Remove] button
   ↓
3. Admin decides to remove an analyst
   ├─ Clicks [Remove]
   ├─ Confirmation dialog appears
   ├─ Admin confirms
   ├─ Component calls DELETE /api/admin/analysts/{id}
   │  └─ Backend: User.findByIdAndDelete(id)
   ├─ Account deleted from database
   ├─ Success alert shown
   └─ Analyst disappears from list
      ↓
      └─ Analyst can no longer login
```

---

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

---

## Data Structure Diagram

```
API Response: GET /api/admin/analysts
═══════════════════════════════════════════════════════════════════

{
  "success": true,
  "analysts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Analyst",
      "email": "john@example.com",
      "role": "analyst",
      "isApproved": true,           ← Always true for this endpoint
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "analyst",
      "isApproved": true,
      "createdAt": "2024-01-10T14:20:00Z"
    }
  ]
}


API Response: GET /api/admin/analysts/pending
═══════════════════════════════════════════════════════════════════

{
  "success": true,
  "requests": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "createdAt": "2024-01-18T09:15:00Z"
                                    ↑
                    ← No isApproved field (always false)
    }
  ]
}


Request Body: POST /api/admin/analysts/approve
═══════════════════════════════════════════════════════════════════

{
  "id": "507f1f77bcf86cd799439013"
}


Request Body: POST /api/admin/analysts/reject
═══════════════════════════════════════════════════════════════════

{
  "id": "507f1f77bcf86cd799439013"
}


URL Parameter: DELETE /api/admin/analysts/{id}
═══════════════════════════════════════════════════════════════════

id from URL path: 507f1f77bcf86cd799439013


Component State Structure
═══════════════════════════════════════════════════════════════════

interface Analyst {
  _id: string
  name: string
  email: string
  role: string
  isApproved: boolean
  createdAt: string
}

interface PendingAnalyst {
  _id: string
  name: string
  email: string
  createdAt: string
}

state = {
  activeTab: "overview" | "analysts" | "requests"
  analysts: Analyst[]
  pendingAnalysts: PendingAnalyst[]
  actionInProgress: string | null
  totalAttacks: number
  modelAccuracy: number
  attackData: Array<{type, severity, count}>
}
```

---

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

This architecture provides:
✅ Clean separation of concerns  
✅ Real-time data from MongoDB  
✅ Intuitive user interface  
✅ Type-safe operations  
✅ Error handling at each level  
✅ Reversible state transitions  

# Smart Hostel Management System - System Architecture Design

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Presentation)                        │
│                                                                             │
│    ┌──────────────────┐                    ┌──────────────────┐            │
│    │   Web Browser    │                    │  Mobile Browser  │            │
│    │  (Chrome, Edge)  │                    │   (Safari, etc)  │            │
│    └──────────────────┘                    └──────────────────┘            │
│             │                                       │                       │
│             └───────────────────┬───────────────────┘                       │
│                                 │                                          │
│                        HTTP/HTTPS Protocol                                │
│                                 │                                          │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────┐
│                    FRONTEND APPLICATION LAYER                               │
│                   (React.js 18.x + TypeScript)                              │
│                                 │                                          │
│    ┌────────────────────────────▼─────────────────────────────┐            │
│    │                    App Router (AppRoutes)                 │            │
│    │  ┌──────────────────────────────────────────────────┐    │            │
│    │  │ Authentication   │  Dashboard  │  UI Components  │    │            │
│    │  │ ├─ Login Page    │  ├─ Student │  ├─ Navbar     │    │            │
│    │  │ ├─ Register      │  ├─ Warden  │  ├─ Forms      │    │            │
│    │  │ └─ Logout        │  ├─ Canteen │  ├─ Tables     │    │            │
│    │  │                  │  ├─ Maint.  │  └─ Modals     │    │            │
│    │  └──────────────────────────────────────────────────┘    │            │
│    │                                                            │            │
│    │  Context Providers (State Management)                     │            │
│    │  ├─ AuthContext    ├─ CanteenContext                      │            │
│    │  ├─ ThemeContext   └─ ComplaintContext                    │            │
│    └────────────────────────────────────────────────────────────┘            │
│                                 │                                          │
│                      API Requests (JSON/REST)                             │
│                                 │                                          │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────┐
│              SECURITY LAYER                                                 │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  • CORS Configuration      • Input Validation & Sanitization│           │
│  │  • JWT Token Verification  • HTTPS/TLS Encryption           │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                 │                                          │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────┐
│            BACKEND APPLICATION LAYER                                        │
│         (Node.js 16.x + Express.js + TypeScript)                            │
│                                 │                                          │
│    ┌────────────────────────────▼─────────────────────────────┐            │
│    │              API Gateway (Port 5000)                      │            │
│    │         Request Routing & Initial Processing             │            │
│    └────────────────────────────┬─────────────────────────────┘            │
│                                 │                                          │
│    ┌────────────────────────────▼─────────────────────────────┐            │
│    │           Middleware Pipeline (in order)                 │            │
│    │                                                            │            │
│    │  1. Authentication Middleware   (Verify JWT Tokens)       │            │
│    │  2. Validation Middleware       (Validate Input Data)     │            │
│    │  3. Error Handling Middleware   (Exception Handling)      │            │
│    │  4. Logging Middleware          (Request/Response Logs)   │            │
│    │                                                            │            │
│    └────────────────────────────┬─────────────────────────────┘            │
│                                 │                                          │
│    ┌────────────────────────────▼─────────────────────────────┐            │
│    │         Business Logic Services (Route Handlers)          │            │
│    │                                                            │            │
│    │  ┌──────────────────┐      ┌──────────────────┐           │            │
│    │  │ Auth Service     │      │ User Service     │           │            │
│    │  ├─ Register User   │      ├─ Get Profile    │           │            │
│    │  ├─ Login           │      ├─ Update Profile │           │            │
│    │  ├─ Logout          │      └─ Manage Roles   │           │            │
│    │  └─ Verify JWT      │                        │           │            │
│    │                     │                        │           │            │
│    │  ┌──────────────────┐      ┌──────────────────┐           │            │
│    │  │ Attendance Svc   │      │ Canteen Service  │           │            │
│    │  ├─ Mark Attend.    │      ├─ Get Menu Items │           │            │
│    │  ├─ Get Records     │      ├─ Create Orders  │           │            │
│    │  └─ Get Summary     │      ├─ Update Status  │           │            │
│    │                     │      └─ Get Orders     │           │            │
│    │                     │                        │           │            │
│    │  ┌──────────────────┐      ┌──────────────────┐           │            │
│    │  │ Complaint Svc    │      │ Notice Service   │           │            │
│    │  ├─ Create Compl.   │      ├─ Create Notice  │           │            │
│    │  ├─ Track Compl.    │      ├─ Get Notices    │           │            │
│    │  ├─ Resolve         │      └─ Delete Notice  │           │            │
│    │  └─ Get History     │                        │           │            │
│    │                     │                        │           │            │
│    │  ┌──────────────────┐      ┌──────────────────┐           │            │
│    │  │ Task Service     │      │ Issue Service    │           │            │
│    │  ├─ Assign Task     │      ├─ Report Issue    │           │            │
│    │  ├─ Update Status   │      ├─ Track Issue     │           │            │
│    │  └─ Get Tasks       │      └─ Resolve Issue   │           │            │
│    │                     │                        │           │            │
│    └──────────────────────────────────────────────┘           │            │
│                                 │                                          │
│    ┌────────────────────────────▼─────────────────────────────┐            │
│    │        Database Access Layer (Mongoose ODM)              │            │
│    │  • Connection Management    • Query Building             │            │
│    │  • Transaction Handling     • Schema Validation          │            │
│    └────────────────────────────┬─────────────────────────────┘            │
│                                 │                                          │
│                        SQL Queries / Document Operations                  │
│                                 │                                          │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────┐
│               DATA LAYER (MongoDB 5.x+)                                     │
│                                 │                                          │
│    ┌────────────────────────────▼─────────────────────────────┐            │
│    │              MongoDB Database Collections                 │            │
│    │                                                            │            │
│    │  ┌─────────────────┐  ┌─────────────────┐                │            │
│    │  │ Users           │  │ Attendance      │                │            │
│    │  ├─ _id            │  ├─ _id            │                │            │
│    │  ├─ name           │  ├─ studentId      │                │            │
│    │  ├─ email          │  ├─ date           │                │            │
│    │  ├─ password       │  ├─ status         │                │            │
│    │  ├─ role           │  ├─ markedBy       │                │            │
│    │  ├─ studentId      │  └─ timestamp      │                │            │
│    │  └─ department     │                    │                │            │
│    │                    │  ┌─────────────────┐                │            │
│    │  ┌─────────────────┐  │ Canteen Items   │                │            │
│    │  │ Orders          │  ├─ _id            │                │            │
│    │  ├─ _id            │  ├─ name           │                │            │
│    │  ├─ studentId      │  ├─ description    │                │            │
│    │  ├─ items[]        │  ├─ price          │                │            │
│    │  ├─ totalPrice     │  ├─ category       │                │            │
│    │  ├─ status         │  └─ availability   │                │            │
│    │  └─ orderDate      │                    │                │            │
│    │                    │  ┌─────────────────┐                │            │
│    │  ┌─────────────────┐  │ Complaints      │                │            │
│    │  │ Notices         │  ├─ _id            │                │            │
│    │  ├─ _id            │  ├─ studentId      │                │            │
│    │  ├─ title          │  ├─ category       │                │            │
│    │  ├─ description    │  ├─ description    │                │            │
│    │  ├─ content        │  ├─ status         │                │            │
│    │  ├─ createdBy      │  ├─ priority       │                │            │
│    │  └─ createdAt      │  └─ createdAt      │                │            │
│    │                    │                    │                │            │
│    │  ┌─────────────────┐  ┌─────────────────┐                │            │
│    │  │ Tasks           │  │ Critical Issues │                │            │
│    │  ├─ _id            │  ├─ _id            │                │            │
│    │  ├─ title          │  ├─ title          │                │            │
│    │  ├─ assignedTo     │  ├─ severity       │                │            │
│    │  ├─ status         │  ├─ status         │                │            │
│    │  ├─ priority       │  ├─ reportedBy     │                │            │
│    │  └─ createdAt      │  └─ createdAt      │                │            │
│    │                    │                    │                │            │
│    └────────────────────────────────────────────┘            │            │
│                                                                             │
│    ┌────────────────────────────────────────────────────────┐             │
│    │     Cache Layer (Session Storage & Caching)            │             │
│    │  • Active User Sessions  • Temporary Data               │             │
│    │  • Authentication Tokens • Rate Limiting Info           │             │
│    └────────────────────────────────────────────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### User Authentication Flow
```
User Input (Login)
         │
         ▼
Frontend Auth Page (React)
         │
         ▼ POST /api/auth/login
API Gateway
         │
         ▼
Auth Middleware (JWT Verification)
         │
         ▼
Auth Service
         │
         ├─ Validate Credentials
         ├─ Hash Password Comparison
         └─ Generate JWT Token
         │
         ▼ Success/Failure
Frontend (Store Token in localStorage)
         │
         ▼
Redirect to Dashboard
```

### Attendance Marking Flow
```
Warden marks attendance
         │
         ▼ POST /api/attendance/mark
API Gateway
         │
         ▼
Auth Middleware (Verify JWT)
         │
         ▼
Validation Middleware (Validate Request)
         │
         ▼
Attendance Service
         │
         ├─ Verify User Role (Warden only)
         ├─ Create Attendance Record
         └─ Save to MongoDB
         │
         ▼
Database Response
         │
         ▼
Return Success to Frontend
         │
         ▼
Update Dashboard Display
```

### Order Creation Flow
```
Student places canteen order
         │
         ▼ POST /api/canteen/order
API Gateway
         │
         ▼
Auth Middleware (Verify JWT)
         │
         ▼
Validation Middleware (Validate Items)
         │
         ▼
Canteen Service
         │
         ├─ Verify Item Availability
         ├─ Calculate Total Price
         ├─ Create Order Document
         └─ Save to MongoDB
         │
         ▼
Return Order Details
         │
         ▼
Frontend (Display Order Confirmation)
```

## Technology Stack Details

### Frontend Stack
- **Framework:** React.js 18.x
- **Language:** TypeScript 5.x
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Custom CSS
- **State Management:** React Context API
- **HTTP Client:** Axios/Fetch API

### Backend Stack
- **Runtime:** Node.js 16.x LTS
- **Framework:** Express.js 4.x
- **Language:** TypeScript 5.x
- **Database ORM:** Mongoose 7.x
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Express Validator
- **Logging:** Winston/Morgan
- **Testing:** Jest + Supertest

### Database
- **Type:** NoSQL (Document-based)
- **Database:** MongoDB 5.x+
- **Hosting:** MongoDB Atlas / Local Instance
- **Collections:** 8 main collections
- **Indexes:** On frequently queried fields

### Security Measures
1. **Authentication:** JWT with 24-hour expiration
2. **Password:** Bcrypt with salt rounds (10)
3. **Authorization:** Role-based access control (RBAC)
4. **Data Transmission:** HTTPS/TLS encryption
5. **Input Validation:** Sanitization & Validation
6. **CORS:** Configured for allowed origins
7. **Protection:** XSS, SQL Injection, CSRF prevention

## Scalability Considerations

### Horizontal Scaling
- Load Balancer (Nginx/HAProxy) for multiple backend instances
- MongoDB replica set for database redundancy
- Session storage in distributed cache (Redis)

### Vertical Scaling
- Database indexing optimization
- Query optimization
- Caching strategies

### Performance Optimization
- API response compression
- Frontend code splitting
- Database connection pooling
- CDN for static assets

## Deployment Architecture

```
┌──────────────────┐
│   Users/Clients  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│   DNS / Domain Name      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Load Balancer (Nginx)   │
└────────┬─────────────────┘
         │
    ┌────┴────┬────────┐
    │         │        │
    ▼         ▼        ▼
 ┌────────┐ ┌────────┐ ┌────────┐
 │Backend │ │Backend │ │Backend │
 │Server 1│ │Server 2│ │Server 3│
 └───┬────┘ └───┬────┘ └───┬────┘
     │         │        │
     └─────┬───┴────┬────┘
           │        │
           ▼        ▼
      ┌─────────────────┐
      │  MongoDB Cluster│
      │  (Replica Set)  │
      └─────────────────┘
```

## API Endpoints Summary

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Endpoints
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin)

### Attendance Endpoints
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/records` - Get attendance records
- `GET /api/attendance/summary` - Get attendance summary

### Canteen Endpoints
- `GET /api/canteen/menu` - Get menu items
- `POST /api/canteen/order` - Create order
- `GET /api/canteen/orders` - Get user orders
- `PUT /api/canteen/orders/:id/status` - Update order status

### Complaint Endpoints
- `POST /api/complaints/create` - Create complaint
- `GET /api/complaints/mycomplaints` - Get user complaints
- `GET /api/complaints/all` - Get all complaints (staff)
- `PUT /api/complaints/:id/resolve` - Resolve complaint

### Notice Endpoints
- `GET /api/notices` - Get all notices
- `POST /api/notices/create` - Create notice (staff)
- `DELETE /api/notices/:id` - Delete notice (staff)

### Task Endpoints
- `POST /api/tasks/create` - Create task
- `GET /api/tasks` - Get assigned tasks
- `PUT /api/tasks/:id/status` - Update task status

---

## How to Convert to JPG

To save this architecture as an image, you can:

1. **Use Online Tool:**
   - Go to https://kroki.io/ or https://mermaid.live/
   - Paste the Mermaid diagram markdown
   - Export as PNG/JPG

2. **Use CLI Tool:**
   ```bash
   npm install -g @mermaid-js/mermaid-cli
   mmdc -i architecture.mmd -o architecture.png
   ```

3. **Use VS Code Extension:**
   - Install "Markdown Preview Mermaid Support"
   - Right-click diagram → Export as PNG/SVG

---

**Created:** May 13, 2026  
**Project:** Smart Hostel Management System  
**Version:** 1.0

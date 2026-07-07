# Smart Hostel Management System

A comprehensive web-based management system designed to streamline hostel operations, student services, and administrative tasks.

## 🌟 Features

- **User Management**: Role-based access control for students, wardens, maintenance staff, and administrators
- **Attendance Tracking**: Digital attendance records and management
- **Canteen Management**: Menu management, food ordering, and order tracking
- **Complaint Management**: Complaint submission and resolution tracking
- **Notice Board**: Announcements and important notices
- **Task Management**: Task assignment and progress tracking
- **Critical Issues**: Emergency issue reporting and management
- **Delivery Status**: Track delivery and service updates
- **Student Applications**: Handle room allocation and other applications
- **Multiple Dashboards**: Customized dashboards for different user roles

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (as per config structure)
- **Authentication**: JWT-based authentication

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS (with theme support)
- **State Management**: Context API

## 📁 Project Structure

```
Smart-Hostel-MS/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── app.ts             # Express app setup
│   │   ├── server.ts          # Server entry point
│   │   ├── config/            # Configuration (Database)
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic
│   │   └── seed/              # Database seeding
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── frontend/                   # React Vite application
    ├── src/
    │   ├── components/        # Reusable React components
    │   ├── context/           # React Context providers
    │   ├── pages/             # Page components
    │   ├── routes/            # Route configuration
    │   ├── App.tsx
    │   └── main.tsx
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance running

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dinukashamithakodagoda/Smart-Hostel-MS.git
   cd Smart-Hostel-MS
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Environment Setup

Create `.env` files in both backend and frontend directories with necessary configuration:

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-hostel
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

**Start Backend Server**
```bash
cd backend
npm start
# or for development with hot reload
npm run dev
```

**Start Frontend Development Server**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and backend API at `http://localhost:5000`

### Troubleshooting

**MongoDB Connection ETIMEDOUT (MongoDB Atlas)**
If you encounter a connection timeout error when running the backend (e.g., `MongoNetworkError: connect ETIMEDOUT`), it is likely because your current IP address is not whitelisted in MongoDB Atlas. 

To fix this:
1. Log into your [MongoDB Atlas dashboard](https://cloud.mongodb.com/).
2. Navigate to **Network Access** under the **Security** section in the left sidebar.
3. Click **+ Add IP Address**.
4. Click **Add Current IP Address**.
5. Confirm and wait for the status to become *Active*.
6. Restart your backend server.

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance

### Canteen
- `GET /api/canteen` - Get menu items
- `POST /api/canteen` - Add new item
- `GET /api/canteen/orders` - Get orders
- `POST /api/canteen/orders` - Place order

### Complaints
- `GET /api/complaints` - Get complaints
- `POST /api/complaints` - File complaint
- `PUT /api/complaints/:id` - Update complaint status

### Notices
- `GET /api/notices` - Get notices
- `POST /api/notices` - Create notice
- `DELETE /api/notices/:id` - Delete notice

### Tasks
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task

### Issues
- `GET /api/issues` - Get critical issues
- `POST /api/issues` - Report issue
- `PUT /api/issues/:id` - Update issue

### Applications
- `GET /api/applications` - Get applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id` - Process application

## 👥 User Roles

- **Student**: View notices, place canteen orders, file complaints, track attendance
- **Warden**: Manage hostel operations, approve applications, handle complaints
- **Sub-Warden**: Assist warden, manage specific tasks
- **Canteen Manager**: Manage menu, process orders
- **Cleaning Staff**: View assigned tasks, update status
- **Maintenance Staff**: Report and manage maintenance issues
- **Administrator**: Full system access, user management

## 📱 Dashboards

Each role has a dedicated dashboard:
- **StudentDashboard**: Personal overview and quick actions
- **WardenDashboard**: Hostel management overview
- **SubWardenDashboard**: Delegated responsibilities
- **CanteenManagerDashboard**: Order and menu management
- **CleaningDashboard**: Task assignments
- **MaintenanceDashboard**: Maintenance requests
- **MarshalDashboard**: Security and discipline

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing
- Protected API endpoints
- Input validation and sanitization

## 📝 Database Models

- **User**: User account information
- **AttendanceRecord**: Student attendance logs
- **CanteenItem**: Menu items
- **Order**: Food orders
- **Complaint**: Student complaints
- **Notice**: Announcements
- **Task**: Work assignments
- **CriticalIssue**: Emergency reports
- **DeliveryStatus**: Delivery tracking
- **StudentApplication**: Room/service applications

## 🛠️ Development

### Backend Development
- TypeScript for type safety
- Modular route-based architecture
- Service layer for business logic
- Middleware for cross-cutting concerns

### Frontend Development
- Component-based React architecture
- Context API for state management
- Responsive CSS styling
- Vite for fast development

## 📦 Build & Deployment

**Build Backend**
```bash
cd backend
npm run build
```

**Build Frontend**
```bash
cd frontend
npm run build
```

## 📄 License

This project is developed for Smart Hostel Management purposes.

## 👨‍💻 Author

**Dinuka Shamitha Kodagoda**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Last Updated**: May 2026

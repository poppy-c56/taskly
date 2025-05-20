# Taskly - Team Task Management App

## ✨ Features

- **User Authentication** (Register, Login, Logout)
- **Team Collaboration** (Create teams, add members)
- **Task Management** (Create, Assign, Update Status)
- **Task Status Tracking** (Todo → In Progress → Done)
- **Responsive UI** built with React (Vite)
- **Protected Routes** with JWT authentication
- **REST API** backend with Express.js

## 🛠 Tech Stack

**Frontend:**

- React 18 (Vite)
- React Router 6
- Zustand (State management)
- Axios (HTTP client)
- Tailwind CSS (Styling)

**Backend:**

- Node.js
- Express.js (IronLauncher)
- MongoDB (Mongoose)
- JWT Authentication

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/Taskly.git
cd Taskly

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

# Configuration:

**Backend .env (server/.env)**:

```bash
MONGODB_URI=mongodb://localhost:27017/taskly
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=90d
PORT=5000
```

**Frontend .env (client/.env)**:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

**Start backend (from /server)**

```bash
npm run dev
```

**Start frontend (from /client)**

```bash
npm run dev
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a new branch** (git checkout -b feature/feature-name)
3. **Commit your changes** (git commit -m 'Add some feature')
4. **Push to the branch** (git push origin feature/feature-name)
5. **Open a Pull Request**

## License

**MIT**
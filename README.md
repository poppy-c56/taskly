# Taskly - Team Task Management App

## Features

- **User Authentication** (Register, Login, Logout)
- **Team Collaboration** (Create teams, add members)
- **Task Management** (Create, Assign, Update Status)
- **Task Status Tracking** (Todo → In Progress → Done)
- **Responsive UI** built with React (Vite)
- **Protected Routes** with JWT authentication
- **REST API** backend with Express.js

## Tech Stack

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

## Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB Compass
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/poppy-c56/taskly.git
cd Taskly

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

**Start backend (from /server)**

```bash
node index.js
```

**Start frontend (from /client)**

```bash
npm run dev
```

## Contributing

1. **Fork the repository**
2. **Create a new branch** (git checkout -b feature/feature-name)
3. **Commit your changes** (git commit -m 'Add some feature')
4. **Push to the branch** (git push origin feature/feature-name)
5. **Open a Pull Request**

## License

**MIT**
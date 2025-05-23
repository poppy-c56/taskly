import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import TaskForm from "./components/TaskForm";
import TaskList from "./pages/TaskList";
import TeamList from "./pages/TeamList";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/tasks" element={<TaskList />} />
                <Route path="/tasks/new" element={<TaskForm />} />
                <Route path="/tasks/edit/:id" element={<TaskForm />} />

                <Route path="/teams" element={<TeamList />} />
                <Route
                  path="/teams/new"
                  element={
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <h2>Create New Team</h2>
                      <p>Team creation form will go here.</p>
                    </div>
                  }
                />
                <Route
                  path="/teams/:id/view"
                  element={
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <h2>Team Details</h2>
                      <p>Team details view will go here.</p>
                    </div>
                  }
                />
                <Route
                  path="/teams/:id/edit"
                  element={
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <h2>Manage Team</h2>
                      <p>Team management form will go here.</p>
                    </div>
                  }
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                padding: "16px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

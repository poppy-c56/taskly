import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem("token") || null,
    loading: true,
    error: null,
    teamMembers: [],
  });

  useEffect(() => {
    if (authState.token) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authState.token]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!authState.token) {
        setAuthState((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const [userRes, teamRes] = await Promise.all([
          axios.get("/api/auth/me"),
          axios.get("/api/teams/members"),
        ]);

        setAuthState((prev) => ({
          ...prev,
          user: userRes.data,
          isAuthenticated: true,
          teamMembers: teamRes.data,
          loading: false,
          error: null,
        }));
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        setAuthState({
          user: null,
          isAuthenticated: false,
          token: null,
          loading: false,
          error: null,
          teamMembers: [],
        });
      }
    };

    loadUserData();
  }, [authState.token]);

  const register = async (name, email, password) => {
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setAuthState((prev) => ({
          ...prev,
          token: res.data.token,
          user: res.data.user,
          isAuthenticated: true,
          error: null,
        }));
      }
      return res.data;
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Registration failed",
      }));
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setAuthState((prev) => ({
          ...prev,
          token: res.data.token,
          user: res.data.user,
          isAuthenticated: true,
          error: null,
        }));
      }
      return res.data;
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Invalid credentials",
      }));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
      loading: false,
      error: null,
      teamMembers: [],
    });
    delete axios.defaults.headers.common["Authorization"];
  };

  const addTeamMember = async (email) => {
    try {
      const res = await axios.post(
        "/api/teams/members",
        { email },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setAuthState((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, res.data],
      }));
      return res.data;
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Failed to add team member",
      }));
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        register,
        login,
        logout,
        addTeamMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.error("Fetch user error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      let errorMessage = "Login failed";
      
      if (error.code === "ECONNREFUSED" || error.message.includes("Network Error")) {
        errorMessage = "Cannot connect to server. Please make sure the backend server is running on port 5000.";
      } else if (error.response) {
        errorMessage = error.response.data?.error || "Login failed";
      } else if (error.request) {
        errorMessage = "Server is not responding. Please check if the backend server is running.";
      }
      
      console.error("Login error:", error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (email, password, full_name) => {
    try {
      await axios.post("/api/auth/register", { email, password, full_name });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isSupervisor: user?.role === "supervisor" || user?.role === "admin",
    isUser:
      user?.role === "user" ||
      user?.role === "supervisor" ||
      user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};





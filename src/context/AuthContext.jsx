import React, { createContext, useContext, useState, useEffect } from 'react';

import {
  getCurrentUser,
  getAuthToken,
  loginMember,
  registerMember,
  logoutMember,
  clearAuthData,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication when the application starts
  useEffect(() => {
    const checkAuthentication = async () => {
      const existingToken = getAuthToken();

      if (!existingToken) {
        setLoading(false);
        return;
      }

      try {
        // This also refreshes the token if it has expired
        const currentUser = await getCurrentUser();

        setUser(currentUser);
        setToken(getAuthToken());
      } catch (error) {
        clearAuthData();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await loginMember({ email, password });

      setUser(res.user);
      setToken(res.token);

      return res.user;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async ({ name, email, password, invite_code }) => {
    setLoading(true);

    try {
      const res = await registerMember({
        name,
        email,
        password,
        invite_code,
      });

      return res;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutMember();
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
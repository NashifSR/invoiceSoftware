"use client";

import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../lib/firebase";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Email / Password Login
  const login = async (email, password) => {
    return await authService.login(email, password);
  };

  // Email / Password Registration
  const register = async (data) => {
    return await authService.register(data);
  };

  // Google Login
  const loginWithGoogle = async () => {
    return await authService.loginWithGoogle();
  };

  // Password Reset
  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  // Logout
  const logout = async () => {
    await authService.logout();
  };

  // Firebase ID Token
  // Useful later when communicating with our backend
  const getIdToken = async () => {
    if (!auth.currentUser) {
      return null;
    }

    return await auth.currentUser.getIdToken();
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,

    login,
    register,
    loginWithGoogle,
    resetPassword,
    logout,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

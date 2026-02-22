"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user exists in localStorage or verify via API on mount
    const storedUser = localStorage.getItem("user");
    const storedAccount = localStorage.getItem("account");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAccount) {
      setAccount(JSON.parse(storedAccount));
    }
    setLoading(false);
  }, []);

  const login = (userData, accountData) => {
    setUser(userData);
    setAccount(accountData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("account", JSON.stringify(accountData));
  };

  const logout = () => {
    setUser(null);
    setAccount(null);
    localStorage.removeItem("user");
    localStorage.removeItem("account");
    localStorage.removeItem("selectedChatbot");
    // Clear cookies here if needed or call logout API
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, account, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import api, { registerLogoutCallback } from "@/lib/axios";
// [TEMPORARILY DISABLED] PostHog analytics
// import posthog from "posthog-js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isLoggingOut = useRef(false);

  // Stable logout that can be called from anywhere (including axios interceptor)
  const logout = useCallback(() => {
    // Prevent multiple simultaneous logout calls
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;

    // Try to tell the backend to revoke the current session (fire-and-forget)
    api
      .post("/auth/logout")
      .catch(() => {
        // Ignore errors — we're logging out anyway
      })
      .finally(() => {
        setUser(null);
        setAccount(null);
        localStorage.removeItem("user");
        localStorage.removeItem("account");
        localStorage.removeItem("selectedChatbot");
        // posthog.reset();
        isLoggingOut.current = false;
        router.push("/login");
      });
  }, [router]);

  // Register the logout callback so the axios interceptor can trigger it
  useEffect(() => {
    registerLogoutCallback(logout);
  }, [logout]);

  useEffect(() => {
    // Rehydrate from localStorage for an instant UI
    const storedUser = localStorage.getItem("user");
    const storedAccount = localStorage.getItem("account");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAccount) {
      setAccount(JSON.parse(storedAccount));
    }

    // Background session verification — confirms the backend session is still valid
    api
      .get("/users/current-user")
      .then((res) => {
        // Session is valid; keep user data fresh from backend
        const freshUser = res.data?.data;
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
          const storedAcct = localStorage.getItem("account");
          const acct = storedAcct ? JSON.parse(storedAcct) : null;
          // try {
          //   posthog.identify(freshUser.id, {
          //     email: freshUser.email,
          //     name: freshUser.name,
          //     account_id: acct?.id,
          //     account_name: acct?.name,
          //     account_role: acct?.role,
          //   });
          // } catch (e) {
          //   console.error("PostHog identify failed:", e);
          // }
        }
      })
      .catch(() => {
        // 401 or any error — session is gone, wipe everything
        setUser(null);
        setAccount(null);
        localStorage.removeItem("user");
        localStorage.removeItem("account");
        localStorage.removeItem("selectedChatbot");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (userData, accountData) => {
    setUser(userData);
    setAccount(accountData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("account", JSON.stringify(accountData));
    // try {
    //   posthog.identify(userData.id, {
    //     email: userData.email,
    //     name: userData.name,
    //     account_id: accountData?.id,
    //     account_name: accountData?.name,
    //     account_role: accountData?.role,
    //   });
    // } catch (e) {
    //   console.error("PostHog identify failed:", e);
    // }
  };

  return (
    <AuthContext.Provider value={{ user, account, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

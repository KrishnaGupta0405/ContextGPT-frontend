"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export default function useToolUsage() {
  const [usage, setUsage] = useState({ limit: 25, used: 0, remaining: 25 });
  const [loading, setLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/tools/usage-remaining");
      if (res.data?.data) {
        setUsage(res.data.data);
      }
    } catch {
      // silently fail - don't block the user
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // Call this after a successful tool use to update the count
  const decrementRemaining = () => {
    setUsage((prev) => ({
      ...prev,
      used: prev.used + 1,
      remaining: Math.max(0, prev.remaining - 1),
    }));
  };

  return { usage, loading, refetch: fetchUsage, decrementRemaining };
}

"use client";

import { useEffect } from "react";

const SessionClearer = () => {
  useEffect(() => {
    // Clear session storage on initial load
    sessionStorage.clear();
  }, []);

  return null;
};

export default SessionClearer;

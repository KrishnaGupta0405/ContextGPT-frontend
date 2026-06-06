"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const UnsavedChangesContext = createContext(null);

export function UnsavedChangesProvider({ children }) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const pendingNav = useRef(null);

  // Pages call this to mark themselves dirty/clean
  const markDirty = useCallback(() => setIsDirty(true), []);
  const markClean = useCallback(() => setIsDirty(false), []);

  // Sidebar/navbar call this before navigating
  // If dirty, show dialog; otherwise run the action immediately
  const guardNavigation = useCallback(
    (action) => {
      if (isDirty) {
        pendingNav.current = action;
        setShowDialog(true);
        return false; // navigation was blocked
      }
      action();
      return true; // navigation proceeded
    },
    [isDirty],
  );

  const handleDiscard = () => {
    setShowDialog(false);
    setIsDirty(false);
    if (pendingNav.current) {
      pendingNav.current();
      pendingNav.current = null;
    }
  };

  const handleGoBack = () => {
    setShowDialog(false);
    pendingNav.current = null;
  };

  return (
    <UnsavedChangesContext.Provider
      value={{ isDirty, markDirty, markClean, guardNavigation }}
    >
      {children}

      {showDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Unsaved Changes
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  You have unsaved changes. Please submit first or your changes
                  will be lost.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-9 rounded-lg border-red-200 text-sm font-medium text-red-600 hover:bg-red-50"
                onClick={handleDiscard}
              >
                Discard & Continue
              </Button>
              <Button
                className="h-9 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
                onClick={handleGoBack}
              >
                Go Back & Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const ctx = useContext(UnsavedChangesContext);
  if (!ctx) throw new Error("useUnsavedChanges must be used inside UnsavedChangesProvider");
  return ctx;
}

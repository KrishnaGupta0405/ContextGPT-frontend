"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // If not logged in and trying to access protected route
      router.push(`/login?callbackUrl=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}

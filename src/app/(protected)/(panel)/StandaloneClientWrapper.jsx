"use client";

import Sidebar from "@/components/sidebar";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";

export default function StandaloneClientWrapper({ children }) {
  useScrollRestoration();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar>{children}</Sidebar>
    </div>
  );
}

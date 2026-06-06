"use client";

import useToolUsage from "@/hooks/useToolUsage";
import ToolUsageBanner from "./ToolUsageBanner";

export default function ToolWithUsage({ children }) {
  const { usage, loading } = useToolUsage();

  return (
    <>
      <ToolUsageBanner usage={usage} loading={loading} />
      {/* Disable tool interactions when limit is reached */}
      {!loading && usage.remaining <= 0 ? (
        <div className="pointer-events-none opacity-50">{children}</div>
      ) : (
        children
      )}
    </>
  );
}

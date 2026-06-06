"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Zap, FileStack, Info } from "lucide-react";

function BreakdownBar({ planUsed, planLimit, addonUsed, addonPool, label }) {
  const total = planLimit + addonPool;
  const planPct = total > 0 ? Math.min(100, (planUsed / total) * 100) : 0;
  const addonPct = total > 0 ? Math.min(100, (addonUsed / total) * 100) : 0;
  const combinedPct = Math.min(100, planPct + addonPct);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-xs text-slate-500">
          {(planUsed + addonUsed).toLocaleString()} / {total.toLocaleString()} used
        </span>
      </div>

      {/* Stacked bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {/* Plan portion */}
        <div
          className="absolute left-0 h-full rounded-l-full bg-blue-500 transition-all duration-700"
          style={{ width: `${planPct}%` }}
        />
        {/* Addon portion stacked after plan */}
        <div
          className="absolute h-full bg-violet-400 transition-all duration-700"
          style={{ left: `${planPct}%`, width: `${addonPct}%` }}
        />
      </div>

      {/* Legend row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
          Plan: {planUsed.toLocaleString()} / {planLimit.toLocaleString()}
        </span>
        {addonPool > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-400" />
            Add-on: {addonUsed.toLocaleString()} / {addonPool.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * UsageBreakdown — shows plan vs add-on usage split with an "addon-first" toggle.
 * Placed on the Usage page alongside the AccountUsage section.
 */
export default function UsageBreakdown() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchBreakdown = async () => {
    try {
      const res = await api.get("/billing/usage/breakdown");
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
      }
    } catch {
      // No active sub or not logged in — silently hide
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakdown();
  }, []);

  const handleToggle = async (checked) => {
    setToggling(true);
    try {
      await api.patch("/billing/usage/addon-first", { addonUsageFirst: checked });
      setData((prev) => ({ ...prev, addonUsageFirst: checked }));
      toast.success(
        checked
          ? "Add-on quota will be used first."
          : "Plan quota will be used first."
      );
    } catch {
      toast.error("Failed to update preference.");
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // If no data (no active sub or no addons), don't render
  if (
    !data ||
    (data.messages.addonPool === 0 && data.pages.addonPool === 0)
  ) {
    return null;
  }

  const periodLabel =
    data.periodStart && data.periodEnd
      ? `${format(new Date(data.periodStart), "MMM d")} – ${format(new Date(data.periodEnd), "MMM d, yyyy")}`
      : null;

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="text-primary h-4 w-4" />
              Plan vs Add-On Usage
            </CardTitle>
            {periodLabel && (
              <p className="text-muted-foreground mt-1 text-xs">{periodLabel}</p>
            )}
          </div>

          {/* Addon-first toggle */}
          <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex-1">
              <Label className="text-xs font-semibold text-slate-700">
                Use add-on quota first
              </Label>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                Deduct from your add-on bonus before the plan quota.
              </p>
            </div>
            <Switch
              checked={data.addonUsageFirst}
              onCheckedChange={handleToggle}
              disabled={toggling}
              className="mt-0.5 shrink-0"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Messages breakdown */}
        {data.messages.planLimit > 0 && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50">
              <Zap className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div className="flex-1">
              <BreakdownBar
                label="Messages"
                planUsed={data.messages.planUsed}
                planLimit={data.messages.planLimit}
                addonUsed={data.messages.addonUsed}
                addonPool={data.messages.addonPool}
              />
            </div>
          </div>
        )}

        {/* Pages breakdown */}
        {data.pages.planLimit > 0 && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-50">
              <FileStack className="h-3.5 w-3.5 text-violet-600" />
            </div>
            <div className="flex-1">
              <BreakdownBar
                label="Pages"
                planUsed={data.pages.planUsed}
                planLimit={data.pages.planLimit}
                addonUsed={data.pages.addonUsed}
                addonPool={data.pages.addonPool}
              />
            </div>
          </div>
        )}

        {/* Explainer note */}
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-slate-400">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          The breakdown above is calculated based on your current "use first" preference. Switching preference affects how future usage is attributed.
        </p>
      </CardContent>
    </Card>
  );
}

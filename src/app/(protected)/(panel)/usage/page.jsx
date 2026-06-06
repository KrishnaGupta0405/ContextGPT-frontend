"use client";

import React from "react";
import { AccountUsage } from "./AccountUsage";
import { ModelUsage } from "./ModelUsage";
import UsageBreakdown from "./UsageBreakdown";
import UsageHistory from "./UsageHistory";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";

const UsagePage = () => {
  return (
    <div className="animate-in fade-in zoom-in-95 container mx-auto max-w-5xl space-y-8 px-4 py-8 duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Usage</h1>
          <p className="text-muted-foreground mt-2">
            View your usage of chatbots, pages, messages, and models.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/usage/api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </Link>
        </Button>
      </div>

      <Separator />

      {/* Account Usage Section */}
      <AccountUsage />

      {/* Plan vs Add-On Usage Breakdown (only shown when addons are active) */}
      <UsageBreakdown />

      {/* Model Usage Section */}
      <ModelUsage />


      <Separator />

      {/* Usage History (paginated file + message events) */}
      <UsageHistory />
      
    </div>
  );
};

export default UsagePage;

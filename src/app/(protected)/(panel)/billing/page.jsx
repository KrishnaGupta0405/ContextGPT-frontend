"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrentSubscription } from "./CurrentSubscription";
import { TransactionHistory } from "./TransactionHistory";
import AddonsTab from "./addons/AddonsTab";

function BillingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Allow deep-linking to a specific tab via ?tab=addons
  const tabParam = searchParams.get("tab");
  const defaultTab = tabParam === "addons" ? "addons" : "overview";

  const handleTabChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="animate-in fade-in zoom-in-95 container mx-auto max-w-6xl space-y-6 px-4 py-8 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, add-ons, transaction history, and invoices.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
        <TabsList className="mb-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="addons">Add-Ons</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CurrentSubscription />
        </TabsContent>

        <TabsContent value="addons">
          <AddonsTab />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Billing() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}

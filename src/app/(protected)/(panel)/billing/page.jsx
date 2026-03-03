"use client";

import React from "react";
import { CurrentSubscription } from "./CurrentSubscription";
import { TransactionHistory } from "./TransactionHistory";

const Billing = () => {
  return (
    <div className="animate-in fade-in zoom-in-95 container mx-auto max-w-6xl space-y-8 px-4 py-8 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Billing & Invoices
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, transaction history, and invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Subscription Plan Section */}
        <div className="md:col-span-3">
          <CurrentSubscription />
        </div>

        {/* Transactions History */}
        <div className="md:col-span-3">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Billing;

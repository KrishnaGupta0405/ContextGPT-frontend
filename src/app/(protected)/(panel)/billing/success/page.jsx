"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "your";
  const interval = searchParams.get("interval");

  return (
    <div className="container mx-auto flex max-w-lg items-center justify-center px-4 py-20">
      <Card className="w-full border shadow-sm">
        <CardContent className="pt-10 pb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-sm text-sm">
            Your <span className="font-semibold text-foreground">{plan}</span>
            {interval ? ` (${interval})` : ""} subscription is now active. You
            can start using all the features included in your plan right away.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <a href="/billing">
                View Subscription <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

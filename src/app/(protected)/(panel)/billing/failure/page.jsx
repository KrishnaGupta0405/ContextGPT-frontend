"use client";

import React from "react";
import { XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutFailure() {
  return (
    <div className="container mx-auto flex max-w-lg items-center justify-center px-4 py-20">
      <Card className="w-full border shadow-sm">
        <CardContent className="pt-10 pb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Payment Failed</h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-sm text-sm">
            Something went wrong with your payment. Please try again or use a
            different payment method.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <a href="/pricing">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/billing">
                Go to Billing <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

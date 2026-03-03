"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  Calendar,
  Zap,
  Bot,
  FileStack,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function CurrentSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        const subResponse = await api.get("/billing/subscription/current");
        if (subResponse?.data?.success) {
          setSubscription(subResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const formatDate = (dateString, formatStr = "MMM dd, yyyy") => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), formatStr);
    } catch (e) {
      return "Invalid date";
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount || 0);
  };

  const getPlanName = (planStr) => {
    if (!planStr) return "Free Plan";
    return planStr
      .replace(/_/g, " ")
      .replace("pri ", "")
      .replace("montly", "monthly")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStatusBadge = (status, isTrial = false) => {
    if (isTrial && status?.toLowerCase() === "active") {
      return (
        <Badge className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          Trial
        </Badge>
      );
    }

    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
        return (
          <Badge className="border-green-200 bg-green-100 text-green-800 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="border-red-200 bg-red-100 text-red-800 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            Failed
          </Badge>
        );
      case "canceled":
      case "cancelled":
        return (
          <Badge className="border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Cancelled
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  return (
    <Card className="relative overflow-hidden border shadow-sm">
      {subscription?.status === "active" && (
        <div className="from-primary via-primary/80 to-primary absolute top-0 h-1.5 w-full bg-gradient-to-r" />
      )}
      <CardHeader className="pb-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="text-primary h-5 w-5" />
              Current Plan
            </CardTitle>
            <CardDescription className="mt-1.5">
              Your active subscription and usage limits.
            </CardDescription>
          </div>

          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div>
              {getStatusBadge(
                subscription?.status || "inactive",
                subscription?.isTrial,
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-end gap-4 border-b pb-6">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="mb-2 h-6 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : !subscription ? (
          <div className="py-8 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Zap className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium">You are on the Free Plan</h3>
            <p className="text-muted-foreground mx-auto mt-1 mb-6 max-w-sm text-sm text-balance">
              Upgrade to unlock more chatbots, pages, and higher message limits.
            </p>
            <Button asChild>
              <a href="/pricing">
                View Plans <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Price & Name */}
            <div className="border-border/50 flex flex-wrap items-end gap-x-4 gap-y-2 border-b pb-6">
              <div>
                <h2 className="text-primary text-3xl font-bold tracking-tight">
                  {getPlanName(subscription.planType)}
                  {subscription.isTrial && (
                    <Badge
                      variant="secondary"
                      className="mb-1 ml-3 border-blue-200 bg-blue-50 align-middle text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      Free Trial
                    </Badge>
                  )}
                </h2>
              </div>
              <div className="text-muted-foreground flex items-baseline pb-1">
                <span className="text-foreground mr-1 text-xl font-semibold">
                  {formatCurrency(
                    subscription.planPrice,
                    subscription.currency,
                  )}
                </span>
                <span>
                  / {subscription.billingInterval}{" "}
                  {subscription.isTrial && " after trial"}
                </span>
              </div>
            </div>

            {/* Limits Array */}
            <div className="grid grid-cols-2 gap-6 pt-2 md:grid-cols-4">
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Calendar className="h-4 w-4" />{" "}
                  {subscription.isTrial ? "Trial Ends" : "Next Bill Date"}
                </div>
                <div className="font-semibold">
                  {subscription.isTrial ? (
                    formatDate(subscription.trialEndsAt)
                  ) : (
                    <>
                      {subscription.cancelAtPeriodEnd ? "Cancels " : ""}
                      {formatDate(subscription.nextBilledAt)}
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Bot className="h-4 w-4" /> Chatbots Allowed
                </div>
                <div className="text-lg font-semibold">
                  {subscription.isTrial &&
                  subscription.trialChatbotsLimit !== undefined
                    ? `${subscription.trialChatbotsUsed || 0} / ${
                        subscription.trialChatbotsLimit
                      }`
                    : subscription.maxChatbotsAllowed}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <FileStack className="h-4 w-4" /> Pages Allowed
                </div>
                <div className="text-lg font-semibold">
                  {subscription.isTrial &&
                  subscription.trialPagesLimit !== undefined
                    ? `${subscription.trialPagesUsed || 0} / ${
                        subscription.trialPagesLimit
                      }`
                    : subscription.maxPagesAllowed}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Zap className="h-4 w-4" /> Msg / Month
                </div>
                <div className="text-lg font-semibold">
                  {subscription.isTrial &&
                  subscription.trialMessagesLimit !== undefined
                    ? `${(
                        subscription.trialMessagesUsed || 0
                      ).toLocaleString()} / ${subscription.trialMessagesLimit.toLocaleString()}`
                    : subscription.userMessageRateLimit?.toLocaleString() ||
                      "0"}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {subscription?.managementUrls && (
        <CardFooter className="bg-muted/30 flex items-center justify-between border-t px-6 py-4 text-sm">
          <span className="text-muted-foreground">
            Modify your subscription via Paddle.
          </span>
          <Button variant="outline" size="sm" asChild>
            <a
              href={subscription.managementUrls}
              target="_blank"
              rel="noopener noreferrer"
            >
              Manage Plan <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </a>
          </Button>
        </CardFooter>
      )}
      {/* If there's no management URL but subscription is active, show upgrade */}
      {subscription && !subscription.managementUrls && (
        <CardFooter className="bg-muted/30 flex items-center justify-between border-t px-6 py-4 text-sm">
          <span className="text-muted-foreground">
            Looking for more capacity?
          </span>
          <Button variant="outline" size="sm" asChild>
            <a href="/pricing">Change Plan</a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

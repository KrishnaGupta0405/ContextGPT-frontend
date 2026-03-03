"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Receipt, ExternalLink, FileText } from "lucide-react";

export function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const txnResponse = await api.get("/billing/transactions");
        if (txnResponse?.data?.success) {
          setTransactions(txnResponse.data.data.transactions || []);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load billing history");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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
      case "completed":
        return (
          <Badge className="border-green-200 bg-green-100 text-green-800 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
            Completed
          </Badge>
        );
      case "active":
        return (
          <Badge className="border-green-200 bg-green-100 text-green-800 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
            Active
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
    <Card className="border shadow-sm">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Receipt className="text-primary h-5 w-5" />
              Transaction History
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-0 p-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b px-2 py-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-muted/5 py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Receipt className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium">No transactions found</h3>
            <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm text-balance">
              Your billing history will appear here once you make your first
              payment or start a subscription.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Date</TableHead>
                  <TableHead>Plan Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow
                    key={txn.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="pl-6 font-medium whitespace-nowrap">
                      {formatDate(txn.createdAt)}
                      <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs font-normal">
                        <span>
                          {formatDate(txn.billingPeriodStart, "MMM dd")} -{" "}
                          {formatDate(txn.billingPeriodEnd, "MMM dd, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start">
                        <span className="flex items-center gap-2 text-sm font-medium capitalize">
                          {getPlanName(txn.type)}
                          {txn.subscription?.isTrial && (
                            <Badge
                              variant="outline"
                              className="h-4 border-blue-200 bg-blue-50/50 px-1.5 py-0 text-[10px] text-blue-600 dark:border-blue-800 dark:text-blue-400"
                            >
                              Trial
                            </Badge>
                          )}
                        </span>
                        <span className="text-muted-foreground mt-0.5 text-xs capitalize">
                          {txn.billingInterval ||
                            txn.subscription?.billingInterval}{" "}
                          billing
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-base font-semibold">
                      {formatCurrency(txn.amount, txn.currency)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(txn.status, txn.subscription?.isTrial)}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="text-muted-foreground flex justify-end gap-2">
                        {txn.receiptUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:text-primary h-8 gap-1.5"
                          >
                            <a
                              href={txn.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="h-4 w-4" />
                              <span className="hidden sm:inline">Receipt</span>
                            </a>
                          </Button>
                        )}
                        {txn.invoiceUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:text-primary h-8 gap-1"
                          >
                            <a
                              href={txn.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {!txn.receiptUrl && !txn.invoiceUrl && (
                          <span className="px-2 py-1 text-xs italic">N/A</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

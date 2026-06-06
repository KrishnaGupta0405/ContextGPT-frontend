"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  MessageSquare,
  BookOpen,
  Loader2,
  History,
  ChevronDown,
} from "lucide-react";

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pages", label: "Pages" },
  { value: "messages", label: "Messages" },
];

function HistoryRow({ item }) {
  const isPage = item.kind === "page";

  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0">
      {/* Icon */}
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
          isPage ? "bg-violet-50" : "bg-blue-50"
        }`}
      >
        {isPage ? (
          <BookOpen className="h-3.5 w-3.5 text-violet-600" />
        ) : (
          <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-800">
            {isPage ? item.label : "AI reply sent"}
          </p>
          <Badge
            variant="outline"
            className={`shrink-0 text-[10px] ${
              isPage
                ? "border-violet-200 text-violet-700"
                : "border-blue-200 text-blue-700"
            }`}
          >
            {isPage ? `-${(item.pages ?? item.estimatedPages ?? "?").toLocaleString()} pages` : "-1 message"}
          </Badge>
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
          {item.chatbotName && <span>{item.chatbotName}</span>}
          {isPage && item.fileSource && (
            <span className="capitalize">{item.fileSource.replace(/_/g, " ").toLowerCase()}</span>
          )}
          {isPage && item.fileSize != null && (
            <span>{(item.fileSize / 1024 / 1024).toFixed(2)} MB</span>
          )}
          <span>{format(new Date(item.createdAt), "MMM d, yyyy · h:mm a")}</span>
        </div>
      </div>
    </div>
  );
}

function HistoryRowSkeleton() {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0">
      <Skeleton className="mt-0.5 h-7 w-7 shrink-0 rounded-md" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export default function UsageHistory() {
  const [type, setType] = useState("all");
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchHistory = useCallback(
    async (nextPage, selectedType, append = false) => {
      try {
        const res = await api.get("/usage/history", {
          params: { page: nextPage, limit: 5, type: selectedType },
        });
        if (res.data?.success && res.data?.data) {
          const { items: newItems, pagination: pg } = res.data.data;
          setItems((prev) => (append ? [...prev, ...newItems] : newItems));
          setPagination(pg);
        }
      } catch {
        // silently hide if no sub or error
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    setLoading(true);
    setPage(1);
    setItems([]);
    fetchHistory(1, type, false).finally(() => setLoading(false));
  }, [type, fetchHistory]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    await fetchHistory(nextPage, type, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-slate-500" />
            Usage History
          </CardTitle>

          {/* Type filter */}
          <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  type === opt.value
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <HistoryRowSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
            <FileText className="h-8 w-8 opacity-40" />
            <p className="text-sm">No usage events yet.</p>
          </div>
        ) : (
          <>
            <div>
              {items.map((item) => (
                <HistoryRow key={`${item.kind}-${item.id}`} item={item} />
              ))}
            </div>

            {pagination?.hasMore && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="gap-2 text-xs"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      Load more
                    </>
                  )}
                </Button>
              </div>
            )}

            {pagination && !pagination.hasMore && items.length > 0 && (
              <p className="mt-4 text-center text-[11px] text-slate-400">
                All {pagination.total.toLocaleString()} events loaded
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

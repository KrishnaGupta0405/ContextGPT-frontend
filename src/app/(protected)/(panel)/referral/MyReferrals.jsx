"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_BADGE = {
  PENDING: "bg-yellow-100 text-yellow-700",
  SUCCESSFUL: "bg-green-100 text-green-700",
  EXPIRED: "bg-red-100 text-red-600",
  CANCELED: "bg-gray-100 text-gray-500",
};

const STATUS_OPTIONS = ["ALL", "PENDING", "SUCCESSFUL", "EXPIRED", "CANCELED"];

export const MyReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const fetchReferrals = async (newOffset = 0) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit, offset: newOffset });
      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }
      const response = await api.get(`/referrals/my-referrals?${params}`);
      if (response.data.success) {
        setReferrals(response.data.data.referrals || []);
        setPagination(response.data.data.pagination || { total: 0, hasMore: false });
        setOffset(newOffset);
      }
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
      toast.error("Failed to fetch referrals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals(0);
  }, [statusFilter]);

  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Header with filter */}
      <div className="flex items-center justify-between">
        <h3 className="border-b border-gray-100 pb-2 text-sm font-semibold text-gray-600">
          My Referrals
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 border-gray-200 bg-white text-xs font-normal text-gray-600 shadow-sm hover:bg-gray-50"
            >
              {statusFilter === "ALL" ? "All Status" : statusFilter}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[140px]">
            {STATUS_OPTIONS.map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => setStatusFilter(s)}
                className={statusFilter === s ? "bg-blue-50" : ""}
              >
                {s === "ALL" ? "All Status" : s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* List */}
      <div className="flex-1">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : referrals.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400 italic">
            No referrals found.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="flex flex-col justify-between gap-2 py-3 xl:flex-row xl:items-center"
              >
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    {ref.referredUserName || ref.referredUserEmail || "Unknown User"}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[ref.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {ref.status}
                    </span>
                    {/* Sub-status badge for PENDING referrals */}
                    {ref.status === "PENDING" && ref.referredSubStatus && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        ref.referredSubStatus === "trialing"
                          ? "bg-blue-50 text-blue-600"
                          : ref.referredSubStatus === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {ref.referredSubStatus === "trialing" ? "on trial" : ref.referredSubStatus}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                    <div>
                      {ref.referredUserEmail && (
                        <>
                          <span className="font-semibold text-gray-600">Email:</span>{" "}
                          {ref.referredUserEmail}
                        </>
                      )}
                      {ref.promotionShareText && (
                        <>
                          {" "}·{" "}
                          <span className="font-semibold text-gray-600">Campaign:</span>{" "}
                          {ref.promotionShareText}
                        </>
                      )}
                    </div>
                    <div>
                      {ref.redeemedAt && (
                        <>
                          <span className="font-semibold text-gray-600">Redeemed:</span>{" "}
                          {new Date(ref.redeemedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </>
                      )}
                      {ref.confirmedAt && (
                        <>
                          {" "}·{" "}
                          <span className="font-semibold text-gray-600">Confirmed:</span>{" "}
                          {new Date(ref.confirmedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </>
                      )}
                    </div>
                    {/* 7-day countdown for PENDING referrals */}
                    {ref.status === "PENDING" && ref.daysUntilReward != null && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <Clock className="h-3 w-3" />
                        {ref.daysUntilReward > 0
                          ? `Reward applies in ${ref.daysUntilReward} day${ref.daysUntilReward !== 1 ? "s" : ""} if they stay subscribed`
                          : "Reward processing — will be applied on their next billing event"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rewards earned */}
                <div className="flex items-center gap-2">
                  {ref.referrerMessages > 0 && (
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600">
                      +{ref.referrerMessages} msgs
                    </span>
                  )}
                  {ref.referrerPages > 0 && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                      +{ref.referrerPages} pages
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > limit && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span>
            Showing {offset + 1}-{Math.min(offset + referrals.length, pagination.total)} of{" "}
            {pagination.total}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={offset === 0}
              onClick={() => fetchReferrals(Math.max(0, offset - limit))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={!pagination.hasMore}
              onClick={() => fetchReferrals(offset + limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

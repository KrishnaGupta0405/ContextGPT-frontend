"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CheckCircle, Clock, MessageSquare, FileText } from "lucide-react";

export const ReferralStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/referrals/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch referral stats:", error);
      toast.error("Failed to fetch referral statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-7 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-6 text-center text-sm text-gray-400 italic">
        No referral data available.
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Referrals",
      value: stats.totalReferrals || 0,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Successful",
      value: stats.successfulReferrals || 0,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Pending",
      value: stats.pendingReferrals || 0,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Messages Earned",
      value: stats.totalMessagesEarned || 0,
      icon: MessageSquare,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Pages Earned",
      value: stats.totalPagesEarned || 0,
      icon: FileText,
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className={`rounded-md p-1.5 ${card.color}`}>
              <card.icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium text-gray-500">{card.label}</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

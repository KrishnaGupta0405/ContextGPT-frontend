"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, Users, Zap, Tag, Copy, Check } from "lucide-react";

export const AvailablePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get("/website/referral-promotions");
        if (response.data.success) {
          setPromotions(response.data.data.promotions);
        }
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="min-w-[260px] rounded-lg border bg-white p-4 shadow-sm"
          >
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="mb-2 h-3 w-full" />
            <Skeleton className="mb-2 h-3 w-3/4" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (promotions.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {promotions.map((promo) => (
        <div
          key={promo.id}
          className="min-w-[300px] flex-shrink-0 flex flex-col rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-semibold text-gray-800">
                {promo.description}
              </span>
            </div>
            {promo.isActive && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                Active
              </span>
            )}
          </div>
          
          <p className="mb-3 text-xs italic text-gray-600 line-clamp-2" title={promo.promotionShareText}>
            "{promo.promotionShareText}"
          </p>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {promo.messageAdded > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                <Zap className="h-3 w-3" />+{promo.messageAdded} msgs
              </span>
            )}
            {promo.pagesAdded > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                +{promo.pagesAdded} pages
              </span>
            )}
            {promo.signupMessagesBonus > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                Signup: +{promo.signupMessagesBonus} msgs
              </span>
            )}
            {promo.signupPagesBonus > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700">
                Signup: +{promo.signupPagesBonus} pages
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              <Users className="h-3 w-3" />
              {promo.rewardTarget === "BOTH"
                ? "Both"
                : promo.rewardTarget === "REFERRER"
                  ? "Referrer"
                  : "Referred"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              <Tag className="h-3 w-3" />
              {promo.cycleType === "MONTHLY" ? "Monthly" : "Lifetime"}
            </span>
          </div>

          <p className="mb-2 text-[10px] leading-relaxed text-gray-500 mt-auto">
            Target: {promo.targetAudience === "NEW_USERS" ? "New users only" : "All users"}
          </p>

          <div 
            className="mt-2 border-t border-gray-100 pt-3 cursor-pointer" 
            onClick={() => handleCopy(promo.promoCode)}
          >
            <div className="flex items-center justify-between rounded bg-gray-100/80 px-2 py-1.5 transition-colors hover:bg-gray-200">
              <p className="font-mono text-[10px] text-gray-500 truncate mr-2 select-all">
                Promo Code: {promo.promoCode}
              </p>
              <button
                className="rounded text-gray-500 hover:text-gray-800 focus:outline-none"
                title="Copy Promo Code"
              >
                {copiedId === promo.promoCode ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

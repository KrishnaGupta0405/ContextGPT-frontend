"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Zap, Tag, ChevronRight, Package } from "lucide-react";
import api from "@/lib/axios";

const ADDON_ICONS = {
  remove_branding: Tag,
  extra_messages_5k: Zap,
};

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  expired: "bg-slate-100 text-slate-500 border border-slate-200",
  refunded: "bg-red-50 text-red-600 border border-red-200",
};

const STATUS_LABELS = {
  active: "Active",
  expired: "Expired",
  refunded: "Refunded",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * ActiveAddOns — shown on the billing page.
 * Lists the user's purchased add-ons with status, period, and carry-forward info.
 */
export default function ActiveAddOns() {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyAddOns = async () => {
      try {
        const res = await api.get("/billing/addons/my-addons");
        if (res.data?.success) {
          setAddOns(res.data.data.addOns || []);
        }
      } catch {
        // Not logged in or error — show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchMyAddOns();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-semibold text-slate-900">Add-Ons</h2>
        <p className="mt-0.5 text-sm text-slate-500">Your purchased add-ons and their status.</p>
      </div>

      {addOns.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Package className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-700">No add-ons purchased yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Browse available add-ons on the{" "}
            <a href="/pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-700">
              pricing page
            </a>
            .
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {addOns.map((ua) => {
            const identifier = ua.addOn?.identifier;
            const Icon = ADDON_ICONS[identifier] || Zap;
            const statusStyle = STATUS_STYLES[ua.status] || STATUS_STYLES.expired;
            const statusLabel = STATUS_LABELS[ua.status] || ua.status;
            const isMessageAddon = identifier === "extra_messages_5k";

            return (
              <li key={ua.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Left: icon + title + dates */}
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {ua.addOn?.title || "Add-On"}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyle}`}>
                        {statusLabel}
                      </span>
                      {ua.addOn?.type && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                          {ua.addOn.type}
                        </span>
                      )}
                    </div>

                    {/* Period dates */}
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatDate(ua.periodStart)} — {formatDate(ua.periodEnd)}
                    </p>

                    {/* Drip progress for yearly add-ons */}
                    {ua.dripsTotal > 1 && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        Monthly credits: {ua.dripsDelivered} / {ua.dripsTotal}
                        {ua.nextDripAt && ua.status === "active" && (
                          <> &middot; Next drip: {formatDate(ua.nextDripAt)}</>
                        )}
                      </p>
                    )}

                    {/* Carry-forward for message add-ons */}
                    {isMessageAddon && ua.status === "active" && (
                      <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2">
                        <p className="text-xs font-medium text-blue-700">
                          Bonus messages this cycle:{" "}
                          <span className="font-bold">{(ua.currentMonthBonus || 0).toLocaleString()}</span>
                        </p>
                        {Number(ua.carryForward) > 0 && (
                          <p className="mt-0.5 text-xs text-blue-600">
                            Carried forward:{" "}
                            <span className="font-semibold">{Number(ua.carryForward).toLocaleString()}</span>{" "}
                            from last month
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: price */}
                {ua.addOn?.price && (
                  <div className="ml-12 shrink-0 text-right sm:ml-0">
                    <span className="text-sm font-semibold text-slate-900">
                      ${parseFloat(ua.addOn.price).toFixed(2)}
                    </span>
                    <span className="ml-1 text-xs text-slate-500">
                      {ua.addOn?.type === "Yearly" ? "/ year" : "/ month"}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

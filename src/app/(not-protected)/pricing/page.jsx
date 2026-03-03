"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Check, Shield, Zap, Box, Loader2, Rocket } from "lucide-react";

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/billing/plans");
        if (response.data.success) {
          setPlans(response.data.data.plans);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      window.Paddle?.Environment.set("sandbox");
      window.Paddle?.Setup({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN, // Replace with your client-side token env var
      });
      console.log("Paddle initialized in sandbox mode");
    };
    document.body.appendChild(script);
    console.log("Paddle script loaded");
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (plan) => {
    const planName = getPlanName(plan.type);
    if (
      planName === "Enterprise" ||
      !plan.price ||
      parseFloat(plan.price) === 0
    ) {
      window.location.href = "mailto:sales@yourdomain.com";
      return;
    }
    try {
      // window.Paddle?.Environment.set("sandbox");
      window.Paddle?.Setup({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      });
      console.log("Paddle price id-> ", plan.paddlePriceId);
      console.log(
        "paddle client-side-token-> ",
        process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      );
      const response = await api.post("/billing/checkout/create", {
        subscriptionId: plan.id,
      });
      const { transactionId } = response.data.data;
      window.Paddle?.Checkout.open({ transactionId });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const getIcon = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("starter") || t.includes("free") || t.includes("solo"))
      return <Box className="h-5 w-5 text-blue-600" />;
    if (t.includes("growth") || t.includes("pro") || t.includes("team"))
      return <Rocket className="h-5 w-5 text-blue-600" />;
    if (t.includes("scale") || t.includes("business"))
      return <Zap className="h-5 w-5 text-blue-600" />;
    if (t.includes("enterprise") || t.includes("custom"))
      return <Shield className="h-5 w-5 text-blue-600" />;
    return <Box className="h-5 w-5 text-blue-600" />;
  };

  const getPlanName = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("starter") || t.includes("free") || t.includes("solo"))
      return "Starter";
    if (t.includes("growth") || t.includes("pro") || t.includes("team"))
      return "Growth";
    if (t.includes("scale") || t.includes("business")) return "Scale";
    if (t.includes("enterprise") || t.includes("custom")) return "Enterprise";
    return type;
  };

  const currentInterval = isYearly ? "yearly" : "monthly";

  // Filter out plans that don't match the interval
  const validPlans = plans.filter((p) => p.billingInterval === currentInterval);

  // Group by plan name to deal with potential legacy plans like "PRO" (if it matches interval) vs "pri_growth_monthly"
  const planMap = new Map();
  validPlans.forEach((p) => {
    const name = getPlanName(p.type);
    if (!planMap.has(name) || p.type.includes("pri_")) {
      planMap.set(name, p);
    }
  });

  const displayedPlans = Array.from(planMap.values()).sort((a, b) => {
    const order = { Starter: 1, Growth: 2, Scale: 3, Enterprise: 4 };
    const rankA = order[getPlanName(a.type)] || 99;
    const rankB = order[getPlanName(b.type)] || 99;

    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return parseFloat(a.price || 0) - parseFloat(b.price || 0);
  });

  return (
    <div className="min-h-screen bg-white p-4 font-sans text-slate-900 md:p-8 lg:p-12">
      <div className="mx-auto mt-10 max-w-5xl">
        {/* Header & Toggle */}
        <div className="mb-16 flex flex-col items-center">
          <div className="relative mb-10 flex w-full items-center justify-center">
            <div className="relative flex items-center gap-4">
              <span
                className={`text-lg font-semibold transition-colors ${
                  !isYearly ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Pay Monthly
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isYearly}
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-emerald-500 transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isYearly ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-lg font-semibold transition-colors ${
                  isYearly ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Pay Yearly
              </span>

              {/* Save 40% annotation */}
              <div className="absolute top-1/2 -right-[120px] hidden -translate-y-1/2 items-center md:flex">
                <svg
                  width="45"
                  height="35"
                  viewBox="0 0 60 40"
                  fill="none"
                  className="-mt-2 stroke-current text-blue-600"
                >
                  <path
                    d="M 50,30 C 60,10 30,10 40,30 C 45,40 15,25 15,25"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 15,25 L 25,18 M 15,25 L 23,33"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mb-2 ml-1 font-bold text-blue-600">
                  Save 40%
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : displayedPlans.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            No pricing plans available.
          </div>
        ) : (
          <div className="flex w-full flex-col gap-6 pb-10">
            {displayedPlans.map((plan, i) => {
              const isGrowth =
                plan.type.toLowerCase().includes("growth") ||
                plan.type.toLowerCase() === "pro";
              const isEnterprise = plan.type
                .toLowerCase()
                .includes("enterprise");
              const isCustom =
                isEnterprise || !plan.price || parseFloat(plan.price) === 0;
              const monthlyPrice = isCustom ? 0 : parseFloat(plan.price || 0);
              const yearlyPrice = monthlyPrice * 12;

              const featuresList = [
                {
                  label: `${plan.chatbotGiven === -1 || plan.chatbotGiven > 99999 ? "Up to 10,000" : plan.chatbotGiven === 1 ? "1" : "Up to " + plan.chatbotGiven.toLocaleString()} chatbot${plan.chatbotGiven === 1 ? "" : "s"}`,
                  included: plan.chatbotGiven > 0 || plan.chatbotGiven === -1,
                  highlightColor: "text-slate-600 font-medium",
                },
                {
                  label: `Up to ${plan.userMessageRateLimit === -1 || plan.userMessageRateLimit > 99999 ? "Customizable message volume" : plan.userMessageRateLimit >= 1000 ? plan.userMessageRateLimit / 1000 + "k messages per month" : plan.userMessageRateLimit + " messages per month"}`,
                  included:
                    plan.userMessageRateLimit > 0 ||
                    plan.userMessageRateLimit === -1,
                  highlightColor: "text-slate-600 font-medium",
                },
                {
                  label: `Up to ${plan.pagesUpto === -1 || plan.pagesUpto > 99999 ? "500,000" : plan.pagesUpto.toLocaleString()} pages`,
                  included: plan.pagesUpto > 0 || plan.pagesUpto === -1,
                  highlightColor: "text-slate-600 font-medium",
                },
                {
                  label: plan.autoSyncData
                    ? "Auto Refresh (Daily)"
                    : "Manual Refresh",
                  included: true,
                  highlightColor:
                    plan.autoSyncData && isEnterprise
                      ? "text-emerald-600 font-bold"
                      : plan.autoSyncData
                        ? "text-blue-600 font-bold"
                        : "text-slate-600 font-medium",
                  underlineDisabled: true,
                },
                {
                  label: `${plan.teamMemberAccess === -1 || plan.teamMemberAccess > 99999 ? "Up to 10,000" : plan.teamMemberAccess === 1 ? "1" : "Up to " + plan.teamMemberAccess.toLocaleString()} team member${plan.teamMemberAccess === 1 ? "" : "s"}`,
                  included:
                    plan.teamMemberAccess > 0 || plan.teamMemberAccess === -1,
                  highlightColor:
                    plan.teamMemberAccess > 1
                      ? "text-slate-900 font-bold"
                      : "text-slate-600 font-medium",
                },
                {
                  label: "Integrations with multiple platforms",
                  included:
                    isGrowth ||
                    plan.type.toLowerCase().includes("scale") ||
                    isEnterprise,
                  highlightColor: "text-slate-900 font-bold",
                },
                {
                  label: "API Access",
                  included: plan.apiAccess,
                  highlightColor: "text-slate-900 font-bold",
                },
                {
                  label: "Rate Limiting",
                  included:
                    plan.userMessageRateLimit > 0 &&
                    (isGrowth ||
                      plan.type.toLowerCase().includes("scale") ||
                      isEnterprise),
                  highlightColor: "text-slate-900 font-bold",
                },
                {
                  label:
                    plan.autoSyncData && isGrowth
                      ? "Auto Refresh (Monthly)"
                      : plan.autoSyncData &&
                          plan.type.toLowerCase().includes("scale")
                        ? "Auto Refresh (Weekly)"
                        : plan.autoSyncData && isEnterprise
                          ? "Priority Support"
                          : null,
                  included:
                    plan.autoSyncData &&
                    (isGrowth ||
                      plan.type.toLowerCase().includes("scale") ||
                      isEnterprise),
                  highlightColor: isEnterprise
                    ? "text-emerald-600 font-bold"
                    : "text-blue-600 font-bold",
                  underlineDisabled: true,
                },
                {
                  label: plan.type.toLowerCase().includes("scale")
                    ? "Auto Scan (Daily)"
                    : isEnterprise
                      ? "Webhook Support"
                      : null,
                  included:
                    plan.type.toLowerCase().includes("scale") || isEnterprise,
                  highlightColor: "text-blue-600 font-bold",
                  underlineDisabled: true,
                },
                {
                  label: isEnterprise
                    ? "Custom Integrations"
                    : "Webhook Support",
                  included:
                    plan.webhookSupport &&
                    (plan.type.toLowerCase().includes("scale") || isEnterprise),
                  highlightColor: isEnterprise
                    ? "text-emerald-600 font-bold"
                    : "text-blue-600 font-bold",
                  underlineDisabled: true,
                },
              ];

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col gap-8 rounded-2xl border border-blue-100 bg-[#fbfbfe] p-8 transition-shadow hover:shadow-md md:flex-row`}
                >
                  <div className="flex w-full flex-shrink-0 flex-col md:w-[260px] lg:w-[300px]">
                    <div className="mb-4 flex items-center gap-3">
                      {getIcon(plan.type)}
                      <h3 className="text-xl font-bold tracking-tight text-slate-800 capitalize">
                        {getPlanName(plan.type)}
                      </h3>
                    </div>

                    <div className="my-2 flex flex-col">
                      {isCustom ? (
                        <span className="text-[40px] leading-none font-extrabold tracking-tight text-slate-900">
                          Custom
                        </span>
                      ) : (
                        <>
                          <div className="flex items-end gap-1">
                            <span className="text-[40px] leading-none font-extrabold tracking-tight text-slate-900">
                              ${monthlyPrice}
                            </span>
                            <span className="mb-1 text-lg font-medium text-slate-500">
                              /mo
                            </span>
                          </div>
                          {isYearly && (
                            <p className="mt-1 text-[15px] text-slate-600">
                              billed{" "}
                              <span className="font-bold text-slate-900">
                                ${yearlyPrice}
                              </span>{" "}
                              yearly
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan)}
                      className={`mt-6 w-[220px] rounded-lg py-2.5 text-[14px] font-semibold transition-all ${
                        isGrowth
                          ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
                          : "border border-blue-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {isCustom ? "Contact us" : "Start a free trial"}
                    </button>
                  </div>

                  {/* Features Column */}
                  <div className="flex w-full flex-col border-t border-slate-200 pt-6 md:ml-4 md:border-t-0 md:pt-0 lg:ml-12">
                    <p className="mb-5 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                      INCLUDES:
                    </p>
                    <div className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-2">
                      {featuresList.map((feature, idx) => {
                        if (!feature.label || !feature.included) return null;
                        return (
                          <div
                            key={idx}
                            className="group flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <Check
                                className="h-4 w-4 flex-shrink-0 text-blue-600"
                                strokeWidth={2.5}
                              />
                              <span
                                className={`text-[15px] ${feature.highlightColor} ${!feature.underlineDisabled ? "underline decoration-slate-400 decoration-dotted underline-offset-4" : ""}`}
                                style={
                                  !feature.underlineDisabled
                                    ? { textDecorationStyle: "dotted" }
                                    : {}
                                }
                              >
                                {feature.label}
                              </span>
                            </div>
                            <div className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-300 text-[9px] text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-500">
                              i
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

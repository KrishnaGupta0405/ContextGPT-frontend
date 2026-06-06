"use client";

import React, { useState } from "react";
import { Check, Zap, Box, Rocket, Shield, Star } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 39,
    yearlyPrice: 29,
    baseCredits: 1000,
    chatbots: 1,
    pages: 5000,
    teamMembers: 1,
    description: "For solo founders and small sites getting started.",
    icon: Box,
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 79,
    yearlyPrice: 59,
    baseCredits: 5000,
    chatbots: 3,
    pages: 50000,
    teamMembers: 10,
    description: "For growing businesses that need more power.",
    icon: Rocket,
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 259,
    yearlyPrice: 199,
    baseCredits: 20000,
    chatbots: 10,
    pages: 500000,
    teamMembers: 50,
    description: "For teams that need more chatbots, members, and automation.",
    icon: Zap,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    baseCredits: null,
    chatbots: null,
    pages: null,
    teamMembers: null,
    description: "Custom volume, limits, and compliance pricing.",
    icon: Shield,
  },
];

const MODELS = [
  {
    id: "gpt41mini",
    label: "GPT-4.1 mini",
    multiplier: 1,
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    badge: "Best Value",
    badgeColor: "#065f46",
    badgeBg: "#d1fae5",
    description: "Fastest & most messages",
  },
  {
    id: "gpt41",
    label: "GPT-4.1",
    multiplier: 2,
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#93c5fd",
    badge: "2× per msg",
    badgeColor: "#1e40af",
    badgeBg: "#dbeafe",
    description: "Balanced speed & quality",
  },
  {
    id: "gemini",
    label: "Gemini 2.0",
    multiplier: 2,
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    badge: "2× per msg",
    badgeColor: "#5b21b6",
    badgeBg: "#ede9fe",
    description: "Google's multimodal model",
  },
  {
    id: "claude",
    label: "Claude 3.5",
    multiplier: 4,
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fcd34d",
    badge: "4× per msg",
    badgeColor: "#92400e",
    badgeBg: "#fef3c7",
    description: "Most capable reasoning",
  },
];

const fmt = (n) => n?.toLocaleString() ?? "—";

export default function Calculator() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [isYearly, setIsYearly] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);

  const price = selectedPlan.monthlyPrice
    ? isYearly
      ? selectedPlan.yearlyPrice
      : selectedPlan.monthlyPrice
    : null;

  const yearlyTotal = selectedPlan.yearlyPrice ? selectedPlan.yearlyPrice * 12 : null;

  const messagesPerMonth =
    selectedPlan.baseCredits
      ? Math.floor(selectedPlan.baseCredits / selectedModel.multiplier)
      : null;

  const features = selectedPlan.baseCredits
    ? [
        {
          label: `${fmt(messagesPerMonth)} messages / month`,
          highlight: true,
        },
        { label: `${fmt(selectedPlan.chatbots)} chatbot${selectedPlan.chatbots === 1 ? "" : "s"}` },
        { label: `Up to ${fmt(selectedPlan.pages)} pages` },
        { label: `${fmt(selectedPlan.teamMembers)} team member${selectedPlan.teamMembers === 1 ? "" : "s"}` },
      ]
    : [
        { label: "Custom message volume" },
        { label: "Custom chatbots" },
        { label: "Custom pages" },
        { label: "Dedicated support" },
      ];

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "48px 16px 80px",
      }}
    >
      This is static info, not being fetched, need to fix it, make the useEffect from the PricinfSection to main page and from there pass the props
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 48px" }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#3b82f6",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Pricing Calculator
        </p>
        <h1
          style={{
            fontSize: "clamp(28px,5vw,42px)",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.2,
            margin: "0 0 16px",
          }}
        >
          How many messages do you actually get?
        </h1>
        <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6 }}>
          It depends on which model you pick. Claude is 4× more expensive per
          message, while GPT-4.1 mini gives you the most messages on the same
          plan. Pick yours below.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 28,
          maxWidth: 1060,
          margin: "0 auto",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ flex: "1 1 560px", display: "flex", flexDirection: "column", gap: 32 }}>
          {/* STEP 1 */}
          <Section number="1" title="Pick a plan">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                const active = selectedPlan.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    style={{
                      border: active ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "14px 16px",
                      background: active ? "#eff6ff" : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.18s",
                      position: "relative",
                    }}
                  >
                    {plan.popular && (
                      <span
                        style={{
                          position: "absolute",
                          top: -10,
                          left: 12,
                          background: "#3b82f6",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 20,
                          padding: "2px 8px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        POPULAR
                      </span>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Icon
                        size={14}
                        style={{ color: active ? "#3b82f6" : "#94a3b8", flexShrink: 0 }}
                      />
                      <span style={{ fontWeight: 700, fontSize: 14, color: active ? "#1d4ed8" : "#1e293b" }}>
                        {plan.name}
                      </span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: active ? "#2563eb" : "#0f172a" }}>
                      {plan.monthlyPrice ? `$${plan.monthlyPrice}/mo` : "Custom"}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, lineHeight: 1.4 }}>
                      {plan.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* STEP 2 */}
          <Section number="2" title="Choose billing cycle">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <CycleBtn active={!isYearly} onClick={() => setIsYearly(false)}>
                Monthly
              </CycleBtn>
              <CycleBtn active={isYearly} onClick={() => setIsYearly(true)}>
                Yearly
              </CycleBtn>
              {isYearly && (
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 20,
                    padding: "4px 12px",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  Save ~25% yearly
                </span>
              )}
            </div>
          </Section>

          {/* STEP 3 */}
          <Section number="3" title="Select your AI model">
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
              Each model consumes a different number of credits per message.
              Choose one model for your chatbots — you can change this anytime
              from your dashboard.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
              {MODELS.map((model) => {
                const active = selectedModel.id === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    style={{
                      border: `2px solid ${active ? model.color : "#e2e8f0"}`,
                      borderRadius: 12,
                      padding: "14px 16px",
                      background: active ? model.bg : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.18s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: active ? model.color : "#1e293b",
                        }}
                      >
                        {model.label}
                      </span>
                      <span
                        style={{
                          background: model.badgeBg,
                          color: model.badgeColor,
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 8,
                          padding: "2px 7px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {model.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{model.description}</div>
                    {active && selectedPlan.baseCredits && (
                      <div
                        style={{
                          marginTop: 10,
                          borderTop: `1px solid ${model.border}`,
                          paddingTop: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          color: model.color,
                        }}
                      >
                        ≈{" "}
                        {fmt(
                          Math.floor(selectedPlan.baseCredits / model.multiplier)
                        )}{" "}
                        messages / mo
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Comparison strip */}
            <div
              style={{
                marginTop: 16,
                background: "#f1f5f9",
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {MODELS.map((m) => {
                const msgs = selectedPlan.baseCredits
                  ? Math.floor(selectedPlan.baseCredits / m.multiplier)
                  : null;
                const active = m.id === selectedModel.id;
                return (
                  <div
                    key={m.id}
                    style={{
                      flex: "1 1 120px",
                      background: active ? "#fff" : "transparent",
                      border: active ? `1.5px solid ${m.color}` : "1.5px solid transparent",
                      borderRadius: 8,
                      padding: "8px 10px",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: active ? m.color : "#475569" }}>
                      {msgs ? fmt(msgs) : "Custom"}
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>messages / mo</div>
                  </div>
                );
              })}
            </div>

            <p style={{ marginTop: 12, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
              You can switch models anytime from your billing settings. Each
              "message" counts both the user's question and the AI's reply.
            </p>
          </Section>
        </div>

        {/* RIGHT SUMMARY PANEL */}
        <div
          style={{
            flex: "0 1 300px",
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #e2e8f0",
            padding: "24px 22px",
            position: "sticky",
            top: 24,
            boxShadow: "0 4px 24px 0 rgba(15,23,42,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 4,
            }}
          >
            <span
              style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}
            >
              {selectedPlan.name}
            </span>
            {isYearly && (
              <span
                style={{
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 20,
                  padding: "2px 8px",
                  letterSpacing: "0.05em",
                }}
              >
                YEARLY
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
            {selectedPlan.description}
          </p>

          {/* Price */}
          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f1f5f9" }}>
            {price ? (
              <>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
                    ${price}
                  </span>
                  <span style={{ fontSize: 15, color: "#94a3b8", marginBottom: 4 }}>/mo</span>
                </div>
                {isYearly && yearlyTotal && (
                  <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                    billed{" "}
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>
                      ${yearlyTotal}
                    </span>{" "}
                    yearly
                  </p>
                )}
              </>
            ) : (
              <span style={{ fontSize: 36, fontWeight: 900, color: "#0f172a" }}>Custom</span>
            )}
          </div>

          {/* Message Quota */}
          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f1f5f9" }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#94a3b8",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Message Quota
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Model</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: selectedModel.color }}>
                {selectedModel.label}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Credits / month</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                {fmt(selectedPlan.baseCredits) ?? "Custom"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Cost per message</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                {selectedModel.multiplier}× credit{selectedModel.multiplier > 1 ? "s" : ""}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#eff6ff",
                borderRadius: 8,
                padding: "10px 12px",
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e40af" }}>
                Total per month
              </span>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#2563eb" }}>
                {messagesPerMonth ? fmt(messagesPerMonth) : "Custom"}
              </span>
            </div>
          </div>

          {/* Plan Limits */}
          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f1f5f9" }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#94a3b8",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Plan Limits
            </p>
            {[
              { label: "Chatbots", value: selectedPlan.chatbots },
              { label: "Pages", value: selectedPlan.pages },
              { label: "Team members", value: selectedPlan.teamMembers },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}
              >
                <span style={{ fontSize: 13, color: "#64748b" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                  {item.value ? fmt(item.value) : "Custom"}
                </span>
              </div>
            ))}
          </div>

          {/* Included features */}
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#94a3b8",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              What's Included
            </p>
            {features.map((f, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}
              >
                <Check size={13} style={{ color: "#3b82f6", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: f.highlight ? "#1d4ed8" : "#475569", fontWeight: f.highlight ? 700 : 400 }}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          {selectedPlan.monthlyPrice ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                <span>Trial price</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                  {isYearly && yearlyTotal ? `$${yearlyTotal}/yr` : `$${price}/mo`}
                </span>
              </div>
              <a
                href="/pricing"
                style={{
                  display: "block",
                  width: "100%",
                  background: "#2563eb",
                  color: "#fff",
                  textAlign: "center",
                  padding: "13px 0",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  transition: "background 0.18s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#1d4ed8")}
                onMouseLeave={(e) => (e.target.style.background = "#2563eb")}
              >
                Start free trial on {selectedPlan.name}
              </a>
              <p style={{ marginTop: 10, fontSize: 11, color: "#94a3b8", textAlign: "center", lineHeight: 1.5 }}>
                Need more messages or custom volume? Add credits anytime from
                your billing page.
              </p>
            </>
          ) : (
            <a
              href="mailto:sales@contextgpt.ai"
              style={{
                display: "block",
                width: "100%",
                background: "#0f172a",
                color: "#fff",
                textAlign: "center",
                padding: "13px 0",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Contact Sales
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#eff6ff",
            border: "2px solid #bfdbfe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            color: "#2563eb",
            flexShrink: 0,
          }}
        >
          {number}
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function CycleBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 20px",
        borderRadius: 8,
        border: active ? "2px solid #3b82f6" : "2px solid #e2e8f0",
        background: active ? "#eff6ff" : "#fff",
        color: active ? "#2563eb" : "#64748b",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}
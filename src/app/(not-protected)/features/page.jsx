"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import DemoPage from "@/app/(not-protected)/demo/page";
import FAQSection from "@/app/(not-protected)/landing/FAQSection";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
// ─── Feature Data ───────────────────────────────────────────────────────────

const FEATURE_CATEGORIES = [
  {
    id: "training",
    label: "Training & Customization",
    description:
      "Train your AI chatbot on your specific content and fine-tune its behavior, tone, and response style to match your brand.",
    icon: "🧠",
    features: [
      {
        icon: "📄",
        title: "Import Training Content",
        description:
          "Upload PDFs, Word docs, CSVs, or paste raw text. ContextGPT ingests and indexes your data instantly.",
      },
      {
        icon: "🌐",
        title: "Globe Scraping",
        description:
          "Automatically crawl and sync your website or documentation URLs so your bot always has the latest content.",
      },
      {
        icon: "🔗",
        title: "CRM Integrations (API)",
        description:
          "Connect your CRM, helpdesk, or internal wiki via API to pull in structured knowledge automatically.",
      },
      {
        icon: "📊",
        title: "Salesforce Data",
        description:
          "Sync contacts, cases, and knowledge articles directly from Salesforce into your AI training set.",
      },
      {
        icon: "🎨",
        title: "Customize Appearance",
        description:
          "Match your brand with custom colors, logos, fonts, and chat widget styles without writing a single line of CSS.",
      },
      {
        icon: "⚙️",
        title: "Persona & Instructions",
        description:
          "Define the bot's name, personality, tone, and hard rules so every response stays on-brand and on-policy.",
      },
    ],
  },
  {
    id: "chat",
    label: "Chat Interactions",
    description:
      "Deliver seamless, intelligent conversations across every channel your customers already use.",
    icon: "💬",
    features: [
      {
        icon: "🤖",
        title: "Collect Feedback",
        description:
          "Let users rate and flag answers in real time so you can continuously improve accuracy.",
      },
      {
        icon: "🔍",
        title: "Cited Sources",
        description:
          "Every answer links back to the source document or URL, building trust and enabling quick verification.",
      },
      {
        icon: "🔀",
        title: "Escalation to WhatsApp",
        description:
          "Seamlessly hand off complex queries to a live agent directly within WhatsApp without losing context.",
      },
      {
        icon: "🌍",
        title: "Language Support",
        description:
          "Automatically detect and respond in 100+ global languages so no customer is left behind.",
      },
      {
        icon: "📬",
        title: "Lead Collection",
        description:
          "Capture names, emails, and custom fields mid-conversation and push them straight to your CRM.",
      },
    ],
  },
  {
    id: "extensions",
    label: "Extensions",
    description:
      "Extend ContextGPT's reach with powerful add-ons that go beyond basic Q&A.",
    icon: "🧩",
    features: [
      {
        icon: "📡",
        title: "API",
        description:
          "Programmatically query your bot, manage training data, and retrieve analytics via our REST API.",
      },
      {
        icon: "🔌",
        title: "The AI Connector",
        description:
          "Bridge ContextGPT with any third-party service — CRMs, ticketing systems, e-commerce platforms, and more.",
      },
      {
        icon: "⚡",
        title: "Automation",
        description:
          "Trigger workflows, send notifications, or update records automatically based on conversation events.",
      },
      {
        icon: "🔗",
        title: "Integrations",
        description:
          "Native plug-ins for Slack, Intercom, HubSpot, Zendesk, and dozens of other platforms — no code required.",
      },
    ],
  },
  {
    id: "security",
    label: "Security & Compliance",
    description:
      "Enterprise-grade security and compliance so your data stays protected and your team stays audit-ready.",
    icon: "🔒",
    features: [
      {
        icon: "🛡️",
        title: "SOC 2 Report",
        description:
          "Independent SOC 2 Type II certification confirms our security controls meet the highest industry standards.",
      },
      {
        icon: "🇪🇺",
        title: "GDPR Compliance",
        description:
          "Full data residency controls, consent management, and DPA agreements to keep you compliant in Europe.",
      },
      {
        icon: "🔒",
        title: "Fine-grained Access",
        description:
          "Role-based permissions, SSO, and audit logs give you granular control over who sees what.",
      },
      {
        icon: "📋",
        title: "Data Subprocessors",
        description:
          "Full transparency on every third-party vendor we use to process your data, updated in real time.",
      },
      {
        icon: "🔄",
        title: "Subprocess Process",
        description:
          "Documented data flows and retention policies so your security team always knows where data lives.",
      },
      {
        icon: "📜",
        title: "Data Processing Agreement",
        description:
          "Sign a legally binding DPA directly within the platform in minutes, no legal back-and-forth required.",
      },
    ],
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
        {icon}
      </div>
      <h4 className="mb-1 text-sm font-semibold text-slate-900">{title}</h4>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

function CategorySection({ category }) {
  return (
    <section className="border-t border-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
          {/* Left label */}
          <div>
            <div className="mb-3 text-3xl">{category.icon}</div>
            <h3 className="text-2xl font-bold text-slate-900">
              {category.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              {category.description}
            </p>
          </div>

          {/* Right cards grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {category.features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Features() {
  return (
    <div className="bg-white text-slate-900">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.2}
          duration={2}
          repeatDelay={1}
          height={60}
          width={60}
          className={cn(
            "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-80%] h-[200%] skew-y-12"
          )}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 to-white" />
        <div className="mx-auto max-w-6xl text-center p-20 -mb-40">
          <h2 className="mt-6 text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl lg:text-[4rem] lg:leading-tight">
            <span
              className="underline underline-offset-4 decoration-dotted decoration-indigo-500 cursor-pointer hover:text-indigo-600 transition-colors"
              style={{ fontWeight: 700 }}
            >
              Direct Integrations{" "}
            </span>
            with your
            <br /> favorite tools
          </h2>
          <h3 className="mx-auto mt-6 max-w-2xl text-xl text-slate-600">
            Let ContextGPT answer support questions over your customer&apos;s
            communication channels of choice.
          </h3>

          <div className="relative z-10 mt-12 flex flex-col items-center justify-center pb-8">
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {[
                "7-day risk-free trial",
                "Cancel at any time",
                "Tailored onboarding support",
                "Fair pricing that scales",
                "100+ global languages",
              ].map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-2 text-base font-medium text-slate-800"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
                  <span className="underline decoration-slate-400 decoration-dotted underline-offset-4">
                    {f}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-lg font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              Start a free trial
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-lg font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Feature Categories ─── */}
      <div className="mt-40">
        {FEATURE_CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>

      {/* ─── Demo Section ─── */}
      <section className="border-t border-slate-100">
        <DemoPage />
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="border-t border-slate-100 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <FAQSection />
        </div>
      </section>
    </div>
  );
}

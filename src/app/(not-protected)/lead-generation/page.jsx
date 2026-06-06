"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Clock,
  BarChart3,
  Calendar,
  UserCheck,
  MessageSquare,
  Check,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const FEATURES = [
  {
    icon: Zap,
    title: "5-Minute Setup",
    description:
      "InstantTrain technology gets your lead-gen chatbot live in minutes. Paste your URL and you're done.",
  },
  {
    icon: Clock,
    title: "24/7 Lead Capture",
    description:
      "Your chatbot never sleeps. Capture leads from every timezone, every hour of the day.",
  },
  {
    icon: UserCheck,
    title: "Lead Qualification",
    description:
      "Automatically qualify leads by budget, timeline, and needs before they reach your sales team.",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description:
      "Let qualified leads book meetings directly via Google Calendar, Outlook, Calendly, Cal.com, or HubSpot.",
  },
  {
    icon: MessageSquare,
    title: "Instant Response",
    description:
      "Answer prospect questions instantly with accurate, context-aware responses trained on your content.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Track conversion rates, popular questions, and lead quality with built-in analytics.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Train",
    description: "Point your chatbot at your website. It learns everything in minutes.",
  },
  {
    step: "2",
    title: "Capture",
    description: "Configure lead fields — email, phone, company, budget, or any custom field.",
  },
  {
    step: "3",
    title: "Qualify",
    description: "Set qualification criteria. Your chatbot asks the right questions automatically.",
  },
  {
    step: "4",
    title: "Convert",
    description: "Route qualified leads to your CRM or let them book a meeting on the spot.",
  },
];

export default function LeadGeneration() {
  return (
    <div className="bg-white text-slate-900">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 to-white" />
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            Turn Visitors into{" "}
            <span className="text-blue-600">Qualified Leads</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
          >
            Your AI chatbot captures, qualifies, and books meetings with leads
            24/7 &mdash; so your sales team wakes up to a full pipeline.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-10"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700"
            >
              Start Capturing Leads
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            How It Works
          </h2>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Built for Lead Generation
          </h2>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i % 3}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-16 text-center text-white shadow-2xl shadow-blue-600/20">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Fill Your Pipeline?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Start your free trial and have your lead-gen chatbot live in under
            5 minutes. No credit card required.
          </p>
          <div className="mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

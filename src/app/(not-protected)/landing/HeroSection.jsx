import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const features = [
  "7-day risk-free trial",
  "Cancel at any time",
  "Tailored onboarding support",
  "Fair pricing that scales",
  "100+ global languages",
];
export default function HeroSection() {
  return (
    <div>
      <section className="relative mb-12 overflow-hidden py-24 sm:py-32">
        <div className="w-full">
          <div className="grid grid-cols-1 items-center gap-12 text-left lg:grid-cols-2">
            {/* Left Side Content */}
            <div>
              <h1 className="text-5xl leading-[0.95] font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-6xl">
                Make <span className="text-blue-500">AI</span> agent your expert
                customer service, works{" "}
                <span className="text-blue-500"> 24/7</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
                The intelligence of LLMs like Chatgpt, Gemini, Anthropic
                personalized to your brand, answer visitors immediate, accurate
                answers based on your specific business data
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
                {features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-500" />
                    <span className="underline decoration-dotted underline-offset-2">
                      {f}
                    </span>
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
                >
                  Start a free trial
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
                >
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Right Side Icon Container */}
            <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-50">
              <img
                src="/icons/Contextgpt_icon.svg"
                alt="ContextGPT"
                className="h-64 w-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="mb-12">
        <TrustedBySection />
      </div>
    </div>
  );
}

import React from "react";
import {
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  Cpu,
  Box,
  Compass,
  Activity,
} from "lucide-react";

const companies = [
  { name: "Lumios", icon: <ShieldCheck className="h-8 w-8" /> },
  // { name: "Vertex", icon: <Zap className="w-8 h-8" /> },
  // { name: "Aether", icon: <Globe className="w-8 h-8" /> },
  // { name: "Nebula", icon: <Layers className="w-8 h-8" /> },
  { name: "Zenith", icon: <Cpu className="h-8 w-8" /> },
  { name: "Quantum", icon: <Box className="h-8 w-8" /> },
  { name: "Flux", icon: <Compass className="h-8 w-8" /> },
  // { name: "Echo", icon: <Activity className="w-8 h-8" /> },
];

function TrustedBySection() {
  return (
    <section className="">
      <div className="w-full">
        <p className="mb-12 text-center text-sm font-medium tracking-wide text-gray-400 uppercase">
          Trusted by <span className="font-bold text-gray-600">100+</span>{" "}
          Customers worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-15">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex cursor-default items-center gap-2 text-gray-400"
            >
              <div>{company.icon}</div>
              <span className="text-xl font-bold tracking-tight md:text-2xl">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

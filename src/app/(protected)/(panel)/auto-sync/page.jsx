import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";
import { Sparkles, Orbit } from "lucide-react";

export const metadata = {
  title: "Auto Sync | ContextGPT",
  description: "View your chatbot auto sync jobs.",
};

export default function AutoSync() {
  return (
    <div className="flex h-full flex-col">
      <PanelNavbar items={[{ label: "Auto Sync" }]} />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Auto Sync
          </h2>
          <p className="text-sm text-slate-500">
            Automate content synchronization for your chatbots
          </p>
        </div>

        <div className="mt-8 relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Decorative background elements */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-50/50 blur-3xl"></div>

          <div className="relative z-10 flex max-w-lg flex-col items-center text-center p-6">
            <div className="mb-8 relative mt-4">
              {/* Pulse effect rings */}
              <div className="absolute -inset-6 animate-pulse rounded-full bg-blue-50/80 blur-xl"></div>
              <div className="absolute -inset-2 animate-pulse rounded-full bg-indigo-100/60 blur-md delay-150"></div>
              
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-blue-100 bg-gradient-to-br from-white to-blue-50 shadow-lg">
                <Orbit className="h-12 w-12 text-blue-600 animate-[spin_10s_linear_infinite]" />
              </div>

              {/* Sparkle badge */}
              <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-yellow-200 bg-yellow-100 text-yellow-600 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <h3 className="mb-4 bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Coming Soon
            </h3>
            
            <p className="mb-8 text-base leading-relaxed text-slate-500">
              We're building a powerful auto-sync engine to keep your chatbot's knowledge base continuously up-to-date with your website, Notion, and other data sources.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Automated Crawling
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Scheduled Syncs
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                Real-time Webhooks
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

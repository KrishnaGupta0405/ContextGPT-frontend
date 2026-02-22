"use client";

import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";
import { ExternalLink, Plus } from "lucide-react";

const integrations = [
  {
    name: "Google Chat",
    url: "google.com",
    description:
      "Connect Google Chat with SiteGPT and chat with your bot directly from Google Chat.",
    iconColor: "bg-emerald-500",
    iconContent: (
      <div className="flex h-full w-full items-center justify-center bg-emerald-500 text-white">
        <span className="text-lg font-bold">G</span>
      </div>
    ),
  },
  {
    name: "Messenger",
    url: "messenger.com",
    description:
      "Connect Messenger with SiteGPT and chat with your bot directly from Messenger.",
    iconColor: "bg-blue-600",
    iconContent: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-blue-600 to-purple-500 text-white">
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.488 5.513 3.82 7.23V22l3.48-1.92c1.23.344 2.535.534 3.88.534 6.242 0 10-4.145 10-9.258C23.18 6.145 18.703 2 12 2Zm1.083 12.336-2.825-3.02-5.503 3.02 6.04-6.425 2.87 3.02 5.46-3.02-6.042 6.425Z" />
        </svg>
      </div>
    ),
  },
  {
    name: "Crisp",
    url: "crisp.chat",
    description:
      "Connect Crisp Chat with SiteGPT and chat with your bot directly from Crisp Chat.",
    iconColor: "bg-blue-500",
    iconContent: (
      <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
        <span className="text-lg font-bold">C</span>
      </div>
    ),
  },
  {
    name: "Slack",
    url: "slack.com",
    description:
      "Connect Slack Chat with SiteGPT and chat with your bot directly from Slack.",
    iconColor: "bg-transparent",
    iconContent: (
      <div className="flex h-full w-full items-center justify-center p-1 text-white">
        <svg viewBox="0 0 24 24" className="h-full w-full">
          <path
            fill="#E01E5A"
            d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"
          />
          <path
            fill="#E01E5A"
            d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
          />
          <path
            fill="#36C5F0"
            d="M8.834 5.042a2.528 2.528 0 0 1 2.521-2.52A2.528 2.528 0 0 1 13.876 5.042a2.527 2.527 0 0 1-2.521 2.52H8.834v-2.52z"
          />
          <path
            fill="#36C5F0"
            d="M8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
          />
          <path
            fill="#2EB67D"
            d="M18.956 8.835a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.835a2.527 2.527 0 0 1-2.522 2.52h-2.522v-2.52z"
          />
          <path
            fill="#2EB67D"
            d="M17.685 8.835a2.527 2.527 0 0 1-2.52-2.52 2.527 2.527 0 0 1 2.52-2.521V-0.002A2.528 2.528 0 0 1 20.207 2.52a2.528 2.528 0 0 1-2.522 2.521v6.314z"
          />
          <path
            fill="#ECB22E"
            d="M15.165 18.958a2.528 2.528 0 0 1-2.521 2.52 2.528 2.528 0 0 1-2.521-2.52a2.527 2.527 0 0 1 2.521-2.52h2.521v2.52z"
          />
          <path
            fill="#ECB22E"
            d="M15.165 17.687a2.527 2.527 0 0 1-2.521-2.521 2.527 2.527 0 0 1 2.521-2.52h6.313A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522-2.52h-6.313z"
          />
        </svg>
      </div>
    ),
  },
  {
    name: "Freshdesk",
    url: "freshdesk.com",
    description:
      "Connect Freshdesk Chat with SiteGPT and chat with your bot directly from Freshdesk.",
    iconColor: "bg-green-500",
    iconContent: (
      <div className="flex h-full w-full items-center justify-center bg-green-500 text-white">
        <span className="text-lg font-bold">F</span>
      </div>
    ),
  },
  {
    name: "Zendesk",
    url: "zendesk.com",
    description:
      "Connect Zendesk Chat with SiteGPT and chat with your bot directly from Zendesk.",
    iconColor: "bg-slate-900",
    iconContent: (
      <div className="flex h-full w-full items-center justify-center bg-teal-900 text-white">
        <span className="text-lg font-bold">Z</span>
      </div>
    ),
  },
  {
    name: "Zoho SalesIQ",
    url: "www.zoho.com",
    description:
      "Connect Zoho SalesIQ Chat with SiteGPT and chat with your bot directly from Zoho SalesIQ.",
    iconColor: "bg-red-500",
    iconContent: (
      <div className="flex h-full w-full items-center justify-center bg-red-600 text-white">
        <span className="text-lg font-bold">Z</span>
      </div>
    ),
  },
];

const IntegrationPage = () => {
  return (
    <div className="flex h-full flex-col bg-slate-50/50">
      <PanelNavbar
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Integrations" },
        ]}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-slate-900">
            Integrations
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="p-5 pb-4">
                  <div className="mb-3 flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] ${
                        !integration.iconColor.includes("bg-")
                          ? "border border-slate-200"
                          : ""
                      }`}
                    >
                      {integration.iconContent}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-slate-900">
                        {integration.name}
                      </h3>
                      <a
                        href={`https://${integration.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-blue-600"
                      >
                        {integration.url}
                        <ExternalLink className="h-[10px] w-[10px] opacity-70 group-hover:opacity-100" />
                      </a>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.6] text-slate-600">
                    {integration.description}
                  </p>
                </div>
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                  <button className="flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700">
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Get
                    Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationPage;

import React from "react";
import { Check, Copy, ExternalLink, Zap } from "lucide-react";

export const ZapierIntegration = {
  key: "ZAPIER",
  name: "Zapier",
  url: "zapier.com",
  connectionType: "zapier_redirect",
  twoStep: false,
  description:
    "Connect Zapier with ContextGPT to automate workflows. Choose triggers like New Message, New Lead, or Conversation Escalated and build powerful automations.",
  modalTitle: "Connect Zapier to ContextGPT",
  modalDescription:
    "Click Get Started to connect your account with Zapier and start building automations.",
  fields: [],

  renderExtraModalContent: () => {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="mb-1.5 text-[12px] font-semibold text-blue-800">
            How it works
          </p>
          <ol className="list-decimal space-y-1.5 pl-4 text-[11px] text-blue-700">
            <li>
              <strong>Navigate to Integrations</strong>
              <span className="block text-blue-600">
                Go to Integrations in your chatbot dashboard.
              </span>
            </li>
            <li>
              <strong>Select Zapier</strong>
              <span className="block text-blue-600">
                Click Get Started on the Zapier integration card.
              </span>
            </li>
            <li>
              <strong>Connect to Zapier</strong>
              <span className="block text-blue-600">
                You&apos;ll be redirected to Zapier to authorize the connection.
              </span>
            </li>
            <li>
              <strong>Create your first Zap</strong>
              <span className="block text-blue-600">
                Choose a trigger (New Message, New Lead, or Conversation
                Escalated) and set up your automation.
              </span>
            </li>
          </ol>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1.5 text-[12px] font-semibold text-slate-700">
            Available Triggers
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              {
                name: "New Message",
                desc: "Fires when a new message is received in any conversation",
              },
              {
                name: "New Lead",
                desc: "Fires when a new lead is captured by the chatbot",
              },
              {
                name: "Conversation Escalated",
                desc: "Fires when a conversation is escalated to a human agent",
              },
            ].map((trigger) => (
              <div
                key={trigger.name}
                className="flex items-start gap-2 rounded border border-slate-200 bg-white px-2.5 py-1.5"
              >
                <Zap className="mt-0.5 h-3 w-3 shrink-0 text-orange-500" />
                <div>
                  <p className="text-[11px] font-medium text-slate-700">
                    {trigger.name}
                  </p>
                  <p className="text-[10px] text-slate-500">{trigger.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },

  renderPostConnectContent: (extraData, { copiedKey, setCopiedKey }) => {
    const apiKey = extraData?.integrationId || "";

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
          <Check className="h-4 w-4 text-green-600" />
          <p className="text-[13px] font-medium text-green-800">
            Zapier is connected!
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1.5 text-[12px] font-medium text-slate-700">
            Your API Key
          </p>
          <p className="mb-1 text-[10px] text-slate-500">
            Use this key when Zapier asks you to authenticate with ContextGPT.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-600">
              {apiKey}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(apiKey);
                setCopiedKey("zapier-api-key");
                setTimeout(() => setCopiedKey(null), 2000);
              }}
              className="shrink-0 rounded p-1 hover:bg-slate-200"
            >
              {copiedKey === "zapier-api-key" ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        <a
          href={extraData?.connectUrl || "https://zapier.com/apps/contextgpt/integrations"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-orange-600"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Zapier to Create a Zap
        </a>

        <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
          <p className="mb-1 text-[12px] font-semibold text-amber-800">
            Quick Start
          </p>
          <ol className="list-decimal space-y-0.5 pl-4 text-[11px] text-amber-700">
            <li>
              Open Zapier and search for <strong>ContextGPT</strong>
            </li>
            <li>
              Authenticate using the <strong>API Key</strong> shown above
            </li>
            <li>
              Pick a trigger: <strong>New Message</strong>,{" "}
              <strong>New Lead</strong>, or{" "}
              <strong>Conversation Escalated</strong>
            </li>
            <li>Connect it to any of Zapier&apos;s 6,000+ apps</li>
          </ol>
        </div>
      </div>
    );
  },

  iconContent: (
    <div className="flex h-full w-full items-center justify-center bg-white p-1">
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
        <path
          d="M19.08 12.92L16 16l3.08 3.08a8.96 8.96 0 000-6.16zM16 16l-3.08-3.08a8.96 8.96 0 000 6.16L16 16zm0 0l3.08-3.08a8.96 8.96 0 00-6.16 0L16 16zm0 0l-3.08 3.08a8.96 8.96 0 006.16 0L16 16z"
          fill="#FF4A00"
        />
        <path
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm7.18 17.18h-3.1a10.98 10.98 0 01-.99 2.39l2.19 2.19-2.46 2.46-2.19-2.19a10.98 10.98 0 01-2.39.99v3.1h-3.48v-3.1a10.98 10.98 0 01-2.39-.99l-2.19 2.19-2.46-2.46 2.19-2.19a10.98 10.98 0 01-.99-2.39h-3.1v-3.48h3.1c.2-.83.53-1.63.99-2.39l-2.19-2.19 2.46-2.46 2.19 2.19a10.98 10.98 0 012.39-.99v-3.1h3.48v3.1c.83.2 1.63.53 2.39.99l2.19-2.19 2.46 2.46-2.19 2.19c.46.76.79 1.56.99 2.39h3.1v3.48z"
          fill="#FF4A00"
        />
      </svg>
    </div>
  ),
};

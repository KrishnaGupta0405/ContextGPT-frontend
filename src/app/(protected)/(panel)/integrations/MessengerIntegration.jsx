import React from "react";
import { Loader2, Check, Copy } from "lucide-react";

export const MessengerIntegration = {
  key: "MESSENGER",
  name: "Messenger",
  url: "messenger.com",
  connectionType: "manual",
  modalDescription: "Use your own Meta App. Follow the steps below — no Facebook App Review needed.",
  description:
    "Connect Messenger with ContextGPT. You bring your own Meta App — no Facebook App Review needed.",
  fields: [
    { name: "page_access_token", label: "Page Access Token", placeholder: "EAAxxxxxxx..." },
  ],
  iconContent: (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-blue-600 to-purple-500 text-white">
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.488 5.513 3.82 7.23V22l3.48-1.92c1.23.344 2.535.534 3.88.534 6.242 0 10-4.145 10-9.258C23.18 6.145 18.703 2 12 2Zm1.083 12.336-2.825-3.02-5.503 3.02 6.04-6.425 2.87 3.02 5.46-3.02-6.042 6.425Z" />
      </svg>
    </div>
  ),

  // Called when the modal opens; return value is stored as `extraData`
  onModalOpen: async (basePath, api) => {
    const res = await api.get(`${basePath}/messenger/setup`);
    if (res.data.success) return res.data.data;
    return null;
  },

  // Renders any platform-specific content above the credential fields
  renderExtraModalContent: (extraData, { isLoadingExtra, copiedKey, setCopiedKey }) => {
    if (isLoadingExtra) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        </div>
      );
    }
    if (!extraData) return null;
    return (
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 flex flex-col gap-2">
        <p className="text-[12px] font-semibold text-blue-800">
          Step 1 — Paste these into your Meta App → Messenger → Webhooks
        </p>
        {[
          { label: "Callback URL", value: extraData.webhookUrl },
          { label: "Verify Token", value: extraData.verifyToken },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[11px] text-blue-700 mb-0.5">{label}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-white px-2 py-1 text-[12px] text-slate-700 border border-blue-200">
                {value}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(value);
                  setCopiedKey(label);
                  setTimeout(() => setCopiedKey(null), 2000);
                }}
                className="shrink-0 rounded p-1 hover:bg-blue-100"
              >
                {copiedKey === label ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-blue-500" />
                )}
              </button>
            </div>
          </div>
        ))}
        <p className="text-[11px] text-blue-700 mt-1">
          Subscribe to:{" "}
          <span className="font-mono">{extraData.subscriptionFields?.join(", ")}</span>
        </p>
        <p className="text-[12px] font-semibold text-blue-800 mt-1">
          Step 2 — Then fill in your credentials below and click Save
        </p>
      </div>
    );
  },
};


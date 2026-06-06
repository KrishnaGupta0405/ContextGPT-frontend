import React from "react";
import { Loader2, Check, Copy } from "lucide-react";

export const GoogleChatIntegration = {
  key: "GOOGLE_CHAT",
  name: "Google Chat",
  url: "google.com",
  connectionType: "manual",
  modalDescription: "Use your own Google Cloud project. Follow the steps below to connect Google Chat.",
  description:
    "Connect Google Chat with ContextGPT and chat with your bot directly from Google Chat.",
  fields: [],

  // Called when the modal opens; return value is stored as `extraData`
  onModalOpen: async (basePath, api) => {
    const res = await api.get(`${basePath}/google-chat/setup`);
    if (res.data.success) return res.data.data;
    return null;
  },

  // Renders the callback URL that the user pastes into Google Cloud Console
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
          Step 1 — Paste this URL into Google Cloud Console → Chat API → Configuration → App URL
        </p>
        <div>
          <p className="text-[11px] text-blue-700 mb-0.5">Callback URL</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-white px-2 py-1 text-[12px] text-slate-700 border border-blue-200">
              {extraData.webhookUrl}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(extraData.webhookUrl);
                setCopiedKey("webhookUrl");
                setTimeout(() => setCopiedKey(null), 2000);
              }}
              className="shrink-0 rounded p-1 hover:bg-blue-100"
            >
              {copiedKey === "webhookUrl" ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-blue-500" />
              )}
            </button>
          </div>
        </div>
        <p className="text-[12px] font-semibold text-blue-800 mt-1">
          Step 2 — Click Save below to activate the integration
        </p>
      </div>
    );
  },

    iconContent: (
    <div className="flex h-full w-full items-center justify-center bg-white p-1">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACpElEQVRYhe2XPUxTURTH/+e+D/tBoSliEDrUJqJ5qCGigwkDDE4qC8GEwaTMxjARBqOpIYY4qIMxujppMA6uxo83GDWExI8giTrQRKKDlBiB0sJ79ziA5bV9tn2RD4f+t3vfOef/u+/e8z6AmnZY5BzEEjO+eWUpEFSywjk/eboHISx4LB1C6EbnTzJNq1yU6hxktMWjdYKHmPR65zwjCH9g2ZO9XLQxp/+6PWUYTw5NT69UBAgn3oYFcI6Bs+CiYlA8ma8lMViKtsaob2hmT+zpPjOVdQvL32q/bqsgjnl3KgdBMUUqY/Va45mZ7pivLMCWiCAgYdhMl4NqpNcNYmsB/kAwHQTEpaAa6Z0yDH17AdakQsIAi7HdUV8Xd3erGxfWdaClDUwSTKXZz9KJEwn16qwXxzvq/ujjgdbXjikBIM7Ew7ZK72EiXQAAAEJTQUUdAAD3UhdnBwe9ARx5FINeV9o9RATSAgVUO6oaQA1gxwEK2tCScyAXphxyAID+8X7lI9AALOklQUXSc/6mapaXB/iGKyA7AKLS3l1ABsZ4v/55FR0+lfuIfZFKhSXYL+DyVPsbwAJMMGsofhUDAGlC0VZbOzRFJsE4CZBaGlWUU+XmViwEAKFIg6Ep8gLAVZl7UVXFgqFd1wAYgMv+bAcAA+3Yoo7JA1gIZRWZNSFwnMGFKyXUl2SCLQYtejEjZssGXma/L+c2SjsUH+lsyASULrBocs63trVcJ0GOk88WgFfMfJ9Brt96bhIQqcw8TU6ff5gHr9wnAI496PsKILo+XAHRc0vy6LtPh98gmZTVArjJ64nOm4eb0xMY+DdzrwArLPmFIIyGm9MTZk/5H47NBrgLQlywciu498fUZpkDVbYWB3I32dZHTn1p/7CZ5v+FfgN+PM9HZK3x+QAAAABJRU5ErkJggg==" alt="googlechat" className="w-full h-full object-contain rounded-sm" />
    </div>
  ),
};

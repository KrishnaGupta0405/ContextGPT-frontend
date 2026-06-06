import React, { useState } from "react";
import { Check, Copy, Loader2, Save } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

export const FreshdeskIntegration = {
  key: "FRESHDESK",
  name: "Freshdesk",
  url: "freshdesk.com",
  connectionType: "manual",
  twoStep: true,
  description:
    "Connect Freshchat with ContextGPT and let your bot respond to conversations directly from Freshchat.",
  modalTitle: "Connect Freshchat to ContextGPT",
  modalDescription:
    "Enter your Freshchat API key and Chat URL to connect.",
  fields: [
    {
      name: "api_key",
      label: "Freshchat API Key",
      placeholder: "Your Freshchat API key (generated once — store securely)",
    },
    {
      name: "chat_url",
      label: "Freshchat Chat URL",
      placeholder: "e.g. https://your-subdomain.freshchat.com/v2",
    },
  ],

  renderExtraModalContent: () => {
    return (
      <div className="rounded-lg border border-green-100 bg-green-50 p-3 flex flex-col gap-1.5">
        <p className="text-[12px] font-semibold text-green-800">
          Before you begin — Generate your Freshchat credentials
        </p>
        <ol className="text-[11px] text-green-700 list-decimal pl-4 space-y-0.5">
          <li>
            Go to{" "}
            <a
              href="https://www.freshworks.com/login/"
              target="_blank"
              rel="noreferrer"
              className="underline font-medium hover:text-green-900"
            >
              freshworks.com
            </a>{" "}
            and sign in to your Freshchat account, then click the gear icon to open <strong>Admin Settings</strong>
          </li>
          <li>Navigate to <strong>Marketplace and Integrations → API → API Settings</strong></li>
          <li>Under <strong>API details for chat</strong>, click <strong>Generate token</strong> and copy the API key</li>
          <li>Copy the <strong>Chat URL</strong> shown beneath the API key</li>
          <li>Ensure <strong>Send as</strong> is set to <strong>Bot</strong></li>
        </ol>
        <p className="text-[11px] text-green-700 mt-1">
          ⚠ The API key is shown only once. Store it securely before proceeding.
        </p>
      </div>
    );
  },

  renderPostConnectContent: (extraData, { copiedKey, setCopiedKey }) => {
    const webhookBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
      ? process.env.NEXT_PUBLIC_BACKEND_API_URL.replace(/\/api\/v1\/?$/, "")
      : "";
    const integrationId = extraData?.integrationId || "";
    const basePath = extraData?.basePath || "";
    const callbackUrl = `${webhookBaseUrl}/api/webhooks/freshdesk?token=${integrationId}`;
    const RSAKeyInput = FreshdeskIntegration.RSAKeyInput;

    return (
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-slate-600">
          Freshchat is connected! Now configure the conversation webhook in Freshchat.
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1.5 text-[12px] font-medium text-slate-700">
            Callback URL
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-600">
              {callbackUrl}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(callbackUrl);
                setCopiedKey("freshdesk-callback-url");
                setTimeout(() => setCopiedKey(null), 2000);
              }}
              className="shrink-0 rounded p-1 hover:bg-slate-200"
            >
              {copiedKey === "freshdesk-callback-url" ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-green-100 bg-green-50 p-3">
          <p className="text-[12px] font-semibold text-green-800 mb-1.5">
            Webhook Setup
          </p>
          <ol className="text-[11px] text-green-700 list-decimal pl-4 space-y-0.5">
            <li>Return to <strong>Freshchat Admin Settings → Marketplace and Integrations → API → Conversation Webhooks</strong></li>
            <li>Toggle the webhook to <strong>Enabled</strong></li>
            <li>Paste the <strong>Callback URL</strong> above into the Webhook field</li>
            <li>(Optional) Enter an email under <strong>Failure Notifications</strong> for alerts</li>
            <li>In the <strong>Authentication</strong> section, copy the RSA public key and paste it below</li>
            <li>Click <strong>Save</strong> to activate the webhook</li>
          </ol>
          <p className="text-[11px] text-green-700 mt-1.5">
            Freshchat retries failed webhooks up to 5 times with a 3-second timeout per attempt.
          </p>
        </div>

        {basePath && integrationId && (
          <RSAKeyInput basePath={basePath} integrationId={integrationId} />
        )}
      </div>
    );
  },

  RSAKeyInput: function FreshdeskRSAKeyInput({ basePath, integrationId }) {
    const [rsaKey, setRsaKey] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
      if (!rsaKey.trim()) return;
      setSaving(true);
      try {
        await api.patch(`${basePath}/integrations/${integrationId}/config`, {
          configUpdates: { rsa_public_key: rsaKey.trim() },
        });
        toast.success("RSA public key saved successfully");
        setSaved(true);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to save RSA public key",
        );
      } finally {
        setSaving(false);
      }
    };

    if (saved) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <Check className="h-4 w-4 text-emerald-600" />
          <p className="text-[12px] font-medium text-emerald-700">
            RSA public key saved. Incoming webhooks will be verified.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-[12px] font-semibold text-amber-800">
          Webhook RSA Public Key
        </p>
        <p className="text-[11px] text-amber-700">
          After enabling the webhook in Freshchat, copy the <strong>RSA public key</strong> from
          the Authentication section and paste it below so we can verify incoming webhooks.
        </p>
        <div className="flex flex-col gap-2">
          <textarea
            value={rsaKey}
            onChange={(e) => setRsaKey(e.target.value)}
            placeholder="Paste the RSA public key here"
            rows={4}
            className="w-full rounded border border-amber-300 bg-white px-2 py-1 text-[12px] text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-amber-400 focus:outline-none resize-none"
          />
          <button
            onClick={handleSave}
            disabled={saving || !rsaKey.trim()}
            className="flex self-end items-center gap-1 rounded bg-amber-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            Save
          </button>
        </div>
      </div>
    );
  },

    iconContent: (
    <div className="flex h-full w-full items-center justify-center bg-white p-1">
      <img src="data:image/png;base64,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" alt="freshdesk" className="w-full h-full object-contain rounded-sm" />
    </div>
  ),
};

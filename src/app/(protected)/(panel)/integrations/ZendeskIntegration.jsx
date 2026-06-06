import React, { useState } from "react";
import { Check, Copy, Loader2, Save } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

export const ZendeskIntegration = {
  key: "ZENDESK",
  name: "Zendesk",
  url: "zendesk.com",
  connectionType: "manual",
  twoStep: true,
  description:
    "Connect Zendesk Messaging with ContextGPT and chat with your bot directly from Zendesk.",
  modalTitle: "Connecting Zendesk to ContextGPT",
  modalDescription:
    "Enter your Zendesk Conversation API credentials below to connect.",
  fields: [
    {
      name: "key_id",
      label: "Conversation API Key ID",
      placeholder: "e.g. app_xxxxxxxxxxxxxxxxxxxxxxxx",
    },
    {
      name: "secret_key",
      label: "Conversation API Secret Key",
      placeholder: "Your Conversation API secret key",
    },
  ],

  renderExtraModalContent: () => {
    return (
      <div className="flex flex-col gap-1.5 rounded-lg border border-purple-100 bg-purple-50 p-3">
        <p className="text-[12px] font-semibold text-purple-800">
          Before you begin — Get your Zendesk Conversation API credentials
        </p>
        <p className="text-[11px] font-medium text-red-600">
          Note: Requires Zendesk Suite plans. Check your plan at Zendesk &gt;
          Admin Center &gt; Account &gt; Subscription.
        </p>
        <ol className="list-decimal space-y-0.5 pl-4 text-[11px] text-purple-700">
          <li>
            Go to <strong>Zendesk Admin Center</strong> &gt;{" "}
            <strong>Apps and Integrations</strong> &gt;{" "}
            <strong>Conversation API</strong>
          </li>
          <li>
            Click <strong>Create API Key</strong>, set name to{" "}
            <strong>ContextGPT Bot</strong>
          </li>
          <li>
            Copy the <strong>Key ID</strong> and <strong>Secret Key</strong>
          </li>
        </ol>
        <p className="mt-1 text-[11px] text-purple-700">
          Paste both values below, then click <strong>Connect</strong>.
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
    const webhookUrl = `${webhookBaseUrl}/api/webhooks/zendesk?token=${integrationId}`;

    const SharedSecretInput = ZendeskIntegration.SharedSecretInput;

    return (
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-slate-600">
          Your Zendesk Conversation API is connected! Now set up the webhook
          integration:
        </p>

        {/* Webhook URL to copy */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1.5 text-[12px] font-medium text-slate-700">
            Webhook URL
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-600">
              {webhookUrl}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                setCopiedKey("zendesk-webhook-url");
                setTimeout(() => setCopiedKey(null), 2000);
              }}
              className="shrink-0 rounded p-1 hover:bg-slate-200"
            >
              {copiedKey === "zendesk-webhook-url" ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Setup instructions */}
        <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
          <p className="mb-1.5 text-[12px] font-semibold text-purple-800">
            Webhook Integration Setup
          </p>
          <ol className="list-decimal space-y-0.5 pl-4 text-[11px] text-purple-700">
            <li>
              Go to <strong>Zendesk Admin Center</strong> &gt;{" "}
              <strong>Apps and Integrations</strong> &gt;{" "}
              <strong>Conversation Integrations</strong>
            </li>
            <li>
              Click <strong>Create Integration</strong>, set name to{" "}
              <strong>ContextGPT Bot</strong>
            </li>
            <li>
              Paste the <strong>Webhook URL</strong> above into the webhook URL
              field
            </li>
            <li>
              Under <strong>Webhook Body Data</strong>, select:{" "}
              <span className="font-mono text-purple-800">
                Include full user
              </span>{" "}
              and{" "}
              <span className="font-mono text-purple-800">
                Include full source
              </span>
            </li>
            <li>
              Under <strong>Webhook Subscriptions</strong>, select:{" "}
              <span className="font-mono text-purple-800">
                client updated, conversation created, conversation message,
                postbacks
              </span>
            </li>
            <li>
              Click <strong>Save</strong> — Zendesk will show a{" "}
              <strong>Webhook ID</strong> and <strong>Shared Secret</strong>
            </li>
            <li>
              Copy the <strong>Shared Secret</strong> and paste it below
            </li>
          </ol>

          <p className="mt-2.5 mb-1.5 text-[12px] font-semibold text-purple-800">
            Test Your Integration
          </p>
          <ol
            className="list-decimal space-y-0.5 pl-4 text-[11px] text-purple-700"
            start={8}
          >
            <li>
              Go to <strong>Zendesk Admin Center</strong> &gt;{" "}
              <strong>Channels</strong> &gt; <strong>Messaging</strong>
            </li>
            <li>Click on your messaging channel and send a test message</li>
          </ol>
        </div>

        {/* Shared Secret input */}
        {basePath && integrationId && (
          <SharedSecretInput
            basePath={basePath}
            integrationId={integrationId}
          />
        )}
      </div>
    );
  },

  // Shared secret save component rendered inside post-connect content
  SharedSecretInput: function ZendeskSharedSecretInput({
    basePath,
    integrationId,
  }) {
    const [secret, setSecret] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
      if (!secret.trim()) return;
      setSaving(true);
      try {
        await api.patch(`${basePath}/integrations/${integrationId}/config`, {
          configUpdates: { webhook_shared_secret: secret.trim() },
        });
        toast.success("Webhook shared secret saved successfully");
        setSaved(true);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to save shared secret",
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
            Webhook shared secret saved. Incoming webhooks will be verified.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-[12px] font-semibold text-amber-800">
          Webhook Shared Secret (Recommended)
        </p>
        <p className="text-[11px] text-amber-700">
          After saving the webhook in Zendesk, you&apos;ll see a Webhook ID and
          Shared Secret. Paste the <strong>Shared Secret</strong> below so we
          can verify that incoming messages are really from Zendesk.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Paste your webhook shared secret here"
            className="flex-1 rounded border border-amber-300 bg-white px-2 py-1 text-[12px] text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
          />
          <button
            onClick={handleSave}
            disabled={saving || !secret.trim()}
            className="flex shrink-0 items-center gap-1 rounded bg-amber-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-amber-700 disabled:opacity-50"
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
    <div className="flex h-full w-full items-center justify-center bg-teal-900 p-2 text-white">
      <svg
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.914 2.904V16.29L24 2.905H12.914zM0 2.906C0 5.966 2.483 8.45 5.543 8.45s5.542-2.484 5.543-5.544H0zm11.086 4.807L0 21.096h11.086V7.713zm7.37 7.84c-3.063 0-5.542 2.48-5.542 5.543H24c0-3.06-2.48-5.543-5.543-5.543z" />
      </svg>
    </div>
  ),
};

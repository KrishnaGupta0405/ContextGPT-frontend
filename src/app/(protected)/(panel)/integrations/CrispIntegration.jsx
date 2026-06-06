import React from "react";
import { Check, Copy } from "lucide-react";

export const CrispIntegration = {
  key: "CRISP",
  name: "Crisp",
  url: "crisp.chat",
  connectionType: "manual",
  twoStep: true,
  description:
    "Connect Crisp Chat with ContextGPT and chat with your bot directly from Crisp Chat.",
  modalTitle: "Connecting Crisp to ContextGPT",
  modalDescription:
    "Create a Crisp plugin and enter its credentials below to connect.",
  fields: [
    {
      name: "api_identifier",
      label: "API Identifier (Plugin Token ID)",
      placeholder: "e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    },
    {
      name: "api_key",
      label: "API Key (Plugin Token Key)",
      placeholder: "Your Crisp plugin API key",
    },
    {
      name: "website_id",
      label: "Website ID",
      placeholder: "e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    },
  ],

  // Shown above the input fields in step 1
  renderExtraModalContent: () => {
    return (
      <div className="rounded-lg border border-purple-100 bg-purple-50 p-3 flex flex-col gap-1.5">
        <p className="text-[12px] font-semibold text-purple-800">
          Before you begin — Get your Crisp plugin credentials
        </p>
        <ol className="text-[11px] text-purple-700 list-decimal pl-4 space-y-0.5">
          <li>
            Go to{" "}
            <a
              href="https://marketplace.crisp.chat/initiate/login"
              target="_blank"
              rel="noreferrer"
              className="underline font-medium hover:text-purple-900"
            >
              marketplace.crisp.chat
            </a>{" "}
            and log in
          </li>
          <li>Click <strong>New Plugin</strong>, enter a name &amp; description, then <strong>Create Plugin</strong></li>
          <li>Under your plugin's <strong>Tokens</strong>, copy the <strong>Identifier</strong> and <strong>Key</strong></li>
          <li>In your <strong>Crisp Inbox Dashboard → Settings → Website Settings → Setup Instructions</strong>, copy your <strong>Website ID</strong></li>
        </ol>
        <p className="text-[11px] text-purple-700 mt-1">
          Paste all three values below, then click <strong>Connect</strong>.
        </p>
      </div>
    );
  },

  // Shown in step 2 after successful connect
  renderPostConnectContent: (extraData, { copiedKey, setCopiedKey }) => {
    const webhookBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
      ? process.env.NEXT_PUBLIC_BACKEND_API_URL.replace(/\/api\/v1\/?$/, "")
      : "";
    const integrationId = extraData?.integrationId || "";
    const webhookUrl = `${webhookBaseUrl}/api/webhooks/crisp?token=${integrationId}`;

    return (
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-slate-600">
          Your Crisp plugin is connected! Now complete the webhook and trusted website setup:
        </p>

        {/* Webhook URL to copy */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1.5 text-[12px] font-medium text-slate-700">
            Callback URL
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-600">
              {webhookUrl}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                setCopiedKey("crisp-webhook-url");
                setTimeout(() => setCopiedKey(null), 2000);
              }}
              className="shrink-0 rounded p-1 hover:bg-slate-200"
            >
              {copiedKey === "crisp-webhook-url" ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Setup instructions */}
        <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
          <p className="text-[12px] font-semibold text-purple-800 mb-1.5">
            Webhook Setup
          </p>
          <ol className="text-[11px] text-purple-700 list-decimal pl-4 space-y-0.5">
            <li>
              In your <strong>Crisp Inbox Dashboard → Settings → Website Settings</strong>, find the ContextGPT plugin under integrations
            </li>
            <li>
              Go to <strong>Advanced Configuration → Webhook → Hook Settings</strong>
            </li>
            <li>Give the hook a name and paste the <strong>Callback URL</strong> above</li>
            <li>
              Select these events:{" "}
              <span className="font-mono text-purple-800">
                message:send, message:received
              </span>
            </li>
            <li>Click <strong>Save</strong></li>
          </ol>

          <p className="text-[12px] font-semibold text-purple-800 mt-2.5 mb-1.5">
            Add Trusted Website
          </p>
          <ol className="text-[11px] text-purple-700 list-decimal pl-4 space-y-0.5" start={6}>
            <li>
              Go to <strong>Crisp Inbox Dashboard → Settings → Website Settings → Setup Instructions</strong> and copy your <strong>Website ID</strong>
            </li>
            <li>
              Go to{" "}
              <a
                href="https://marketplace.crisp.chat"
                target="_blank"
                rel="noreferrer"
                className="underline font-medium hover:text-purple-900"
              >
                Crisp Marketplace
              </a>{" "}
              → your plugin → <strong>Settings</strong>
            </li>
            <li>Click <strong>Add Trusted Website</strong>, paste your <strong>Website ID</strong>, and enter your Crisp login email &amp; password</li>
          </ol>
        </div>
      </div>
    );
  },

  iconContent: (
    <div className="flex h-full w-full items-center justify-center bg-white p-1">
      <img
        src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMODQ0QDQ0NEBANDRANDhIODxAODQ0OGBEiIhURFxYkHDQgGBonJx8fIT0hJzUrLi46GCE/QjMsQzAvLjcBCgoKDQ0NGRAQGi0dHyAzKzArLSsrKzcxLTAtNzcrLys1LTcrLS03MDcrLjc1MDctKystNystMjQ3Ky04LjArLf/AABEIAIAAgAMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwYBBAcFAv/EADQQAAEEAQEDCQYHAQAAAAAAAAACAxESAQQFBjIHMUFRUnKRscEhYXGBgtETIkJDYpKiI//EABsBAQACAwEBAAAAAAAAAAAAAAADBQECBgQH/8QAKhEBAAIBAwIFAwUBAAAAAAAAAAECEQMEBTGBIUFRYXESQpEVMqGx8CP/2gAMAwEAAhEDEQA/APasdU+eFgFgFgFgFgFgFgFgFgFgFgFgFgFgFgI5MskgJASAkBICQEgJASAkBICQEgJASBHJltgkGCQYJBgkGCQYJBgkGCQYJBgkGCQYJBgkGCQYJBhHYyyWAWAWAWAWAWAWAWAWAWAWAWAWAWAWAjsbMlgFgFgFgFgFgFgJW2Fq4G3Fd1Cs+hpN6x1mIb10726RM9m23sXUq4dK980ZT5kU7nRjraE9dluLdKT+G21utq1fs4T3lox6kc7/AG8fd/Epq8Xup+3HeGzjc3UVzlSmUxjOYsrOeb4EX6lo5xESl/R9xjMzEf74VuxYqosBmwCwEVjLJYBYCx7s7up1rbi1PKRRdISnGZxEzJX7veToWiIjOVnsePruazabYxKwtbj6fHE4+r6kpx5Hhnk9aekRCzrw2hHWZn/fDba3S0if2cq7zi8+pFPIbifPHaE9eL2sfbnvLba2DpkcOlZ+aMK8yKd1rz1tKauy21elI/Dbb0raOBptPdQnBFOpeesynrpUr0rEdkxo3AAGM4A4y+mq1p7K1J8MnXVnNYlwl64tMeiOxs1LALAfFjLYsAsBd+TV32apPvbX54Kblq/sn5X3C2/fHwu5Tr0AAAAAAAA4/t5FNZqk9T7nhlUnV7ac6NJ9ocZu6/Tr3j3loyTPOWAWAjkyySAkC28mzsap5PaYnwXj7lXytf8AlWfdb8NONa0esOilC6MAAAAAAAA5Rvoim0dR/LKF+KMHTbCc7evdyfI1xurdv6eJJ7HhLAJAjkyySAkCx7gO12i3jttuJ/zPoeDkq528+2Fjxc43Me8S6mc26gAAAAAAAA5jyjN11+M9thGfDOceh0XFznQx6TLmuWrjcZ9YhV5LFVkgJAjky2JASB6+6L1do6TPW7T+yc49Tzb2udvf4erYzjc0n3djOUdaAAAADGcxzga7u0Gkcb7Ke84hPqSRpalulZnsjtq6detoju0nd5tIji1jP0qv5E1dluJ6UlDbe7evW8KFv5tVnVPML0zl6NqQvNVJj80458e3pLrjtDU0qWi8YUnJa+nrXrNJziFYksFaSAkCOTZkkBIGxs7Vfgvsuxn/AJOoczHPnGFTkj1afXS1fWJSaVvovW3pML67ykN44NK6rvLQj7lLXh7+doXVuXp5VlpPcpDn6NI3jvOKV5YwTV4ennefwhty9/KkflpPcoGqVwp06PghWfNRLXitCOuZ7orcruJ6Yjstm529ONan8N6qdQjE5xj2JdT2k+/rwVm+2M6E/VXxr/Sz2O9jXj6beFo/l7+0NajTsuPO5hDacqz156sY9+eY8elp21LxSvWXs1dSunSb26Q4ttXajmqecdcUqVqnCZzVCehOMe46zR0KaVIrXycnra19W82t5tKSZDgkBICQEgJAjsZZLALALALALALASMahTa0rbVlK0KwpKk5jKc46TW1YtExPjEtq2msxMeEw93eLexzXMMNKThFPzPV5nXOjMdGOmOvJ49rsaaF7Wjxz09oezc76+vStZ8MdfeVese54SwCwCwCwCwCwEcmWxICQEgJASAkBICQEgJASAkBICQEgR2MskgJASAkBICQEgJASAkBICQEgJASBHJlkkBICQEgJASAkBICQEgJASAkBICQI5NmxICQEgJASBmQEgYkBIGZASAkBICQEgf/Z"
        alt="crisp"
        className="w-full h-full object-contain rounded-sm"
      />
    </div>
  ),
};

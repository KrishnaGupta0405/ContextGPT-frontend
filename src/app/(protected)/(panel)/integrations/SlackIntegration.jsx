import React from "react";
import { Copy, Check, Loader2 } from "lucide-react";

function ManifestBox({ title, manifest, copiedKey, setCopiedKey, copyId }) {
  if (!manifest) return null;
  const manifestStr = JSON.stringify(manifest, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestStr);
    setCopiedKey(copyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
        <span className="text-[12px] font-medium text-slate-700">{title}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[12px] text-slate-500 hover:text-slate-700"
        >
          {copiedKey === copyId ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          Copy
        </button>
      </div>
      <pre className="p-3 text-[11px] text-slate-600 overflow-auto max-h-36 leading-relaxed font-mono whitespace-pre">
        {manifestStr}
      </pre>
    </div>
  );
}

export const SlackIntegration = {
  key: "SLACK",
  name: "Slack",
  url: "slack.com",
  connectionType: "manual",
  twoStep: true,
  description:
    "Connect Slack with ContextGPT and chat with your bot directly from Slack.",
  modalTitle: "Connecting Slack to ContextGPT",
  modalDescription:
    "Connect Slack with ContextGPT and chat with your bot directly from Slack.",

  fields: [
    {
      name: "access_token",
      label: "Bot User OAuth Token",
      placeholder: "Enter your slack app's bot user oauth token",
    },
    {
      name: "channel_id",
      label: "Channel ID",
      placeholder: "Enter your slack app's channel ID",
    },
    {
      name: "signing_secret",
      label: "Signing Secret",
      placeholder: "Enter your slack app's signing secret (Basic Information → App Credentials)",
    },
  ],

  onModalOpen: async (basePath, api) => {
    const res = await api.get(`${basePath}/slack/setup`);
    return res.data.data;
  },

  // Shown above the input fields in step 1
  renderExtraModalContent: (extraData, { isLoadingExtra, copiedKey, setCopiedKey }) => {
    if (isLoadingExtra) {
      return (
        <div className="flex items-center gap-2 text-slate-500 text-[13px]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading setup info…
        </div>
      );
    }
    if (!extraData?.initialManifest) return null;
    return (
      <ManifestBox
        title="Initial App Manifest.json"
        manifest={extraData.initialManifest}
        copiedKey={copiedKey}
        setCopiedKey={setCopiedKey}
        copyId="slack-initial-manifest"
      />
    );
  },

  // Shown in step 2 after successful connect
  renderPostConnectContent: (extraData, { copiedKey, setCopiedKey }) => {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-slate-600">
          Your Slack app is connected! Now update your Slack app manifest with
          the one below (it includes the webhook URL), then go to{" "}
          <strong>Event Subscriptions</strong>, enable it, and click{" "}
          <strong>Retry</strong> — it should show <em>Verified</em>.
        </p>
        <ManifestBox
          title="Updated App Manifest.json"
          manifest={extraData?.updatedManifest}
          copiedKey={copiedKey}
          setCopiedKey={setCopiedKey}
          copyId="slack-updated-manifest"
        />
      </div>
    );
  },

    iconContent: (
    <div className="flex h-full w-full items-center justify-center bg-white p-1">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAiCAYAAADVhWD8AAADZklEQVRYhcWXTW8bVRSGn3NdoaxgLEQlJFrGe2p5AyF8VMmSSkV4V2XTyS+wvebDYxDruL+AdBOyMxSpsKsXBGgkJCvqgp1vo0qVqCq7u0ho7mExiTuuPfadtIVXGsm+c+acd2bOPHNGKKDV/ScNRZtACFiMiQ/WXr2Zjan+8lUDpzEQABYkPrzy9c2ZZHMkvkbe/XUUich3MwlEW3c/KHcBqj9/0UYlnlMm8jFkfM2ISHveumpmXSWaf7Rr+tQ452uG9NbMU1C7Mwo4vhE4TXJipOZTwPvKAOO8HSsrBAXy5Mr/Nql2XkTBRfI2c/ejchenHcD+72YADj4uxwcfBhVjdGr7Y61sX4SZmQZ+//dR6HPg8xoIe3EQQDCox5M8EzOr+08aTjV2zq8Z39sfW4zsHKy9VriXqrfb25BEDoLq7S/tKRgNpEBTtCtS6KkIcRqv/jbyYsi0EdeESa0QdOednz5fT3tGpFEkYVZT0FuiWi8O8gAoJdM2AAJeUMpRCj0fnfsnt45AaABU6T+HGTvYKI8Hn8SWXDDqYFkSBWsAnNMbZ7ZiTJz5l9PMprvUTOI6BuDPy+UfVHVLlaVnkJEV1VZ2hDi88k1XlS2egtGCay16Yyvad4nbuHf1236B2i9fU/PMMPgsIFiZasaK3bPzYp5dz2rUC4NjAq+mfrM+mOSZmLl/cbOhSAw6lUSNq5wWvn9xs61I8zRGIH77aHeqTx7fqm4rRODHLAVrhJ3Xrx52BGB4YTMSYWaKy5pJjRDPJtNW5ej7bsZIIQhOZIhSznhA7+RsZyQ8hd6ZjQA4jU7e2roQesMwClgw6QE87NXy9ntJkBR6qPZzYsZpvxwvvf8njZg7DS6TovaEwPOnOIVCMHS50PMwk2gKvcqDvb6q1jNXyKaNuRsXSXj+08OuS3QLf3iOQfuauI036vf6Xt9Nw/BaKM4M8/aHR7ve31+LVORTZake9Wrr08mPbbn+l/U9vtAMvEgPe7VQSu5OdktKrwwf37q0/Z+byZMizUc/VmOf2JduBsAI173i/NKtnJkfAJoPzCl5manYnTHkPa5qYRn0cqFa3AwsAKMmrdPfedBzSak1b/1ZFeLD8K1r6yLSRiRE1apqp/Jgr5+N+bt3KTIlrotKqKIDl5Q65+sDLwj+C522aNEorPCIAAAAAElFTkSuQmCC" alt="slack" className="w-full h-full object-contain rounded-sm" />
    </div>
  ),
};

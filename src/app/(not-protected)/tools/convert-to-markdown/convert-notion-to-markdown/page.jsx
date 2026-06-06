"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const API_ENDPOINT = "/tools/convert-notion-to-markdown";
const INPUT_LABEL = "Notion Page URL";
const INPUT_PLACEHOLDER = "https://www.notion.so/your-page-id";
const INPUT_HINT = "Enter the public share link of your Notion page.";
const ACTION_LABEL = "Convert to Markdown";

export default function ConvertNotionToMarkdown() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!url.trim()) return toast.error("Please enter a Notion URL.");
    setLoading(true);
    try {
      const res = await api.post(API_ENDPOINT, { url: url.trim() });
      setMarkdown(res.data.data.markdown);
      toast.success("Converted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setMarkdown("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">{INPUT_LABEL}</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConvert()}
          placeholder={INPUT_PLACEHOLDER}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <p className="text-xs text-gray-400">{INPUT_HINT}</p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
        <button
          onClick={handleConvert}
          disabled={!url.trim() || loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Converting...
            </>
          ) : (
            <><ArrowRight className="h-4 w-4" /> {ACTION_LABEL}</>
          )}
        </button>
      </div>

      {markdown && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Markdown Output</p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly
            value={markdown}
            rows={16}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-xs text-gray-800 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

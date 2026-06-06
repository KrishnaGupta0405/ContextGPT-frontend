"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, ArrowRight } from "lucide-react";
import { toast } from "sonner";

function xmlToMarkdown(xml) {
  const clean = xml
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  const lines = [];
  let depth = 0;

  clean.replace(/(<[^>]+>|[^<]+)/g, (token) => {
    const trimmed = token.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("</")) {
      depth = Math.max(0, depth - 1);
    } else if (trimmed.startsWith("<") && !trimmed.startsWith("</")) {
      const tag = trimmed.replace(/^</, "").replace(/\/?>$/, "").split(/\s/)[0];
      const selfClose = trimmed.endsWith("/>");
      lines.push(`${"  ".repeat(depth)}- **${tag}**`);
      if (!selfClose) depth++;
    } else {
      lines.push(`${"  ".repeat(depth)}${trimmed}`);
    }
  });

  return lines.join("\n");
}

export default function ConvertXmlToMarkdown() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    if (!input.trim()) return toast.error("Please enter some XML content first.");
    setError("");
    try {
      const result = xmlToMarkdown(input);
      setOutput(result);
      toast.success("Converted successfully!");
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Paste your XML content</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"<root>\n  <item>\n    <name>Alice</name>\n    <age>30</age>\n  </item>\n</root>"}
          rows={10}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-xs text-gray-800 placeholder:font-sans placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
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
          disabled={!input.trim()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <ArrowRight className="h-4 w-4" /> Convert to Markdown
        </button>
      </div>

      {output && (
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
            value={output}
            rows={14}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-xs text-gray-800 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

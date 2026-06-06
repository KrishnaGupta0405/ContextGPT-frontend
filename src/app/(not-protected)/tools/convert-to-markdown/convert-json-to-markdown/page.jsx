"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, ArrowRight } from "lucide-react";
import { toast } from "sonner";

function jsonToMarkdown(jsonStr) {
  let obj;
  try {
    obj = JSON.parse(jsonStr);
  } catch {
    throw new Error("Invalid JSON — please check your input.");
  }

  const renderValue = (val, depth = 0) => {
    const indent = "  ".repeat(depth);
    if (val === null) return "`null`";
    if (typeof val === "boolean") return `\`${val}\``;
    if (typeof val === "number") return `\`${val}\``;
    if (typeof val === "string") return val;
    if (Array.isArray(val)) {
      if (val.length === 0) return "_empty array_";
      if (typeof val[0] === "object" && val[0] !== null && !Array.isArray(val[0])) {
        const keys = Object.keys(val[0]);
        const header = `| ${keys.join(" | ")} |`;
        const sep = `| ${keys.map(() => "---").join(" | ")} |`;
        const rows = val.map(
          (row) => `| ${keys.map((k) => String(row[k] ?? "")).join(" | ")} |`
        );
        return [header, sep, ...rows].join("\n");
      }
      return val.map((v) => `${indent}- ${renderValue(v, depth + 1)}`).join("\n");
    }
    if (typeof val === "object") {
      return Object.entries(val)
        .map(([k, v]) => {
          const child = renderValue(v, depth + 1);
          const multiLine = child.includes("\n");
          return multiLine
            ? `${"#".repeat(depth + 3)} ${k}\n\n${child}`
            : `**${k}**: ${child}`;
        })
        .join("\n\n");
    }
    return String(val);
  };

  return renderValue(obj);
}

export default function ConvertJsonToMarkdown() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    if (!input.trim()) return toast.error("Please enter some JSON content first.");
    setError("");
    try {
      const result = jsonToMarkdown(input);
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
        <label className="text-sm font-medium text-gray-700">Paste your JSON content</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{\n  "name": "Alice",\n  "age": 30,\n  "city": "New York"\n}'}
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
"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, ArrowRight } from "lucide-react";
import { toast } from "sonner";

function csvToMarkdown(csv) {
  const lines = csv.trim().split("\n").filter(Boolean);
  if (lines.length === 0) return "";
  const parse = (line) =>
    line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
  const headers = parse(lines[0]);
  const separator = headers.map(() => "---");
  const rows = lines.slice(1).map(parse);
  const toRow = (cols) => `| ${cols.join(" | ")} |`;
  return [toRow(headers), toRow(separator), ...rows.map(toRow)].join("\n");
}

export default function ConvertCsvToMarkdown() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    if (!input.trim()) return toast.error("Please enter some CSV content first.");
    setError("");
    try {
      const result = csvToMarkdown(input);
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
        <label className="text-sm font-medium text-gray-700">Paste your CSV content</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"name, age, city\nAlice, 30, New York\nBob, 25, London"}
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
"use client";

import { useState, useRef } from "react";
import { Upload, Copy, Check, RotateCcw, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const ACCEPTED_FILE_TYPES = ".docx";
const API_ENDPOINT = "/tools/convert-docx-to-markdown";
const FILE_HINT = "DOCX files up to 50MB";
const ACTION_LABEL = "Convert to Markdown";

export default function ConvertDocxToMarkdown() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ACCEPTED_FILE_TYPES.split(",").map((e) => e.trim().replace(".", ""));
    const ext = f.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error(`Invalid file type. Allowed: ${ACCEPTED_FILE_TYPES}`);
      return;
    }
    setFile(f);
    setMarkdown("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleConvert = async () => {
    if (!file) return toast.error("Please select a file first.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(API_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMarkdown(res.data.data.markdown);
      toast.success("Converted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setMarkdown("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
          dragging
            ? "border-blue-400 bg-blue-50"
            : file
            ? "border-blue-300 bg-blue-50/50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"
        }`}
      >
        <CloudUpload className="mb-3 h-10 w-10 text-gray-400" />
        {file ? (
          <>
            <p className="text-sm font-medium text-gray-800">{file.name}</p>
            <p className="mt-1 text-xs text-gray-400">
              {(file.size / 1024).toFixed(1)} KB — click to change
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-600">
              Choose a file or drag &amp; drop it here.
            </p>
            <p className="mt-1 text-xs text-gray-400">{FILE_HINT}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <span className="flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </span>
        </button>
        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Converting...
            </>
          ) : (
            <><Upload className="h-4 w-4" /> {ACTION_LABEL}</>
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

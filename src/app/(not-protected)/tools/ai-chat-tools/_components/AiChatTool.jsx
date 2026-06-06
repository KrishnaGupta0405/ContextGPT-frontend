"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  CloudUpload,
  RotateCcw,
  Bot,
  User,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const MAX_TOKENS = Number(process.env.NEXT_PUBLIC_FREE_TOOL_MAX_TOKENS) || 8000;
const MAX_CONTENT_TOKENS =
  Number(process.env.NEXT_PUBLIC_FREE_TOOL_MAX_CONTENT_TOKENS) || 10000;
const MAX_MESSAGES =
  Number(process.env.NEXT_PUBLIC_FREE_TOOL_MAX_MESSAGES) || 10;
const MAX_MESSAGE_TOKENS = 50;
const CHARS_PER_TOKEN = 4;

export default function AiChatTool({ tool }) {
  const { chatMode } = tool;

  const [setupDone, setSetupDone] = useState(false);
  const [contextData, setContextData] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [contextCollapsed, setContextCollapsed] = useState(true);
  const bottomRef = useRef(null);
  const mirrorRef = useRef(null);

  const maxChars = MAX_TOKENS * CHARS_PER_TOKEN;
  const estimateTokens = (text) =>
    Math.ceil((text || "").length / CHARS_PER_TOKEN);
  const currentTokens = chatMode === "text" ? estimateTokens(contextData) : 0;
  const isOverLimit = chatMode === "text" && currentTokens > MAX_TOKENS;

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const isMessageLimitReached = userMessageCount >= MAX_MESSAGES;

  const inputTokens = estimateTokens(input);
  const isInputOverLimit = inputTokens > MAX_MESSAGE_TOKENS;

  const handleTextareaScroll = (e) => {
    if (mirrorRef.current) mirrorRef.current.scrollTop = e.target.scrollTop;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (f) => {
    if (!f) return;
    const allowed = (tool.acceptedFileTypes || "")
      .split(",")
      .map((e) => e.trim().replace(".", ""));
    const ext = f.name.split(".").pop().toLowerCase();
    if (allowed.length && !allowed.includes(ext)) {
      toast.error(`Invalid file type. Allowed: ${tool.acceptedFileTypes}`);
      return;
    }
    const maxMB = tool.maxFileSizeMB || 10;
    if (f.size > maxMB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${maxMB} MB.`);
      return;
    }
    setFile(f);
  };

  const handleStartChat = () => {
    if (chatMode === "text" && !contextData.trim())
      return toast.error("Please paste some text first.");
    if (chatMode === "website" && !contextData.trim())
      return toast.error("Please enter a URL first.");
    if (["document", "pdf", "word"].includes(chatMode) && !file)
      return toast.error("Please select a file first.");
    setSetupDone(true);
    setMessages([
      {
        role: "assistant",
        content: `Hi! I've loaded your ${chatMode === "website" ? "website" : chatMode === "text" ? "text" : "document"}. Ask me anything about it.`,
      },
    ]);
  };

  const handleReset = () => {
    setSetupDone(false);
    setContextData("");
    setFile(null);
    setMessages([]);
    setInput("");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || isInputOverLimit) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      let res;
      if (chatMode === "text") {
        res = await api.post(tool.apiEndpoint, {
          text: contextData,
          messages: newMessages,
        });
      } else if (chatMode === "website") {
        res = await api.post(tool.apiEndpoint, {
          url: contextData,
          messages: newMessages,
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("messages", JSON.stringify(newMessages));
        setUploadProgress(0);
        res = await api.post(tool.apiEndpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
        });
        setUploadProgress(null);
      }
      const aiMsg = { role: "assistant", content: res.data.data.result };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error(err.response.data?.message || "Free usage limit reached. Sign up for unlimited access.");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong.");
      }
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const contextSection = (
    <div className="space-y-5">
      {chatMode === "text" && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            {setupDone ? "Your text data" : "Paste your text data"}
          </label>
          {setupDone ? (
            <div
              onClick={() => setContextCollapsed((v) => !v)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 transition-all hover:border-gray-300"
            >
              <p className={contextCollapsed ? "line-clamp-2" : "line-clamp-6"}>
                {contextData}
              </p>
              <span className="mt-1 inline-block text-xs text-blue-500">
                {contextCollapsed ? "Show more" : "Show less"}
              </span>
            </div>
          ) : (
            <>
              <div className="relative">
                <div
                  ref={mirrorRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 overflow-y-auto rounded-xl border border-transparent p-4 text-sm break-words whitespace-pre-wrap"
                  style={{ overflowWrap: "break-word" }}
                >
                  <span className="text-transparent">
                    {contextData.slice(0, maxChars)}
                  </span>
                  {contextData.length > maxChars && (
                    <span className="rounded-sm bg-red-300/70 text-transparent">
                      {contextData.slice(maxChars)}
                    </span>
                  )}
                </div>
                <textarea
                  value={contextData}
                  onChange={(e) => setContextData(e.target.value)}
                  onScroll={handleTextareaScroll}
                  placeholder="Paste any text — articles, reports, notes, FAQs..."
                  rows={10}
                  className={`relative z-10 w-full resize-none rounded-xl border p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:outline-none ${
                    isOverLimit
                      ? "border-red-400 bg-transparent focus:border-red-400 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white focus:ring-blue-100"
                  }`}
                />
              </div>
              <div
                className={`flex items-center justify-between text-xs ${isOverLimit ? "font-medium text-red-500" : "text-gray-400"}`}
              >
                <span>
                  {isOverLimit && (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="inline h-3 w-3" /> Content
                      exceeds the token limit — extra text highlighted in red
                    </span>
                  )}
                </span>
                <span>
                  {currentTokens.toLocaleString()} /{" "}
                  {MAX_TOKENS.toLocaleString()} tokens
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {chatMode === "website" && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Website URL
          </label>
          {setupDone ? (
            <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm break-all text-gray-600">
              {contextData}
            </p>
          ) : (
            <>
              <input
                type="url"
                value={contextData}
                onChange={(e) => setContextData(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
              <p className="text-xs text-gray-400">
                The URL must be publicly accessible. Only the first{" "}
                {MAX_CONTENT_TOKENS.toLocaleString()} tokens of content will be
                used as reference.
              </p>
            </>
          )}
        </div>
      )}

      {["document", "pdf", "word"].includes(chatMode) && !setupDone && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
            dragging
              ? "border-blue-400 bg-blue-50"
              : file
                ? "border-blue-300 bg-blue-50/50"
                : "border-gray-200 bg-gray-50 hover:border-blue-300"
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
              <p className="mt-1 text-xs text-gray-400">
                {tool.fileHint} Only the first{" "}
                {MAX_CONTENT_TOKENS.toLocaleString()} tokens of content will be
                used as reference.
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={tool.acceptedFileTypes}
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
        </div>
      )}

      {["document", "pdf", "word"].includes(chatMode) && setupDone && file && (
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </p>
      )}

      {!setupDone && (
        <div className="flex justify-end">
          <button
            onClick={handleStartChat}
            disabled={isOverLimit}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Bot className="h-4 w-4" /> Start Chatting
          </button>
        </div>
      )}
    </div>
  );

  if (!setupDone) {
    return contextSection;
  }

  return (
    <div className="space-y-4">
      {contextSection}

      <div className="flex flex-col" style={{ height: "500px" }}>
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-sm font-semibold text-gray-700">
            AI Chat —{" "}
            {chatMode === "website"
              ? contextData.substring(0, 40) + "..."
              : file?.name || "Text Data"}
          </p>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-white ${msg.role === "user" ? "bg-blue-500" : "bg-gray-700"}`}
              >
                {msg.role === "user" ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Bot className="h-3.5 w-3.5" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "rounded-tr-sm bg-blue-600 text-white" : "rounded-tl-sm bg-gray-100 text-gray-800"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gray-700 text-white">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
                {uploadProgress !== null && uploadProgress < 100 ? (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      Uploading {uploadProgress}%
                    </span>
                  </div>
                ) : (
                  <span className="flex gap-1">
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                )}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="mt-3 border-t border-gray-100 pt-3">
          <div
            className={`mb-2 text-xs ${isMessageLimitReached ? "font-medium text-red-500" : "text-gray-400"}`}
          >
            {isMessageLimitReached
              ? `Message limit reached (${MAX_MESSAGES}/${MAX_MESSAGES}). Reset to start a new chat.`
              : `${userMessageCount}/${MAX_MESSAGES} messages used`}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder={
                isMessageLimitReached
                  ? "Message limit reached"
                  : "Ask a question..."
              }
              disabled={loading || isMessageLimitReached}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={
                !input.trim() ||
                loading ||
                isMessageLimitReached ||
                isInputOverLimit
              }
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {input.length > 0 && (
            <div
              className={`mt-1.5 flex items-center justify-between text-xs ${isInputOverLimit ? "font-medium text-red-500" : "text-gray-400"}`}
            >
              <span>
                {isInputOverLimit && (
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="inline h-3 w-3" /> Message exceeds
                    the {MAX_MESSAGE_TOKENS} token limit
                  </span>
                )}
              </span>
              <span>
                {inputTokens} / {MAX_MESSAGE_TOKENS} tokens
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

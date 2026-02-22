"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const timeAgo = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
};

const getInitials = (str) => {
  if (!str) return "?";
  return str.substring(0, 2).toUpperCase();
};

export default function PromptsSidebar({ prompts, selectedPrompt, onSelect }) {
  const [filter, setFilter] = useState("all");

  const filteredPrompts = prompts.filter((prompt) => {
    if (filter === "manual") return prompt.manuallyAdded;
    if (filter === "history") return prompt.addedFromChatHistory;
    return true;
  });

  const getFilterLabel = () => {
    if (filter === "manual") return "Manual";
    if (filter === "history") return "History";
    return "All";
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Filter bar */}
      <div className="flex items-center justify-between border-b px-4 py-3 text-sm font-medium text-slate-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 rounded px-2 py-1 outline-none hover:bg-slate-100">
              {getFilterLabel()}{" "}
              <ChevronDown className="ml-0.5 h-3.5 w-3.5 text-slate-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilter("all")}>
              All Responses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("manual")}>
              Manually Added
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("history")}>
              Added from Chat History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs text-slate-600 outline-none"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter("all")}>
              Clear Filter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("manual")}>
              Manually Added
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("history")}>
              Added from Chat History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* List */}
      <div className="w-full flex-1 overflow-y-auto">
        {filteredPrompts.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500 italic">
            No custom responses yet.
          </p>
        ) : (
          filteredPrompts.map((prompt) => {
            const isSelected = selectedPrompt?.id === prompt.id;
            return (
              <div
                key={prompt.id}
                onClick={() => onSelect(prompt)}
                className={`relative flex cursor-pointer flex-col border-b p-4 transition-colors ${
                  isSelected
                    ? "border-l-4 border-l-blue-500 bg-blue-50"
                    : "border-l-4 border-l-transparent hover:bg-slate-50"
                }`}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p
                    className={`line-clamp-1 text-sm font-semibold ${isSelected ? "text-blue-700" : "text-slate-800"}`}
                  >
                    {prompt.question}
                  </p>
                  <span className="shrink-0 text-[11px] whitespace-nowrap text-slate-400">
                    {timeAgo(prompt.createdAt)}
                  </span>
                </div>
                <p
                  className={`mb-3 line-clamp-2 text-[13px] ${isSelected ? "text-blue-600" : "text-slate-500"}`}
                >
                  {prompt.answer}
                </p>
                <div className="flex items-center justify-between">
                  {prompt.manuallyAdded ? (
                    <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-medium text-orange-700">
                      Manually Added
                    </span>
                  ) : prompt.addedFromChatHistory ? (
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
                      Added from Chat History
                    </span>
                  ) : null}
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

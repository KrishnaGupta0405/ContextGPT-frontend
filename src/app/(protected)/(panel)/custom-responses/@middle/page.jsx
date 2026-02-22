"use client";

import React, { useState } from "react";
import { useCustomResponses } from "../CustomResponsesProvider";
import PromptsSidebar from "./PromptsSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";

export default function MiddlePage() {
  const { prompts, loading, selectedChatbot } = useCustomResponses();
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("promptId");

  const selectedPrompt = prompts.find((p) => p.id === promptId) || null;

  const handleSelect = (prompt) => {
    router.push(`?promptId=${prompt.id}`);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Sidebar List */}
      {!selectedChatbot ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-slate-500">
          Select a chatbot first.
        </div>
      ) : loading ? (
        <div className="flex flex-1 flex-col gap-4 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <PromptsSidebar
            prompts={prompts}
            selectedPrompt={selectedPrompt}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

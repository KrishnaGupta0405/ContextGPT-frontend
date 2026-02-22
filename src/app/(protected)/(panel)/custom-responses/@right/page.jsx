"use client";

import React, { useState } from "react";
import { useCustomResponses } from "../CustomResponsesProvider";
import PromptDetailView from "./PromptDetailView";
import PromptFormModal from "./PromptFormModal";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RightPage() {
  const { prompts, loading, selectedChatbot, handleEdit, handleDelete } =
    useCustomResponses();
  const searchParams = useSearchParams();
  const router = useRouter();
  const promptId = searchParams.get("promptId");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // If no chatbot selected or loading, we don't need to show the empty state here,
  // the middle pane handles that overall loading state visually better.
  if (!selectedChatbot || loading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center p-8">
        {loading && <Loader2 className="h-6 w-6 animate-spin text-slate-400" />}
      </div>
    );
  }

  const selectedPrompt = prompts.find((p) => p.id === promptId);

  if (!selectedPrompt) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-slate-50 p-8">
        <div className="max-w-sm text-center text-slate-400">
          <p className="mb-2 text-lg font-medium text-slate-600">
            No Response Selected
          </p>
          <p className="text-sm">
            Select a custom response from the sidebar to preview and edit its
            contents.
          </p>
        </div>
      </div>
    );
  }

  const onDeleteConfirm = async () => {
    const success = await handleDelete(selectedPrompt.id);
    if (success) {
      router.push("/custom-responses"); // Clear selection
    }
  };

  const onEditSubmit = async (data) => {
    const success = await handleEdit(selectedPrompt.id, data);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-white">
      <PromptDetailView
        prompt={selectedPrompt}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={onDeleteConfirm}
      />

      <PromptFormModal
        open={isEditModalOpen}
        mode="edit"
        prompt={selectedPrompt}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={onEditSubmit}
      />
    </div>
  );
}

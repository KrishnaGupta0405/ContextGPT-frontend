"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Pencil,
  Trash2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

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

export default function PromptDetailView({ prompt, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="max-w-[300px] truncate text-base font-semibold text-slate-800">
            {prompt.question}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Success
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-800"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-blue-600"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-rose-600"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Conversation Preview */}
      <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-6">
        {/* User message */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-slate-200 text-[10px] font-bold text-slate-600">
                U
              </AvatarFallback>
            </Avatar>
            User
          </div>
          <div className="ml-7">
            <div className="inline-block max-w-sm rounded-xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
              {prompt.question}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {timeAgo(prompt.createdAt)}
            </p>
          </div>
        </div>

        {/* Old Bot Response (if prompt was updated from chat history) */}
        {prompt.oldprompt && (
          <div className="flex flex-col items-end space-y-1">
            <p className="mr-1 text-[11px] font-semibold text-slate-400">
              Old Bot Response
            </p>
            <div className="max-w-sm rounded-xl rounded-tr-sm bg-blue-400 px-4 py-3 text-sm text-white shadow-sm">
              {prompt.oldprompt}
            </div>
            <p className="mr-1 text-[11px] text-slate-400">
              {timeAgo(prompt.createdAt)}
            </p>
          </div>
        )}

        {/* New Bot Response */}
        <div className="flex flex-col items-end space-y-1">
          {prompt.oldprompt && (
            <p className="mr-1 text-[11px] font-semibold text-slate-400">
              New Bot Response
            </p>
          )}
          <div className="max-w-sm rounded-xl rounded-tr-sm bg-blue-600 px-4 py-3 text-sm text-white shadow-sm">
            {prompt.answer}
          </div>
          <div className="mr-1 flex items-center gap-2">
            <button
              className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline"
              onClick={onEdit}
            >
              <Pencil className="h-2.5 w-2.5" />
              Still incorrect? Modify again!
            </button>
            {prompt.oldprompt && (
              <>
                <span className="text-[11px] text-slate-300">|</span>
                <span className="text-[11px] text-slate-400">
                  {timeAgo(prompt.updatedAt)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Custom Response?</DialogTitle>
            <DialogDescription>
              This will permanently remove this custom response. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

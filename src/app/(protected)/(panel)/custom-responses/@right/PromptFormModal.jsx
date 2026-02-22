"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Copy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PromptFormModal({
  open,
  mode,
  prompt,
  onClose,
  onSubmit,
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // If the prompt was created from the chat history,
  // the question is fixed (shown as a chat bubble)
  const isFromHistory =
    mode === "edit" && prompt && prompt.addedfromchathistory;

  useEffect(() => {
    if (open) {
      setQuestion(mode === "edit" && prompt ? prompt.question : "");
      setAnswer(mode === "edit" && prompt ? prompt.answer : "");
    }
  }, [open, mode, prompt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    try {
      // If it's from history, we only send the answer field in the PATCH
      const payload = isFromHistory
        ? { answer: answer.trim() }
        : { question: question.trim(), answer: answer.trim() };
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={
          isFromHistory
            ? "overflow-hidden p-0 sm:max-w-[600px]"
            : "sm:max-w-[520px]"
        }
      >
        {isFromHistory ? (
          /* -------- UI FOR PROMPTS ADDED FROM CHAT HISTORY -------- */
          <div className="flex h-full flex-col bg-slate-50/50">
            <div className="flex items-center justify-between border-b bg-white px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                Update Response
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.21841C3.80708 2.99386 3.44301 2.99386 3.21846 3.21841C2.99391 3.44297 2.99391 3.80703 3.21846 4.03159L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {/* Chat Preview Box */}
              <div className="mb-6 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* User message */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-blue-50 text-[10px] font-bold text-blue-600">
                        U
                      </AvatarFallback>
                    </Avatar>
                    User
                  </div>
                  <div className="ml-8 inline-block rounded-xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-800">
                    {prompt.question}
                  </div>
                </div>

                {/* Old Bot Response (rendered dynamically from prompt.oldprompt if it exists) */}
                {prompt.oldprompt && (
                  <div className="flex flex-col items-end space-y-1">
                    <div className="mr-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <Copy className="h-3 w-3" /> Old Bot Response
                    </div>
                    <div className="max-w-[85%] rounded-xl rounded-br-sm bg-blue-400 px-4 py-3 text-left text-sm text-white">
                      {prompt.oldprompt}
                    </div>
                  </div>
                )}

                {/* New Bot Response Preview (shows the value typed in the textarea below) */}
                <div className="flex flex-col items-end space-y-1">
                  <div className="mr-2 text-[11px] font-semibold text-slate-800">
                    New Bot Response
                  </div>
                  <div className="max-w-[85%] rounded-xl rounded-br-sm bg-blue-600 px-4 py-3 text-left text-sm whitespace-pre-wrap text-white">
                    {answer || "Type a response below..."}
                  </div>
                </div>
              </div>

              {/* Editable Area */}
              <div className="space-y-2">
                <Label
                  htmlFor="answer"
                  className="text-[13px] font-medium text-slate-800"
                >
                  Update Bot Response
                </Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[120px] resize-none border-slate-300 shadow-sm focus-visible:ring-blue-500"
                  placeholder="Type the new response here..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t bg-white px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 px-6 hover:bg-blue-700"
                disabled={loading || !answer.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* -------- UI FOR STANDARD CREATION/EDITING (MANUAL) -------- */
          <>
            <DialogHeader>
              <DialogTitle>
                {mode === "edit"
                  ? "Edit Custom Response"
                  : "Add Custom Response"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="question"
                  className="text-sm font-semibold text-slate-700"
                >
                  Question
                </Label>
                <Textarea
                  id="question"
                  placeholder="e.g. What are your pricing plans?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[80px] resize-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="answer"
                  className="text-sm font-semibold text-slate-700"
                >
                  Answer
                </Label>
                <Textarea
                  id="answer"
                  placeholder="e.g. Our pricing starts at $29/month..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>
              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading || !question.trim() || !answer.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : mode === "edit" ? (
                    "Save Changes"
                  ) : (
                    "Add Response"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

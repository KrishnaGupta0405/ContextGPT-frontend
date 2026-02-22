import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Star,
  Archive,
  ExternalLink,
  Loader2,
  Calendar,
  MessageSquare,
  CheckCircle2,
  StickyNote,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const LeadDetailsSheet = ({
  open,
  onOpenChange,
  visitor,
  threads,
  loadingThreads,
  hasMoreThreads,
  onLoadMoreThreads,
  onUpdateVisitor,
}) => {
  const [noteText, setNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  if (!visitor) return null;

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

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setIsSubmittingNote(true);
    try {
      await onUpdateVisitor(visitor.id, { internalNotes: noteText });
      setNoteText("");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const totalPositive =
    threads?.reduce((acc, t) => acc + (t.positiveCount || 0), 0) || 0;
  const totalNegative =
    threads?.reduce((acc, t) => acc + (t.negativeCount || 0), 0) || 0;
  const totalSentiment = totalPositive + totalNegative;
  const positivePercent =
    totalSentiment > 0 ? Math.round((totalPositive / totalSentiment) * 100) : 0;
  const negativePercent = totalSentiment > 0 ? 100 - positivePercent : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-[400px] flex-col gap-0 overflow-hidden border-l p-0 shadow-2xl sm:w-[500px]">
        <SheetHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b bg-white px-6 py-4">
          <SheetTitle className="text-base font-semibold text-slate-800">
            Lead Details
          </SheetTitle>
          <SheetDescription className="sr-only">
            Detailed information and chat history for the selected lead.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Profile Header section */}
          <div className="flex flex-col items-center px-6 pt-8 pb-4">
            <div className="relative mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-50 text-xl font-medium text-blue-600">
                  {getInitials(visitor.name || "Guest")}
                </AvatarFallback>
              </Avatar>
              <span className="absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-white bg-green-500"></span>
            </div>

            <h3 className="mb-4 text-lg font-bold tracking-tight text-slate-900">
              {visitor.name || "Guest User"}
            </h3>

            {/* Badges */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 rounded border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600">
                <Calendar className="h-3 w-3" /> Captured{" "}
                {timeAgo(visitor.firstSeenAt || visitor.createdAt).replace(
                  " ago",
                  "",
                )}{" "}
                ago
              </div>
              <div className="flex items-center gap-1.5 rounded bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600">
                <MessageSquare className="h-3 w-3" /> {threads?.length || 0}{" "}
                Conversations
              </div>
              <div className="flex items-center gap-1.5 rounded border border-green-100 bg-green-50 px-2 py-1 text-[11px] font-medium text-green-600">
                <CheckCircle2 className="h-3 w-3" /> Verified Lead
              </div>
            </div>

            {/* Actions (Preserved as requested) */}
            <div className="mb-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-slate-200 px-3 text-xs text-slate-500 hover:bg-slate-50"
              >
                <Mail className="mr-1.5 h-3.5 w-3.5" /> Mail
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 rounded-full border-slate-200 px-3 text-xs transition-colors hover:bg-slate-50 ${visitor.important ? "border-yellow-200 bg-yellow-50 text-yellow-500 hover:text-yellow-600" : "text-slate-500"}`}
                onClick={() =>
                  onUpdateVisitor(visitor.id, { important: !visitor.important })
                }
              >
                <Star
                  className={`mr-1.5 h-3.5 w-3.5 ${visitor.important ? "fill-current" : ""}`}
                />
                {visitor.important ? "Starred" : "Star"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 rounded-full border-slate-200 px-3 text-xs transition-colors hover:bg-slate-50 ${visitor.achieved || visitor.acheived ? "border-indigo-200 bg-indigo-50 text-indigo-500 hover:text-indigo-600" : "text-slate-500"}`}
                onClick={() =>
                  onUpdateVisitor(visitor.id, {
                    achieved: !(visitor.achieved || visitor.acheived),
                  })
                }
              >
                <Archive
                  className={`mr-1.5 h-3.5 w-3.5 ${visitor.achieved || visitor.acheived ? "fill-current" : ""}`}
                />
                {visitor.achieved || visitor.acheived ? "Archived" : "Archive"}
              </Button>
            </div>
          </div>

          <Separator className="mx-6 h-0.5 w-auto bg-slate-100" />

          {/* Details Section */}
          <div className="space-y-4 px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <span className="w-24 shrink-0 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Email
              </span>
              <span className="text-right text-sm font-medium break-all text-blue-600">
                {visitor.email || "---"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="w-24 shrink-0 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Phone
              </span>
              <span
                className={`text-right text-sm ${visitor.phoneNumber ? "font-medium text-slate-800" : "text-slate-400 italic"}`}
              >
                {visitor.phoneNumber || "Not provided"}
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Page Url
              </span>
              <div className="rounded-lg border border-blue-100/50 bg-blue-50/50 p-3 text-[13px] break-all text-blue-600">
                {threads && threads.length > 0 && threads[0].webhookUrl ? (
                  <a
                    href={threads[0].webhookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {threads[0].webhookUrl}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">
                    No URL available
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator className="mx-6 h-0.5 w-auto bg-slate-100" />

          {/* Sentiment Section (Preserved) */}
          {threads && threads.length > 0 && (
            <div className="space-y-3 px-6 py-6">
              <div className="mb-1 flex items-center justify-between">
                <h4 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                  Overall Sentiment
                </h4>
                <div className="flex gap-3 text-[11px] font-bold">
                  <span className="text-emerald-600">
                    Positive {positivePercent}%
                  </span>
                  <span className="text-rose-600">
                    Negative {negativePercent}%
                  </span>
                </div>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${positivePercent}%` }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${negativePercent}%` }}
                />
              </div>
              {totalSentiment === 0 && (
                <p className="text-center text-[11px] text-slate-400 italic">
                  No sentiment data analyzed yet for this visitor.
                </p>
              )}
            </div>
          )}

          <Separator className="mx-6 h-0.5 w-auto bg-slate-100" />

          {/* Conversations Section (Timeline View) */}
          <div className="px-6 py-6">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                Conversation History
              </h4>
              <Button
                variant="link"
                className="flex h-auto items-center gap-1 p-0 text-xs font-semibold text-blue-600 hover:underline"
              >
                View All <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            <div className="relative pl-3">
              {/* Timeline line */}
              {threads && threads.length > 0 && (
                <div className="absolute top-6 bottom-4 left-[27px] w-px bg-slate-200"></div>
              )}

              <div className="space-y-6">
                {loadingThreads && threads.length === 0 ? (
                  <>
                    <div className="relative flex items-start gap-4">
                      <Skeleton className="z-10 h-8 w-8 shrink-0 rounded-full ring-4 ring-white" />
                      <div className="mt-1 flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  </>
                ) : threads.length === 0 ? (
                  <p className="rounded-lg bg-slate-50 py-4 text-center text-sm text-slate-500">
                    No conversations found.
                  </p>
                ) : (
                  <>
                    {threads.map((thread) => (
                      <div
                        key={thread.id}
                        className="group relative flex items-start gap-4"
                      >
                        <Avatar className="z-10 h-8 w-8 shrink-0 bg-blue-50 text-blue-600 ring-4 ring-white">
                          <AvatarFallback className="bg-blue-50 text-[11px] font-bold text-blue-600">
                            {getInitials(thread.title || visitor.name || "??")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <div className="mb-0.5 flex items-baseline justify-between">
                            <span className="truncate pr-3 text-xs font-bold text-slate-900">
                              {thread.title || "Active Session"}
                            </span>
                            <span className="shrink-0 text-[10px] whitespace-nowrap text-slate-400">
                              {timeAgo(thread.startedAt)}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                            {thread.mode || "AI"} Mode Conversation •{" "}
                            {thread.unreadMessagesCount} unread
                          </p>
                        </div>
                      </div>
                    ))}

                    {hasMoreThreads && (
                      <div className="flex justify-center pt-2 pb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onLoadMoreThreads}
                          disabled={loadingThreads}
                          className="w-full border-slate-200 px-8 text-xs text-slate-600 hover:bg-slate-50 sm:w-auto"
                        >
                          {loadingThreads ? (
                            <>
                              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Load More"
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator className="mx-6 h-0.5 w-auto bg-slate-100" />

          {/* Internal Notes Section */}
          <div className="px-6 py-6 pb-12">
            <div className="mb-4 flex items-center gap-1.5">
              <StickyNote className="h-4 w-4 text-slate-500" />
              <h4 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                Internal Notes
              </h4>
            </div>

            {/* Display existing internal notes if any */}
            {visitor.internalNotes &&
              typeof visitor.internalNotes === "string" && (
                <div className="mb-4 rounded-lg border border-orange-100/50 bg-orange-50/70 p-3">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-xs font-bold text-amber-900">
                      Admin User
                    </span>
                    <span className="text-[10px] font-medium text-amber-700">
                      Prior Note
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-amber-800">
                    {visitor.internalNotes}
                  </p>
                </div>
              )}

            <div className="flex flex-col gap-3">
              <Textarea
                placeholder="Type an internal note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="min-h-[100px] resize-none bg-slate-50/50 text-sm"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-blue-600 px-6 font-medium text-white hover:bg-blue-700"
                  onClick={handleAddNote}
                  disabled={isSubmittingNote || !noteText.trim()}
                >
                  {isSubmittingNote ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Add Note"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailsSheet;

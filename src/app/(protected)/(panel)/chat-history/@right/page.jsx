"use client";

import React, { useEffect, useState, useRef } from "react";
import { useChatbot } from "@/context/ChatbotContext";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Send,
  User,
  Bot,
  Info,
  Tag,
  Star,
  CheckCircle,
  Download,
  MoreHorizontal,
  Copy,
  Trash2,
  ExternalLink,
  MailOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThreadDetailSheet from "./ThreadDetailSheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, X, Check } from "lucide-react";
import MessageItem from "./MessageItem";

const ChatHistoryRight = () => {
  const { selectedChatbot } = useChatbot();
  const searchParams = useSearchParams();
  const threadId = searchParams.get("threadId");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [threadDetails, setThreadDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null); // { id, content }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const scrollRef = useRef(null);

  const fetchMessages = React.useCallback(async () => {
    if (!selectedChatbot?.id || !threadId) return;

    const cacheKey = `chat_messages_${threadId}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    setLoading(true);

    if (cachedData) {
      setMessages(JSON.parse(cachedData));
      setLoading(false);
    }

    try {
      const response = await api.get(
        `/chatting/${selectedChatbot.id}/thread/${threadId}/messages`,
      );
      if (response.data?.success) {
        const fetchedMessages = response.data.data.messages || [];
        setMessages(fetchedMessages);
        sessionStorage.setItem(cacheKey, JSON.stringify(fetchedMessages));
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedChatbot?.id, threadId]);

  const fetchThreadDetails = React.useCallback(async () => {
    if (!selectedChatbot?.id || !threadId) return;

    setDetailsLoading(true);
    // Seed from cached thread list data first (has icon fields)
    const cached = sessionStorage.getItem(`thread_meta_${threadId}`);
    if (cached) {
      setThreadDetails((prev) => ({ ...JSON.parse(cached), ...prev }));
    }
    try {
      const response = await api.get(
        `/chatting/${selectedChatbot.id}/thread/${threadId}`,
      );
      if (response.data?.success) {
        const detail = response.data.data.thread;
        // Merge: prefer detail API data but keep icon fields from list if missing
        setThreadDetails((prev) => {
          const newDetails = { ...prev, ...detail };
          setEditedTitle(newDetails.title || "Visitor");
          return newDetails;
        });
      }
    } catch (error) {
      console.error("Failed to fetch thread details:", error);
    } finally {
      setDetailsLoading(false);
    }
  }, [selectedChatbot?.id, threadId]);

  useEffect(() => {
    fetchThreadDetails();
    fetchMessages();
  }, [threadId, selectedChatbot?.id, fetchMessages, fetchThreadDetails]);

  // Listen for thread updates from other components
  useEffect(() => {
    const handleThreadUpdate = (event) => {
      const { threadId: updatedId, title } = event.detail;
      if (updatedId === threadId) {
        setThreadDetails((prev) => ({ ...prev, title }));
      }
    };

    window.addEventListener("thread-updated", handleThreadUpdate);
    return () => {
      window.removeEventListener("thread-updated", handleThreadUpdate);
    };
  }, [threadId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChatbot?.id || !threadId) return;

    setSending(true);
    try {
      const payload = {
        content: newMessage,
        agentName: "Agent", // You might want to make this dynamic later
      };

      const response = await api.post(
        `/chatting/${selectedChatbot.id}/thread/${threadId}/message`,
        payload,
      );

      if (response.data?.success) {
        const newMsg = response.data.data.message;

        // Update state
        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        setNewMessage("");

        // Update cache
        const cacheKey = `chat_messages_${threadId}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(updatedMessages));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const updateThreadStatus = async (field, value) => {
    if (!selectedChatbot?.id || !threadId) return;

    // Optimistic update
    setThreadDetails((prev) => ({ ...prev, [field]: value }));

    try {
      // New bulk-style endpoint for single update
      // Endpoint: PATCH /chatting/:chatbotId/thread/update-thread
      // Body: [ { threadId, [field]: value } ]
      const payload = [
        {
          threadId: threadId,
          [field]: value,
        },
      ];

      const response = await api.patch(
        `/chatting/${selectedChatbot.id}/thread/update-thread`,
        payload,
      );

      if (response.data?.success) {
        toast.success(
          `Thread marked as ${field === "important" ? (value ? "important" : "not important") : value ? "resolved" : "unresolved"}`,
        );

        // Handle transparency with new response format: returns { updatedThreads: [[{...}]] }
        const updatedThreads = response.data.data.updatedThreads;
        if (
          updatedThreads &&
          updatedThreads.length > 0 &&
          updatedThreads[0].length > 0
        ) {
          const updatedThread = updatedThreads[0][0];
          setThreadDetails((prev) => ({ ...prev, ...updatedThread }));
        } else {
          // Fallback if response structure isn't exactly as expected but success is true
          fetchThreadDetails();
        }
      }
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
      toast.error(`Failed to update thread status`);
      // Revert optimistic update
      setThreadDetails((prev) => ({ ...prev, [field]: !value }));
    }
  };

  const handleTitleSave = async () => {
    if (!selectedChatbot?.id || !threadId || !editedTitle.trim()) return;

    try {
      const payload = [
        {
          threadId: threadId,
          title: editedTitle.trim(),
        },
      ];

      const response = await api.patch(
        `/chatting/${selectedChatbot.id}/thread/update-thread`,
        payload,
      );

      if (response.data?.success) {
        toast.success("Thread title updated successfully");
        const newTitle = editedTitle.trim();

        setThreadDetails((prev) => {
          const updated = { ...prev, title: newTitle };
          // Update individual thread cache
          sessionStorage.setItem(
            `thread_meta_${threadId}`,
            JSON.stringify(updated),
          );
          return updated;
        });
        setIsEditingTitle(false);

        // Update thread list cache
        const listCacheKey = `chat_threads_${selectedChatbot.id}`;
        const cachedList = sessionStorage.getItem(listCacheKey);
        if (cachedList) {
          const threads = JSON.parse(cachedList);
          const updatedThreads = threads.map((t) =>
            t.id === threadId ? { ...t, title: newTitle } : t,
          );
          sessionStorage.setItem(listCacheKey, JSON.stringify(updatedThreads));
        }

        // Dispatch event for cross-component sync
        window.dispatchEvent(
          new CustomEvent("thread-updated", {
            detail: { threadId, title: newTitle },
          }),
        );
      }
    } catch (error) {
      console.error("Failed to update thread title:", error);
      toast.error("Failed to update thread title");
    }
  };

  const initiateEditString = (msg) => {
    setEditingMessage({ id: msg.id, content: msg.content });
    setIsEditModalOpen(true);
  };

  const submitEditMessage = async () => {
    if (
      !editingMessage ||
      !editingMessage.content.trim() ||
      !selectedChatbot?.id
    )
      return;

    setSavingEdit(true);
    try {
      const response = await api.patch(
        `/chatting/${selectedChatbot.id}/message/${editingMessage.id}`,
        { content: editingMessage.content },
      );

      if (response.data?.success) {
        const updatedMsgData = response.data.data.message;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === editingMessage.id ? { ...m, ...updatedMsgData } : m,
          ),
        );

        // Update cache
        const cacheKey = `chat_messages_${threadId}`;
        const currentCached = JSON.parse(
          sessionStorage.getItem(cacheKey) || "[]",
        );
        const updatedCached = currentCached.map((m) =>
          m.id === editingMessage.id ? { ...m, ...updatedMsgData } : m,
        );
        sessionStorage.setItem(cacheKey, JSON.stringify(updatedCached));

        toast.success("Message updated successfully");
        setIsEditModalOpen(false);
        setEditingMessage(null);
      }
    } catch (error) {
      console.error("Failed to update message:", error);
      toast.error("Failed to update message");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDownloadChat = async () => {
    setDownloading(true);
    try {
      // Use existing messages logic
      const csvContent =
        "ThreadID,Role,Content,Time\n" +
        messages
          .map(
            (msg) =>
              `${threadId},${msg.role},"${msg.content.replace(/"/g, '""')}","${new Date(msg.createdAt).toLocaleString()}"`,
          )
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `chat_export_${threadId}_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download chat");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!threadId) {
    return (
      <div className="bg-muted/20 flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Thread Selected</h3>
          <p className="text-muted-foreground">
            Select a conversation from the left to view details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex h-full flex-col">
      {/* Header */}
      <div className="bg-card/50 flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={threadDetails?.userIconSrc} />
            <AvatarFallback className="bg-muted text-xs">
              {threadDetails?.visitorName
                ? threadDetails.visitorName.slice(0, 2).toUpperCase()
                : "VI"}
            </AvatarFallback>
          </Avatar>
          <div>
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="h-7 w-[200px] text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSave();
                    if (e.key === "Escape") {
                      setIsEditingTitle(false);
                      setEditedTitle(
                        threadDetails?.title ||
                          threadDetails?.visitorName ||
                          "Visitor",
                      );
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-green-600 hover:text-green-700"
                  onClick={handleTitleSave}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-600 hover:text-red-700"
                  onClick={() => {
                    setIsEditingTitle(false);
                    setEditedTitle(
                      threadDetails?.title ||
                        threadDetails?.visitorName ||
                        "Visitor",
                    );
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="group flex items-center gap-2">
                <h3 className="text-sm font-semibold">
                  {threadDetails?.title ||
                    threadDetails?.visitorName ||
                    "Visitor"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => {
                    setEditedTitle(
                      threadDetails?.title ||
                        threadDetails?.visitorName ||
                        "Visitor",
                    );
                    setIsEditingTitle(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
              {threadDetails?.visitorEmail && (
                <span>{threadDetails.visitorEmail}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-8 w-8"
                onClick={() => {
                  fetchThreadDetails();
                  setIsDetailOpen(true);
                }}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Modify Tags</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 transition-colors",
                  threadDetails?.important
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() =>
                  updateThreadStatus("important", !threadDetails?.important)
                }
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    threadDetails?.important ? "fill-current" : "",
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as Important</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 transition-colors",
                  threadDetails?.resolved
                    ? "text-emerald-500 hover:text-emerald-600"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() =>
                  updateThreadStatus("resolved", !threadDetails?.resolved)
                }
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as Resolved</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-8 w-8"
                onClick={handleDownloadChat}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Chat</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="data-[state=open]:bg-muted text-muted-foreground hover:text-foreground h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled>
                <MailOpen className="mr-2 h-4 w-4" />
                Mark as unread
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open as User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                disabled
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="ml-2 h-8 gap-2 px-3 text-xs"
            onClick={() => {
              fetchThreadDetails();
              setIsDetailOpen(true);
            }}
          >
            <Info className="h-3.5 w-3.5" />
            View Detail
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex h-full flex-col gap-4">
          {loading && messages.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex max-w-[80%] gap-3",
                    i % 2 === 0 ? "self-start" : "flex-row-reverse self-end",
                  )}
                >
                  <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-[200px] rounded-lg" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              ))
            : messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  threadDetails={threadDetails}
                  onEdit={initiateEditString}
                />
              ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-background border-t p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message... {{{Image sharing option coming soon...}}}"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="max-h-[150px] min-h-[50px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            className="h-[50px] w-[50px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Detail Side Panel */}
      <ThreadDetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        threadDetails={threadDetails}
        loading={detailsLoading}
        onUpdate={fetchThreadDetails}
      />

      {/* Edit Message Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editingMessage?.content || ""}
              onChange={(e) =>
                setEditingMessage((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEditMessage} disabled={savingEdit}>
              {savingEdit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatHistoryRight;

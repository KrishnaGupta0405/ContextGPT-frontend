"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useChatbot } from "@/context/ChatbotContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useChattingSocket } from "@/context/ChattingSocketContext";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Sparkles,
  Info,
  Star,
  CheckCircle2,
  Archive,
  RotateCw,
  Download,
  Filter,
  PlusCircle,
  PlayIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, X, Trash2, Pencil } from "lucide-react";
import BottomBar from "./BottomBar";
import { PlatformBadge } from "@/components/ui/PlatformBadge";

const formatThreadTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isToday) return time;
  if (isYesterday) return `Yesterday, ${time}`;

  const isThisYear = date.getFullYear() === now.getFullYear();
  const dateOpts = isThisYear
    ? { month: "short", day: "numeric" }
    : { month: "short", day: "numeric", year: "numeric" };
  return `${date.toLocaleDateString([], dateOpts)}, ${time}`;
};

const ChatHistoryMiddle = () => {
  const { selectedChatbot } = useChatbot();
  const { account } = useAuth();
  const { isConnected, send, addListener } = useChattingSocket() || {};
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("open");
  const [downloading, setDownloading] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState("all");
  const [fadingThreadIds, setFadingThreadIds] = useState(new Set());

  const handleDownload = async () => {
    try {
      setDownloading(true);

      // Define CSV headers
      const headers = [
        "ID",
        "Mode",
        "Anonymous",
        "Escalated",
        "Important",
        "Resolved",
        "Archived",
        "Tags",
        "Visitor Name",
        "Visitor Email",
        "Visitor Phone",
        "Created At",
      ];

      // Convert threads data to CSV format
      const csvData = threads.map((thread) => {
        return [
          thread.id,
          thread.mode,
          thread.anonymous ? "Yes" : "No",
          thread.escalated ? "Yes" : "No",
          thread.important ? "Yes" : "No",
          thread.resolved ? "Yes" : "No",
          thread.archived ? "Yes" : "No",
          `"${(thread.tags || []).join(", ")}"`,
          `"${(thread.visitorName || "Anonymous").replace(/"/g, '""')}"`,
          `"${(thread.visitorEmail || "").replace(/"/g, '""')}"`,
          `"${(thread.visitorPhone || "").replace(/"/g, '""')}"`,
          `"${new Date(thread.createdAt || Date.now()).toLocaleString()}"`,
        ].join(",");
      });

      // Combine headers and data
      const csvContent = [headers.join(","), ...csvData].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `chat_history_${selectedChatbot?.name || "export"}_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };
  const [selectedThreadIds, setSelectedThreadIds] = useState(new Set());
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedThreadId = searchParams.get("threadId");

  const fetchThreads = useCallback(async (pageNum = 1, append = false) => {
    if (!selectedChatbot?.id) return;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const cacheKey = `chat_threads_${selectedChatbot.id}_${filter}`;

      if (!append) {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          setThreads(JSON.parse(cachedData));
        }
      }

      // Build query params based on active filter
      const params = new URLSearchParams({ page: pageNum, limit: 20 });
      switch (filter) {
        case "open":
          params.set("resolved", "false");
          params.set("archived", "false");
          break;
        case "escalated":
          params.set("escalated", "true");
          break;
        case "important":
          params.set("important", "true");
          break;
        case "resolved":
          params.set("resolved", "true");
          break;
        case "archived":
          params.set("archived", "true");
          break;
        // "all" — no extra filters
      }

      const response = await api.get(
        `/chatting/${selectedChatbot.id}/threads?${params.toString()}`
      );

      if (response.data?.success) {
        const newThreads = response.data.data.threads;
        const pagination = response.data.data.pagination;

        // Stop if API returned empty threads (page beyond actual data)
        if (newThreads.length === 0) {
          setHasMore(false);
          return;
        }

        if (append) {
          setThreads((prev) => [...prev, ...newThreads]);
        } else {
          setThreads(newThreads);
          sessionStorage.setItem(cacheKey, JSON.stringify(newThreads));
        }

        setPage(pageNum);
        setHasMore(pageNum < pagination.totalPages);
      } else {
        // API returned success: false — stop trying to load more
        if (append) setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch threads:", error);
      // Stop infinite retry on error
      if (append) setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedChatbot?.id, filter]);

  // Always keep a ref to the latest fetchThreads so socket listeners
  // never capture a stale closure.
  const fetchThreadsRef = useRef(fetchThreads);
  useEffect(() => {
    fetchThreadsRef.current = fetchThreads;
  }, [fetchThreads]);

  // Re-fetch when chatbot or filter changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setSelectedThreadIds(new Set());
    fetchThreads(1, false);
  }, [selectedChatbot?.id, filter]);

  const scrollAreaRef = useRef(null);

  const loadMoreThreads = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchThreads(page + 1, true);
  }, [hasMore, page, loadingMore, fetchThreads]);

  // Fetch chatbot appearance icons once per chatbot and store in sessionStorage
  useEffect(() => {
    const fetchAppearance = async () => {
      if (!account?.id || !selectedChatbot?.id) return;
      const cacheKey = `chatbot_appearance_${selectedChatbot.id}`;
      if (sessionStorage.getItem(cacheKey)) return; // already cached
      try {
        const response = await api.get(
          `/chatbots/account/${account.id}/chatbot/${selectedChatbot.id}/appearance`,
        );
        if (response.data?.success) {
          const { botIconSrc, userIconSrc, agentIconSrc } = response.data.data;
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ botIconSrc, userIconSrc, agentIconSrc }),
          );
          // Notify @right slot in case it mounted before this fetch completed
          window.dispatchEvent(
            new CustomEvent("chatbot-appearance-loaded", {
              detail: {
                chatbotId: selectedChatbot.id,
                botIconSrc,
                userIconSrc,
                agentIconSrc,
              },
            }),
          );
        }
      } catch (error) {
        console.error("Failed to fetch chatbot appearance:", error);
      }
    };
    fetchAppearance();
  }, [account?.id, selectedChatbot?.id]);

  // Listen for thread updates from other components (within-page cross-slot events)
  useEffect(() => {
    const handleThreadUpdate = (event) => {
      const { threadId, title } = event.detail;
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, title } : t)),
      );
    };

    window.addEventListener("thread-updated", handleThreadUpdate);
    return () => {
      window.removeEventListener("thread-updated", handleThreadUpdate);
    };
  }, []);

  // Subscribe to the chatbot channel over WebSocket
  useEffect(() => {
    if (!selectedChatbot?.id || !isConnected || !send) return;
    send({ type: "subscribe:chatbot", chatbotId: selectedChatbot.id });
  }, [selectedChatbot?.id, isConnected, send]);

  // React to real-time thread events pushed by the server
  useEffect(() => {
    if (!addListener || !selectedChatbot?.id) return;

    // A new thread was created — always call through the ref so we never
    // invoke a stale closure of fetchThreads.
    const unsubNew = addListener("thread:new", ({ chatbotId }) => {
      if (chatbotId === selectedChatbot.id) {
        fetchThreadsRef.current();
      }
    });

    // A thread's metadata was updated (status, title, escalation, etc.)
    const unsubUpdated = addListener("thread:updated", (thread) => {
      if (thread?.chatbotId === selectedChatbot.id) {
        // Check if this thread will leave the current filter — fade it out
        const wouldMatch = (() => {
          switch (filter) {
            case "open": return !(thread.resolved ?? false) && !(thread.archived ?? false);
            case "escalated": return !!thread.escalated;
            case "important": return !!thread.important;
            case "resolved": return !!thread.resolved;
            case "archived": return !!thread.archived;
            case "all": return true;
            default: return true;
          }
        })();

        if (!wouldMatch && filter !== "all") {
          setFadingThreadIds((prev) => new Set([...prev, thread.id]));
          setTimeout(() => {
            setThreads((prev) =>
              prev.map((t) => (t.id === thread.id ? { ...t, ...thread } : t)),
            );
            setFadingThreadIds((prev) => {
              const next = new Set(prev);
              next.delete(thread.id);
              return next;
            });
          }, 400);
        } else {
          setThreads((prev) =>
            prev.map((t) => (t.id === thread.id ? { ...t, ...thread } : t)),
          );
        }
      }
    });

    // A new message arrived — update thread's last message preview and bump to top
    const unsubMessage = addListener("message:new", (message) => {
      if (!message?.threadId) return;
      setThreads((prev) => {
        const idx = prev.findIndex((t) => t.id === message.threadId);
        if (idx === -1) return prev;
        const updated = {
          ...prev[idx],
          lastMessageContent: message.content,
          lastMessageRole: message.role,
          updatedAt: message.createdAt || new Date().toISOString(),
        };
        // Move thread to top of list
        return [updated, ...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
    });

    // Thread was reset (visitor sent !reset) — old thread ended, new one created
    const unsubReset = addListener("thread:reset", (data) => {
      if (!data) return;
      // Remove old thread and refetch to pick up the new one
      if (data.oldThreadId) {
        setThreads((prev) => prev.filter((t) => t.id !== data.oldThreadId));
      }
      fetchThreadsRef.current();
    });

    return () => {
      unsubNew();
      unsubUpdated();
      unsubMessage();
      unsubReset();
    };
  }, [addListener, selectedChatbot?.id]);

  const handleThreadSelect = (threadId) => {
    const params = new URLSearchParams(searchParams);
    params.set("threadId", threadId);
    router.replace(`?${params.toString()}`);
    // Store selected thread data so right pane can access icon fields immediately
    const thread = threads.find((t) => t.id === threadId);
    if (thread) {
      sessionStorage.setItem(`thread_meta_${threadId}`, JSON.stringify(thread));
    }
    // Clear unread badge immediately in local state
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, unreadMessagesCount: 0 } : t,
      ),
    );
  };

  const toggleSelectAll = () => {
    if (selectedThreadIds.size === threads.length) {
      setSelectedThreadIds(new Set());
    } else {
      setSelectedThreadIds(new Set(threads.map((t) => t.id)));
    }
  };

  const toggleSelectThread = (e, threadId) => {
    e.stopPropagation();
    const newSelected = new Set(selectedThreadIds);
    if (newSelected.has(threadId)) {
      newSelected.delete(threadId);
    } else {
      newSelected.add(threadId);
    }
    setSelectedThreadIds(newSelected);
  };

  const handleBulkUpdate = async (action) => {
    if (!selectedChatbot?.id || selectedThreadIds.size === 0) return;

    setBulkUpdating(true);
    try {
      const payload = Array.from(selectedThreadIds).map((threadId) => {
        const updateObj = { threadId };

        switch (action) {
          case "resolve":
            updateObj.resolved = true;
            break;
          case "unresolve":
            updateObj.resolved = false;
            break;
          case "important":
            updateObj.important = true;
            break;
          case "unimportant":
            updateObj.important = false;
            break;
          case "archive":
            updateObj.archived = true;
            break;
          case "unarchive":
            updateObj.archived = false;
            break;
          case "delete":
            updateObj.archived = true;
            break;
          default:
            break;
        }
        return updateObj;
      });

      const response = await api.patch(
        `/chatting/${selectedChatbot.id}/thread/update-thread`,
        payload,
      );

      if (response.data?.success) {
        // response.data.data.updatedThreads is [[{...}], [{...}]]
        const updatedBatches = response.data.data.updatedThreads;

        // Flatten the array of arrays
        const allUpdatedThreads = updatedBatches.flat();
        const updatedMap = new Map(allUpdatedThreads.map((t) => [t.id, t]));

        // Determine which threads will no longer match the current filter
        const wouldFilter = (thread) => {
          if (selectedVisitor !== "all" && thread.visitorId !== selectedVisitor) return false;
          switch (filter) {
            case "open": return !thread.resolved && !thread.archived;
            case "escalated": return thread.escalated;
            case "important": return thread.important;
            case "resolved": return thread.resolved;
            case "archived": return thread.archived;
            case "all": return true;
            default: return true;
          }
        };

        const idsToFade = new Set();
        for (const [id, updated] of updatedMap) {
          if (!wouldFilter(updated)) {
            idsToFade.add(id);
          }
        }

        // Start fade-out animation for threads leaving the filter
        if (idsToFade.size > 0) {
          setFadingThreadIds(idsToFade);
          // After animation, apply the actual state update and remove fading
          setTimeout(() => {
            setThreads((prevThreads) =>
              prevThreads.map((t) => (updatedMap.has(t.id) ? updatedMap.get(t.id) : t))
            );
            setFadingThreadIds(new Set());
          }, 400);
        } else {
          // No threads leaving the filter, update immediately
          setThreads((prevThreads) =>
            prevThreads.map((t) => (updatedMap.has(t.id) ? updatedMap.get(t.id) : t))
          );
        }

        // Update threads that stay in the filter immediately (non-fading ones)
        if (idsToFade.size > 0) {
          setThreads((prevThreads) =>
            prevThreads.map((t) => {
              if (updatedMap.has(t.id) && !idsToFade.has(t.id)) {
                return updatedMap.get(t.id);
              }
              return t;
            })
          );
        }

        toast.success("Threads updated successfully");
        setSelectedThreadIds(new Set());
      }
    } catch (error) {
      console.error("Bulk update failed:", error);
      toast.error("Failed to update threads");
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleTitleSave = async (threadId) => {
    if (!selectedChatbot?.id || !threadId || !editedTitle.trim()) return;

    try {
      const payload = [
        {
          threadId,
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

        // Update local state
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, title: newTitle } : t)),
        );
        setEditingThreadId(null);

        // Update cache
        const cacheKey = `chat_threads_${selectedChatbot.id}_${filter}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          const threads = JSON.parse(cachedData);
          const updatedThreads = threads.map((t) =>
            t.id === threadId ? { ...t, title: newTitle } : t,
          );
          sessionStorage.setItem(cacheKey, JSON.stringify(updatedThreads));
        }

        // Update single thread meta cache if exists
        const metaKey = `thread_meta_${threadId}`;
        const cachedMeta = sessionStorage.getItem(metaKey);
        if (cachedMeta) {
          const meta = JSON.parse(cachedMeta);
          sessionStorage.setItem(
            metaKey,
            JSON.stringify({ ...meta, title: newTitle }),
          );
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

  const uniqueVisitors = useMemo(() => {
    const visitors = new Map();
    threads.forEach((t) => {
      // If name and email are BOTH null/empty, don't include.
      // But if at least one is present, include.
      if (t.visitorName || t.visitorEmail) {
        if (!visitors.has(t.visitorId)) {
          visitors.set(t.visitorId, {
            id: t.visitorId,
            name: t.visitorName,
            email: t.visitorEmail,
          });
        }
      }
    });
    return Array.from(visitors.values());
  }, [threads]);

  // Filtering is now done server-side; only apply visitor filter client-side
  const filteredThreads = threads.filter((thread) => {
    if (fadingThreadIds.has(thread.id)) return true;
    if (selectedVisitor !== "all" && thread.visitorId !== selectedVisitor) {
      return false;
    }
    return true;
  });

  // Counts reflect loaded threads for the active server-side filter
  const counts = {
    [filter]: filteredThreads.length,
  };

  if (!selectedChatbot) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground text-center">
          Please select a chatbot to view history.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background flex h-full flex-col border-r">
      {/* Header Section */}
      <div className="space-y-4 border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                >
                  <PlayIcon className="h-5 w-5 fill-current" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Watch tutorial</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8"
                  onClick={fetchThreads}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner className="h-4 w-4 text-blue-600" />
                  ) : (
                    <RotateCw className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Threads</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8"
                  onClick={handleDownload}
                  disabled={downloading || threads.length === 0}
                >
                  {downloading ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download CSV</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-9 gap-2 border-dashed transition-all",
                  filter !== "open"
                    ? "border-blue-500 bg-blue-50/50 text-blue-600 hover:bg-blue-100/50 hover:text-blue-700"
                    : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                <Filter className="h-3.5 w-3.5" />
                {filter === "all"
                  ? "All Threads"
                  : `${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                {counts[filter] > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-4 border-0 bg-blue-100 px-1 text-[10px] text-blue-700"
                  >
                    {counts[filter]}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                <DropdownMenuRadioItem value="open" className="text-sm">
                  Open
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="escalated" className="text-sm">
                  Escalated
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="important" className="text-sm">
                  Important
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="resolved" className="text-sm">
                  Resolved
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="archived" className="text-sm">
                  Archived
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem value="all" className="text-sm">
                  All Threads
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Select value={selectedVisitor} onValueChange={setSelectedVisitor}>
            <SelectTrigger className="bg-muted/30 h-9 w-full border-0">
              <SelectValue placeholder="Filter by User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visitors</SelectItem>
              {uniqueVisitors.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name && v.email
                    ? `${v.name} (${v.email})`
                    : v.name || v.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 px-1 pt-2">
          <Checkbox
            checked={
              filteredThreads.length > 0 &&
              selectedThreadIds.size === filteredThreads.length &&
              filteredThreads.every((t) => selectedThreadIds.has(t.id))
            }
            onCheckedChange={() => {
              if (
                selectedThreadIds.size === filteredThreads.length &&
                filteredThreads.every((t) => selectedThreadIds.has(t.id))
              ) {
                setSelectedThreadIds(new Set());
              } else {
                setSelectedThreadIds(new Set(filteredThreads.map((t) => t.id)));
              }
            }}
            className="border-muted-foreground/40 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
          />
          <span className="text-muted-foreground text-sm">Select all</span>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="min-h-0 flex-1">
        <div className="flex flex-col p-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mb-4 flex items-center space-x-4 p-2">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-3 w-[40%]" />
                </div>
              </div>
            ))
          ) : filteredThreads.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No {filter !== "all" ? filter : ""} chat threads found.
            </p>
          ) : (
            <>
            {filteredThreads.map((thread) => {
              const isSelected = selectedThreadIds.has(thread.id);
              const isActive = selectedThreadId === thread.id;

              return (
                <div
                  key={thread.id}
                  className={cn(
                    "group/thread relative flex cursor-pointer items-start gap-3 rounded-lg p-3 overflow-hidden",
                    isActive
                      ? "bg-blue-50/80 dark:bg-blue-950/20"
                      : "hover:bg-muted/40",
                    isSelected && "bg-muted/30",
                  )}
                  style={{
                    transition: "opacity 350ms ease, max-height 350ms ease, padding 350ms ease, margin 350ms ease",
                    ...(fadingThreadIds.has(thread.id)
                      ? { opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0, pointerEvents: "none" }
                      : { opacity: 1, maxHeight: "200px" }),
                  }}
                  onClick={() => handleThreadSelect(thread.id)}
                >
                  {/* Hover/Selected State Indicator line or background handled by class above */}

                  <div
                    className="flex items-center justify-center pt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        toggleSelectThread(
                          { stopPropagation: () => {} },
                          thread.id,
                        )
                      }
                      className="border-muted-foreground/30 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                    />
                  </div>

                  <Avatar
                    className={cn(
                      "h-10 w-10 border-2",
                      isActive
                        ? "border-blue-100"
                        : "bg-muted/20 border-transparent",
                    )}
                  >
                    <AvatarImage src="" />
                    <AvatarFallback
                      className={cn(
                        "text-xs font-medium",
                        // Alternate colors based on id char code (mock logic)
                        thread.id.charCodeAt(0) % 2 === 0
                          ? "bg-blue-50 text-blue-600"
                          : "bg-emerald-50 text-emerald-600",
                      )}
                    >
                      {thread.visitorName
                        ? thread.visitorName.charAt(0).toUpperCase()
                        : "A"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      {editingThreadId === thread.id ? (
                        <div
                          className="mr-2 flex flex-1 items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Input
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="h-6 px-1 py-0 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleTitleSave(thread.id);
                              if (e.key === "Escape") setEditingThreadId(null);
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-green-600 hover:text-green-700"
                            onClick={() => handleTitleSave(thread.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-red-600 hover:text-red-700"
                            onClick={() => setEditingThreadId(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="group/title mr-2 flex min-w-0 flex-1 items-center gap-1.5">
                          <p className="text-foreground/90 truncate text-sm font-semibold">
                            {thread.title ||
                              thread.visitorName ||
                              "Anonymous Visitor"}
                          </p>
                          <Pencil
                            className="text-muted-foreground hover:text-foreground h-3 w-3 cursor-pointer opacity-0 transition-opacity group-hover/thread:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingThreadId(thread.id);
                              setEditedTitle(
                                thread.title ||
                                  thread.visitorName ||
                                  "Anonymous Visitor",
                              );
                            }}
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {thread.unreadMessagesCount > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-1 h-4 bg-blue-100 px-1 text-[10px] text-blue-700"
                          >
                            {thread.unreadMessagesCount}
                          </Badge>
                        )}
                        <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                          {formatThreadTime(thread.startedAt || thread.createdAt)}
                        </span>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                          {thread.resolved && thread.endedAt
                            ? `Ended ${formatThreadTime(thread.endedAt)}`
                            : formatThreadTime(thread.updatedAt)}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 text-xs leading-tight">
                      {thread.lastMessageContent
                        ? `${thread.lastMessageRole === "user" ? "Visitor: " : "AI: "}${thread.lastMessageContent}`
                        : thread.tags && thread.tags.length > 0
                          ? thread.tags.join(", ")
                          : "No preview available..."}
                    </p>

                    <div
                      className="mt-1 flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Status Icons */}
                      {thread.escalated && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-4 w-4 text-amber-500 transition-colors hover:text-amber-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Escalated to human</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {thread.important && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 transition-colors hover:text-yellow-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Marked as important</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {thread.resolved && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 transition-colors hover:text-emerald-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Resolved</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {thread.archived && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Archive className="h-4 w-4 text-slate-400 transition-colors hover:text-slate-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Archived</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {thread.mode === "AI" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Sparkles className="h-4 w-4 text-cyan-500 transition-colors hover:text-cyan-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>AI Mode</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {thread.platformSource && thread.platformSource !== "WIDGET" && (
                        <PlatformBadge platform={thread.platformSource} iconOnly />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {hasMore ? (
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMoreThreads}
                  disabled={loadingMore}
                  className="gap-2"
                >
                  {loadingMore ? (
                    <Spinner className="h-4 w-4 text-blue-600" />
                  ) : (
                    <RotateCw className="h-3.5 w-3.5" />
                  )}
                  {loadingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            ) : (
              filteredThreads.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <div className="bg-border h-px flex-1" />
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    End of conversations
                  </span>
                  <div className="bg-border h-px flex-1" />
                </div>
              )
            )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Bulk Action Bar */}
      <BottomBar
        selectedCount={selectedThreadIds.size}
        onResolve={() => handleBulkUpdate("resolve")}
        onUnresolve={() => handleBulkUpdate("unresolve")}
        onImportant={() => handleBulkUpdate("important")}
        onUnimportant={() => handleBulkUpdate("unimportant")}
        onArchive={() => handleBulkUpdate("archive")}
        onUnarchive={() => handleBulkUpdate("unarchive")}
        onDelete={() => handleBulkUpdate("delete")}
        onClearSelection={() => setSelectedThreadIds(new Set())}
        updating={bulkUpdating}
      />
    </div>
  );
};

export default ChatHistoryMiddle;

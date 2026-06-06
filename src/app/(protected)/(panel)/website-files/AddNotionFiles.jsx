"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Loader2,
  Check,
  Unplug,
  RefreshCw,
  FileText,
  Search,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AddNotionFiles({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;

  const [status, setStatus] = useState({ connected: false, email: null });
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [selectedPageIds, setSelectedPageIds] = useState(new Set());
  const [importing, setImporting] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("descending");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const SORT_OPTIONS = [
    { value: "descending", label: "Last edited (newest)" },
    { value: "ascending", label: "Last edited (oldest)" },
  ];

  const sortedPages = useMemo(() => {
    return [...pages].sort((a, b) => {
      const dateA = new Date(a.lastEditedTime || 0);
      const dateB = new Date(b.lastEditedTime || 0);
      return sortDirection === "descending" ? dateB - dateA : dateA - dateB;
    });
  }, [pages, sortDirection]);

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/oauth-connect/notion/status");
      setStatus(res.data.data);
    } catch {
      setStatus({ connected: false, email: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const fetchPages = useCallback(
    async (cursor = null) => {
      if (!status.connected) return;
      try {
        setPagesLoading(true);
        const params = new URLSearchParams();
        if (cursor) params.set("startCursor", cursor);
        if (searchQuery.trim()) params.set("searchQuery", searchQuery.trim());
        params.set("sortDirection", sortDirection);

        const res = await api.get(`/oauth-connect/notion/files?${params}`);
        const data = res.data.data;

        if (cursor) {
          setPages((prev) => [...prev, ...data.pages]);
        } else {
          setPages(data.pages);
        }
        setNextCursor(data.nextCursor || null);
      } catch (err) {
        if (err.response?.status === 401) {
          setStatus({ connected: false, email: null });
          setPages([]);
          toast.error("Notion session expired. Please reconnect.");
        } else {
          toast.error(err.response?.data?.message || "Failed to load pages");
        }
      } finally {
        setPagesLoading(false);
      }
    },
    [status.connected, searchQuery, sortDirection]
  );

  useEffect(() => {
    if (status.connected) {
      setSelectedPageIds(new Set());
      fetchPages();
    }
  }, [status.connected, fetchPages]);

  // Debounced search
  useEffect(() => {
    if (!status.connected) return;
    const timer = setTimeout(() => {
      setSelectedPageIds(new Set());
      fetchPages();
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleConnect = async () => {
    try {
      const res = await api.get("/oauth-connect/notion/auth");
      window.location.href = res.data.data.authUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start Notion connection");
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await api.delete("/oauth-connect/notion/disconnect");
    } catch {
      // Ignore errors — connection may already be gone
    } finally {
      setStatus({ connected: false, email: null });
      setPages([]);
      setDisconnecting(false);
      toast.success("Notion disconnected");
    }
  };

  const togglePageSelection = (pageId) => {
    setSelectedPageIds((prev) => {
      const next = new Set(prev);
      if (next.has(pageId)) next.delete(pageId);
      else next.add(pageId);
      return next;
    });
  };

  const handleImport = async () => {
    if (!chatbotId) {
      toast.error("No chatbot selected");
      return;
    }
    if (selectedPageIds.size === 0) {
      toast.error("Select at least one page");
      return;
    }

    try {
      setImporting(true);
      const res = await api.post("/oauth-connect/notion/import", {
        pageIds: Array.from(selectedPageIds),
        chatbotId,
      });

      const data = res.data.data;
      if (data.imported > 0) {
        toast.success(res.data.message || `Imported ${data.imported} page(s)`);
        if (onAdd) onAdd();
      }
      if (data.failed > 0) {
        toast.error(`${data.failed} page(s) failed to import`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to import pages");
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center border-b border-slate-200 px-6 py-4">
          <Button variant="ghost" size="sm" className="h-auto p-0 text-slate-500 hover:text-slate-800" onClick={onBack}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <Button variant="ghost" size="sm" className="h-auto p-0 text-slate-500 hover:text-slate-800" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        {status.connected && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-rose-500 hover:text-rose-700"
            onClick={handleDisconnect}
            disabled={disconnecting}
          >
            {disconnecting ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Unplug className="mr-1 h-3 w-3" />}
            Disconnect
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6 sm:p-8">
        <h2 className="mb-1 text-xl font-bold text-slate-800">Notion</h2>
        <p className="mb-4 text-xs text-slate-400">
          Import pages from your Notion workspace. Pages are exported as text for processing.
        </p>

        {!status.connected ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.46 3.11c.66.52 .91.49 2.15.38L19.17 2.2c.26 0 .04-.26-.04-.3L17.04.78c-.39-.3-.91-.52-1.91-.43L3 1.61c-.43.04-.52.26-.34.43zm.69 2.95v13.01c0 .69.34 .95 1.13.87l13.72-.78c.78-.09.87-.52.87-1.08V5.19c0-.56-.22-.87-.69-.82l-14.34.82c-.52.04-.69.3-.69.87zm13.54.52c.09.43 0 .87-.43.91l-.65.13v9.59c-.56.3-1.08.48-1.52.48-.69 0-.87-.22-1.39-.87l-4.24-6.68v6.46l1.35.3s0 .87-.78.87l-2.15.13c-.04-.26 0-.87.43-1l.65-.17V8.54l-.91-.09c-.09-.43.13-1.04.74-1.08l2.32-.17 4.42 6.77v-5.98l-1.13-.13c-.09-.52.26-.87.74-.91zM2.48 1.18L14.87 0c1.52-.13 1.91.04 2.54.52l3.5 2.45c.56.39.74.87.74 1.52v15.32c0 .96-.35 1.52-1.56 1.61l-14.6.87c-.91.04-1.35-.09-1.82-.69L1.16 18.4c-.52-.69-.74-1.22-.74-1.82V2.82c0-.78.35-1.39 1.13-1.56z" fill="#000" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">Connect your Notion workspace</h3>
            <p className="mb-6 max-w-sm text-sm text-slate-500">
              Authorize access to your Notion workspace to browse and import pages. You only need to do this once.
            </p>
            <Button onClick={handleConnect} className="bg-slate-900 font-medium text-white hover:bg-slate-800">
              Connect Notion
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              <Check className="h-4 w-4" />
              Connected as <span className="font-medium">{status.email}</span>
            </div>

            {/* Page list container */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
              {/* Top bar: search + sort + refresh */}
              <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                {/* Search bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pages..."
                    className="w-full rounded border border-slate-300 py-1.5 pl-8 pr-8 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen((o) => !o)}
                    className="flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                    {SORT_OPTIONS.find((o) => o.value === sortDirection)?.label}
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                  {sortDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
                      <div className="absolute right-0 top-full z-20 mt-1 min-w-[190px] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Sort By
                        </div>
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortDirection(opt.value); setSortDropdownOpen(false); setPages([]); }}
                            className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-slate-100 ${
                              sortDirection === opt.value ? "font-medium text-slate-800" : "text-slate-600"
                            }`}
                          >
                            {sortDirection === opt.value && <Check className="h-3.5 w-3.5 text-slate-800" />}
                            {sortDirection !== opt.value && <span className="w-3.5" />}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Refresh */}
                <button onClick={() => fetchPages()} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <RefreshCw className={`h-4 w-4 ${pagesLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Column headers */}
              <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-medium text-slate-500">
                <div className="w-8 shrink-0" />
                <div className="flex-1">Name</div>
                <div className="w-[140px] shrink-0 text-right">Last Edited</div>
              </div>

              {/* Page list */}
              <ScrollArea className="h-50 flex-grow">
                {pagesLoading && pages.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                ) : sortedPages.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">
                    {searchQuery ? "No pages match your search" : "No pages found in your workspace"}
                  </div>
                ) : (
                  <>
                    {sortedPages.map((page) => (
                      <div
                        key={page.id}
                        className={`flex cursor-pointer items-center border-b border-slate-100 px-4 py-2.5 last:border-b-0 hover:bg-blue-50/50 ${
                          selectedPageIds.has(page.id) ? "bg-blue-50" : ""
                        }`}
                        onClick={() => togglePageSelection(page.id)}
                      >
                        <div className="flex w-8 shrink-0 items-center justify-center">
                          <Checkbox
                            checked={selectedPageIds.has(page.id)}
                            onCheckedChange={() => togglePageSelection(page.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                          <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                          <p className="truncate text-sm text-slate-800">
                            {page.icon ? `${page.icon} ` : ""}{page.title || "Untitled"}
                          </p>
                        </div>
                        <div className="w-[140px] shrink-0 text-right">
                          <p className="text-sm text-slate-500">
                            {page.lastEditedTime
                              ? new Date(page.lastEditedTime).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                      </div>
                    ))}

                    {nextCursor && (
                      <div className="border-t border-slate-100 px-4 py-3 text-center">
                        <Button variant="ghost" size="sm" onClick={() => fetchPages(nextCursor)} disabled={pagesLoading}>
                          {pagesLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                          Load More
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </ScrollArea>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {status.connected && (
        <div className="flex items-center gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-3">
          <Button
            onClick={handleImport}
            disabled={importing || selectedPageIds.size === 0}
            size="sm"
            className="bg-blue-500 font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {importing ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Importing...</> : `Import${selectedPageIds.size > 0 ? ` (${selectedPageIds.size})` : ""}`}
          </Button>
          <Button variant="outline" size="sm" onClick={onBack}>
            Cancel
          </Button>
          {selectedPageIds.size > 0 && (
            <span className="ml-auto text-xs text-slate-400">{selectedPageIds.size} page(s) selected</span>
          )}
        </div>
      )}
    </div>
  );
}

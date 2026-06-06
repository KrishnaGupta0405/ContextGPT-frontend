// AddConfluenceFiles.jsx — Two-level: spaces → pages, with import
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Loader2,
  Check,
  Unplug,
  RefreshCw,
  FileText,
  FolderOpen,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AddConfluenceFiles({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;

  const [status, setStatus] = useState({ connected: false, email: null });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [selectedPageIds, setSelectedPageIds] = useState(new Set());
  const [importing, setImporting] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [currentSpace, setCurrentSpace] = useState(null); // null = show spaces, { id, name } = show pages

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/oauth-connect/confluence/status");
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

  const fetchItems = useCallback(
    async (cursor = null) => {
      if (!status.connected) return;
      try {
        setItemsLoading(true);
        const params = new URLSearchParams();
        if (currentSpace) params.set("spaceId", currentSpace.id);
        if (cursor) params.set("cursor", cursor);

        const res = await api.get(`/oauth-connect/confluence/files?${params}`);
        const data = res.data.data;

        if (cursor) {
          setItems((prev) => [...prev, ...data.pages]);
        } else {
          setItems(data.pages);
        }
        setNextCursor(data.nextCursor || null);
      } catch (err) {
        if (err.response?.status === 401) {
          setStatus({ connected: false, email: null });
          setItems([]);
          setCurrentSpace(null);
          toast.error("Confluence session expired. Please reconnect.");
        } else {
          toast.error(err.response?.data?.message || "Failed to load items");
        }
      } finally {
        setItemsLoading(false);
      }
    },
    [status.connected, currentSpace]
  );

  useEffect(() => {
    if (status.connected) {
      setSelectedPageIds(new Set());
      fetchItems();
    }
  }, [status.connected, fetchItems]);

  const handleConnect = async () => {
    try {
      const res = await api.get("/oauth-connect/confluence/auth");
      window.location.href = res.data.data.authUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start Confluence connection");
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await api.delete("/oauth-connect/confluence/disconnect");
    } catch {
      // Ignore errors — connection may already be gone
    } finally {
      setStatus({ connected: false, email: null });
      setItems([]);
      setCurrentSpace(null);
      setDisconnecting(false);
      toast.success("Confluence disconnected");
    }
  };

  const openSpace = (space) => {
    setCurrentSpace({ id: space.id, name: space.name });
    setItems([]);
    setSelectedPageIds(new Set());
    setNextCursor(null);
  };

  const goBackToSpaces = () => {
    setCurrentSpace(null);
    setItems([]);
    setSelectedPageIds(new Set());
    setNextCursor(null);
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
      const res = await api.post("/oauth-connect/confluence/import", {
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
        <h2 className="mb-1 text-xl font-bold text-slate-800">Confluence</h2>
        <p className="mb-4 text-xs text-slate-400">
          Import pages from your Confluence workspace. Pages are exported as text for processing.
        </p>

        {!status.connected ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.04 18.32c-.18.3-.16.68.12.9l3.58 2.72c.16.12.36.18.56.18.22 0 .44-.08.6-.24 0 0 4.42-5.34 9.3-5.34 1.92 0 3.14.62 3.14.62.32.16.7.08.94-.18l2.52-3.2c.2-.26.22-.62.04-.9C22.58 12.46 19.58 10 15.6 10 10.06 10 4.08 15 2.04 18.32zM21.96 5.68c.18-.3.16-.68-.12-.9L18.26 2.06c-.16-.12-.36-.18-.56-.18-.22 0-.44.08-.6.24 0 0-4.42 5.34-9.3 5.34-1.92 0-3.14-.62-3.14-.62-.32-.16-.7-.08-.94.18L1.2 10.22c-.2.26-.22.62-.04.9C1.42 11.54 4.42 14 8.4 14c5.54 0 11.52-5 13.56-8.32z" fill="#0052CC"/>
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">Connect your Confluence workspace</h3>
            <p className="mb-6 max-w-sm text-sm text-slate-500">
              Authorize access to your Confluence workspace to browse and import pages. You only need to do this once.
            </p>
            <Button onClick={handleConnect} className="bg-[#0052CC] font-medium text-white hover:bg-[#0747A6]">
              Connect Confluence
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              <Check className="h-4 w-4" />
              Connected as <span className="font-medium">{status.email}</span>
              {status.siteName && <span className="text-green-600">({status.siteName})</span>}
            </div>

            {/* Breadcrumb for space navigation */}
            {currentSpace && (
              <div className="mb-3 flex items-center gap-1 text-sm text-slate-500">
                <button onClick={goBackToSpaces} className="text-blue-500 hover:text-blue-700 hover:underline">
                  Spaces
                </button>
                <span>/</span>
                <span className="font-medium text-slate-700">{currentSpace.name}</span>
              </div>
            )}

            {/* Items list container */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
              {/* Top bar */}
              <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                <span className="flex-1 text-sm font-medium text-slate-600">
                  {currentSpace ? "Pages" : "Spaces"}
                </span>
                <button onClick={() => fetchItems()} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <RefreshCw className={`h-4 w-4 ${itemsLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Column headers */}
              <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-medium text-slate-500">
                {currentSpace && <div className="w-8 shrink-0" />}
                <div className="flex-1">Name</div>
              </div>

              {/* List */}
              <ScrollArea className="h-50 flex-grow">
                {itemsLoading && items.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">
                    {currentSpace ? "No pages found in this space" : "No spaces found"}
                  </div>
                ) : (
                  <>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex cursor-pointer items-center border-b border-slate-100 px-4 py-2.5 last:border-b-0 hover:bg-blue-50/50 ${
                          selectedPageIds.has(item.id) ? "bg-blue-50" : ""
                        }`}
                        onClick={() => {
                          if (item.isSpace) {
                            openSpace(item);
                          } else {
                            togglePageSelection(item.id);
                          }
                        }}
                      >
                        {currentSpace && (
                          <div className="flex w-8 shrink-0 items-center justify-center">
                            <Checkbox
                              checked={selectedPageIds.has(item.id)}
                              onCheckedChange={() => togglePageSelection(item.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                          {item.isSpace ? (
                            <FolderOpen className="h-4 w-4 shrink-0 text-blue-400" />
                          ) : (
                            <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                          )}
                          <p className="truncate text-sm text-slate-800">
                            {item.name || item.title || "Untitled"}
                          </p>
                          {item.key && (
                            <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                              {item.key}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {nextCursor && (
                      <div className="border-t border-slate-100 px-4 py-3 text-center">
                        <Button variant="ghost" size="sm" onClick={() => fetchItems(nextCursor)} disabled={itemsLoading}>
                          {itemsLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
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
      {status.connected && currentSpace && (
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

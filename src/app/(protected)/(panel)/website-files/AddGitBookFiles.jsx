// AddGitBookFiles.jsx — Token-based: paste personal access token, then browse spaces → pages
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
  Eye,
  EyeOff,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export function AddGitBookFiles({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;

  const [status, setStatus] = useState({ connected: false, email: null });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [selectedPageIds, setSelectedPageIds] = useState(new Set());
  const [importing, setImporting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [currentSpace, setCurrentSpace] = useState(null);

  // Token input state
  const [tokenInput, setTokenInput] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/oauth-connect/gitbook/status");
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
    async () => {
      if (!status.connected) return;
      try {
        setItemsLoading(true);
        const params = new URLSearchParams();
        if (currentSpace) params.set("spaceId", currentSpace.id);

        const res = await api.get(`/oauth-connect/gitbook/files?${params}`);
        const data = res.data.data;
        setItems(data.pages);
      } catch (err) {
        if (err.response?.status === 401) {
          setStatus({ connected: false, email: null });
          setItems([]);
          setCurrentSpace(null);
          toast.error("GitBook session expired. Please reconnect.");
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
    if (!tokenInput.trim()) {
      toast.error("Please paste your GitBook personal access token");
      return;
    }
    try {
      setConnecting(true);
      const res = await api.post("/oauth-connect/gitbook/connect", {
        accessToken: tokenInput.trim(),
      });
      setStatus(res.data.data);
      setTokenInput("");
      setShowToken(false);
      toast.success(res.data.message || "GitBook connected!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to connect GitBook");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await api.delete("/oauth-connect/gitbook/disconnect");
    } catch {
      // Ignore errors — connection may already be gone
    } finally {
      setStatus({ connected: false, email: null });
      setItems([]);
      setCurrentSpace(null);
      setDisconnecting(false);
      toast.success("GitBook disconnected");
    }
  };

  const openSpace = (space) => {
    setCurrentSpace({ id: space.id, name: space.name });
    setItems([]);
    setSelectedPageIds(new Set());
  };

  const goBackToSpaces = () => {
    setCurrentSpace(null);
    setItems([]);
    setSelectedPageIds(new Set());
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
      const res = await api.post("/oauth-connect/gitbook/import", {
        pageIds: Array.from(selectedPageIds),
        chatbotId,
        spaceId: currentSpace.id,
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
        <h2 className="mb-1 text-xl font-bold text-slate-800">GitBook</h2>
        <p className="mb-4 text-xs text-slate-400">
          Import pages from your GitBook spaces. Pages are exported as text for processing.
        </p>

        {!status.connected ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.802 17.77a.703.703 0 1 1-.002 1.406.703.703 0 0 1 .002-1.406m11.024-4.347a.559.559 0 0 1 .558.558c0 .307-.25.558-.558.558a.558.558 0 0 1-.557-.558c0-.308.25-.558.557-.558m-11.024 3.79a1.26 1.26 0 1 0 0 2.52 1.26 1.26 0 0 0 0-2.52m11.024-4.347a1.116 1.116 0 1 0 0 2.232 1.116 1.116 0 0 0 0-2.232M14.757 3.97l-3.29 3.29a3.426 3.426 0 0 0-.978 2.416v5.628a3.426 3.426 0 0 0 .978 2.416l3.29 3.29a.558.558 0 0 0 .79-.79l-3.29-3.29a2.312 2.312 0 0 1-.66-1.627V9.677c0-.613.237-1.19.66-1.627l3.29-3.29a.558.558 0 0 0-.79-.79" fill="#3B82F6"/>
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">Connect your GitBook</h3>
            <p className="mb-6 max-w-sm text-sm text-slate-500">
              Paste your GitBook personal access token to browse and import documentation pages.
              You can create one at{" "}
              <a
                href="https://app.gitbook.com/account/developer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                GitBook Developer Settings
              </a>.
            </p>
            <div className="flex w-full max-w-md items-center gap-2 px-4">
              <div className="relative flex-1">
                <Input
                  type={showToken ? "text" : "password"}
                  placeholder="Paste your personal access token"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                onClick={handleConnect}
                disabled={connecting || !tokenInput.trim()}
                className="bg-blue-500 font-medium text-white hover:bg-blue-600"
              >
                {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              <Check className="h-4 w-4" />
              Connected{status.email ? <> as <span className="font-medium">{status.email}</span></> : null}
            </div>

            {/* Breadcrumb */}
            {currentSpace && (
              <div className="mb-3 flex items-center gap-1 text-sm text-slate-500">
                <button onClick={goBackToSpaces} className="text-blue-500 hover:text-blue-700 hover:underline">
                  Spaces
                </button>
                <span>/</span>
                <span className="font-medium text-slate-700">{currentSpace.name}</span>
              </div>
            )}

            {/* Items list */}
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
                {!currentSpace && <div className="w-[120px] shrink-0 text-right">Organization</div>}
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
                  items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex cursor-pointer items-center border-b border-slate-100 px-4 py-2.5 last:border-b-0 hover:bg-blue-50/50 ${
                        selectedPageIds.has(item.id) ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        if (item.isSpace) openSpace(item);
                        else togglePageSelection(item.id);
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
                      </div>
                      {!currentSpace && item.orgName && (
                        <div className="w-[120px] shrink-0 text-right text-sm text-slate-500">
                          {item.orgName}
                        </div>
                      )}
                    </div>
                  ))
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

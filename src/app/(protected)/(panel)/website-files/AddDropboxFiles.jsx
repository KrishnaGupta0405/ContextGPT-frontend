"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  FolderOpen,
  Check,
  Unplug,
  RefreshCw,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTypeIcon } from "@/components/FileTypeIcon";

const ALLOWED_EXTENSIONS = ".pdf, .txt, .doc, .docx, .csv, .xls, .xlsx, .ppt, .pptx, .md, .html, .htm, .rtf";

function formatFileSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AddDropboxFiles({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;

  const [status, setStatus] = useState({ connected: false, email: null });
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [selectedFilePaths, setSelectedFilePaths] = useState(new Map()); // id -> path
  const [importing, setImporting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [folderStack, setFolderStack] = useState([{ path: "", name: "Dropbox" }]);
  const [nextCursor, setNextCursor] = useState(null);

  const currentPath = folderStack[folderStack.length - 1].path;

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/oauth-connect/dropbox/status");
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

  const fetchFiles = useCallback(
    async (cursor = null) => {
      if (!status.connected) return;
      try {
        setFilesLoading(true);
        const params = new URLSearchParams();
        if (!cursor) params.set("path", currentPath);
        if (cursor) params.set("cursor", cursor);

        const res = await api.get(`/oauth-connect/dropbox/files?${params}`);
        const data = res.data.data;

        if (cursor) {
          setFiles((prev) => [...prev, ...data.files]);
        } else {
          setFiles(data.files);
        }
        setNextCursor(data.cursor || null);
      } catch (err) {
        if (err.response?.status === 401) {
          setStatus({ connected: false, email: null });
          setFiles([]);
          setFolderStack([{ path: "", name: "Dropbox" }]);
          toast.error("Dropbox session expired. Please reconnect.");
        } else {
          toast.error(err.response?.data?.message || "Failed to load files");
        }
      } finally {
        setFilesLoading(false);
      }
    },
    [status.connected, currentPath]
  );

  useEffect(() => {
    if (status.connected) {
      setSelectedFilePaths(new Map());
      fetchFiles();
    }
  }, [status.connected, currentPath, fetchFiles]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleConnect = async () => {
    try {
      const res = await api.get("/oauth-connect/dropbox/auth");
      window.location.href = res.data.data.authUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start Dropbox connection");
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await api.delete("/oauth-connect/dropbox/disconnect");
    } catch {
      // Ignore errors — connection may already be gone
    } finally {
      setStatus({ connected: false, email: null });
      setFiles([]);
      setFolderStack([{ path: "", name: "Dropbox" }]);
      setDisconnecting(false);
      toast.success("Dropbox disconnected");
    }
  };

  const handleFolderClick = (folder) => {
    setFolderStack((prev) => [...prev, { path: folder.path, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index) => {
    setFolderStack((prev) => prev.slice(0, index + 1));
  };

  const toggleFileSelection = (file) => {
    setSelectedFilePaths((prev) => {
      const next = new Map(prev);
      if (next.has(file.id)) next.delete(file.id);
      else next.set(file.id, file.path);
      return next;
    });
  };

  const handleImport = async () => {
    if (!chatbotId) {
      toast.error("No chatbot selected");
      return;
    }
    if (selectedFilePaths.size === 0) {
      toast.error("Select at least one file");
      return;
    }

    try {
      setImporting(true);
      const res = await api.post("/oauth-connect/dropbox/import", {
        filePaths: Array.from(selectedFilePaths.values()),
        chatbotId,
      });

      const data = res.data.data;
      if (data.imported > 0) {
        toast.success(res.data.message || `Imported ${data.imported} file(s)`);
        if (onAdd) onAdd();
      }
      if (data.failed > 0) {
        toast.error(`${data.failed} file(s) failed to import`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to import files");
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
        <h2 className="mb-1 text-xl font-bold text-slate-800">Dropbox</h2>
        <p className="mb-4 text-xs text-slate-400">
          Allowed file types: <span className="font-medium text-slate-500">{ALLOWED_EXTENSIONS}</span>
        </p>

        {!status.connected ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2l6 3.75L6 9.5 0 5.75zm12 0l6 3.75-6 3.75-6-3.75zM0 13.25L6 9.5l6 3.75L6 17zm18-3.75l6 3.75-6 3.75-6-3.75zM6 18.25l6-3.75 6 3.75-6 3.75z" fill="#0061FF" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">Connect your Dropbox</h3>
            <p className="mb-6 max-w-sm text-sm text-slate-500">
              Sign in with Dropbox to browse and import files directly. You only need to do this once.
            </p>
            <Button onClick={handleConnect} className="bg-blue-500 font-medium text-white hover:bg-blue-600">
              Connect Dropbox
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              <Check className="h-4 w-4" />
              Connected as <span className="font-medium">{status.email}</span>
            </div>

            {/* Breadcrumb */}
            <div className="mb-3 flex items-center gap-1 text-sm text-slate-500">
              {folderStack.map((folder, i) => (
                <React.Fragment key={folder.path + i}>
                  {i > 0 && <ChevronRight className="h-3 w-3" />}
                  <button
                    onClick={() => handleBreadcrumbClick(i)}
                    className={`hover:text-blue-600 ${i === folderStack.length - 1 ? "font-medium text-slate-800" : ""}`}
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
              <button onClick={() => fetchFiles()} className="ml-auto text-slate-400 hover:text-slate-600">
                <RefreshCw className={`h-3.5 w-3.5 ${filesLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* File list */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
              <ScrollArea className="h-50 flex-grow">
                {filesLoading && files.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                ) : files.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">No files found in this folder</div>
                ) : (
                  <>
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                          file.supported === false ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-slate-50"
                        } ${selectedFilePaths.has(file.id) ? "bg-blue-50" : ""}`}
                        onClick={() => {
                          if (file.isFolder) handleFolderClick(file);
                          else if (file.supported !== false) toggleFileSelection(file);
                        }}
                      >
                        {file.isFolder ? (
                          <FolderOpen className="h-5 w-5 shrink-0 text-amber-500" />
                        ) : (
                          <>
                            <Checkbox
                              checked={selectedFilePaths.has(file.id)}
                              onCheckedChange={() => toggleFileSelection(file)}
                              onClick={(e) => e.stopPropagation()}
                              disabled={file.supported === false}
                              className="shrink-0"
                            />
                            <FileTypeIcon fileName={file.name} className="h-5 w-5 shrink-0" />
                          </>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-400">
                            {file.isFolder ? "Folder" : formatFileSize(file.size)}
                            {file.modifiedTime && !file.isFolder && (
                              <> · {new Date(file.modifiedTime).toLocaleDateString()}</>
                            )}
                            {!file.isFolder && file.supported === false && (
                              <span className="ml-1 text-rose-400">· Unsupported</span>
                            )}
                          </p>
                        </div>
                        {file.isFolder && <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />}
                      </div>
                    ))}

                    {nextCursor && (
                      <div className="border-t border-slate-100 px-4 py-3 text-center">
                        <Button variant="ghost" size="sm" onClick={() => fetchFiles(nextCursor)} disabled={filesLoading}>
                          {filesLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
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

      {status.connected && (
        <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              {selectedFilePaths.size > 0 ? `${selectedFilePaths.size} file(s) selected` : "No files selected"}
            </span>
            <Button
              onClick={handleImport}
              disabled={importing || selectedFilePaths.size === 0}
              className={`font-medium text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                selectedFilePaths.size > 0
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-slate-300"
              }`}
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
                </>
              ) : (
                `Import Selected${selectedFilePaths.size > 0 ? ` (${selectedFilePaths.size})` : ""}`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

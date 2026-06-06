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
  Lock,
  Globe,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { FileTypeIcon } from "@/components/FileTypeIcon";

const ALLOWED_EXTENSIONS = ".pdf, .txt, .doc, .docx, .csv, .xls, .xlsx, .ppt, .pptx, .md, .html, .htm, .rtf";

function formatFileSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AddGithubFiles({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;

  const [status, setStatus] = useState({ connected: false, email: null });
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Map()); // id -> { path, downloadUrl }
  const [importing, setImporting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // GitHub-specific: repo browsing vs file browsing
  const [selectedRepo, setSelectedRepo] = useState(null); // "owner/repo"
  const [folderStack, setFolderStack] = useState([]); // path segments within a repo
  const [nextPage, setNextPage] = useState(null);
  const [isRepoList, setIsRepoList] = useState(true);

  const currentPath = folderStack.join("/");

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/oauth-connect/github/status");
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
    async (page = null) => {
      if (!status.connected) return;
      try {
        setFilesLoading(true);
        const params = new URLSearchParams();
        if (selectedRepo) {
          params.set("repo", selectedRepo);
          if (currentPath) params.set("path", currentPath);
        }
        if (page) params.set("page", page);

        const res = await api.get(`/oauth-connect/github/files?${params}`);
        const data = res.data.data;

        setIsRepoList(!!data.isRepoList);

        if (page && !data.isRepoList) {
          setFiles((prev) => [...prev, ...data.files]);
        } else {
          setFiles(data.files);
        }
        setNextPage(data.nextPage || null);
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.message || "";
        if (status === 401) {
          setStatus({ connected: false, email: null });
          setFiles([]);
          setSelectedRepo(null);
          setFolderStack([]);
          toast.error("GitHub session expired. Please reconnect.");
        } else if (msg.includes("This repository is empty") || (status === 500 && msg.includes("404"))) {
          toast.error("This repository is empty. Please select a different repository.");
          setSelectedRepo(null);
          setFolderStack([]);
          setFiles([]);
        } else {
          toast.error(msg || "Failed to load files");
        }
      } finally {
        setFilesLoading(false);
      }
    },
    [status.connected, selectedRepo, currentPath]
  );

  useEffect(() => {
    if (status.connected) {
      setSelectedFiles(new Map());
      fetchFiles();
    }
  }, [status.connected, selectedRepo, currentPath, fetchFiles]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleConnect = async () => {
    try {
      const res = await api.get("/oauth-connect/github/auth");
      window.location.href = res.data.data.authUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start GitHub connection");
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await api.delete("/oauth-connect/github/disconnect");
    } catch {
      // Ignore errors — connection may already be gone
    } finally {
      setStatus({ connected: false, email: null });
      setFiles([]);
      setSelectedRepo(null);
      setFolderStack([]);
      setDisconnecting(false);
      toast.success("GitHub disconnected");
    }
  };

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo.id); // full_name like "owner/repo"
    setFolderStack([]);
  };

  const handleFolderClick = (folder) => {
    setFolderStack((prev) => [...prev, folder.name]);
  };

  const handleBreadcrumbToRepos = () => {
    setSelectedRepo(null);
    setFolderStack([]);
  };

  const handleBreadcrumbClick = (index) => {
    setFolderStack((prev) => prev.slice(0, index + 1));
  };

  const toggleFileSelection = (file) => {
    setSelectedFiles((prev) => {
      const next = new Map(prev);
      if (next.has(file.id)) {
        next.delete(file.id);
      } else {
        next.set(file.id, { path: file.path, downloadUrl: file.downloadUrl });
      }
      return next;
    });
  };

  const handleImport = async () => {
    if (!chatbotId) {
      toast.error("No chatbot selected");
      return;
    }
    if (selectedFiles.size === 0) {
      toast.error("Select at least one file");
      return;
    }

    try {
      setImporting(true);
      const filesPayload = Array.from(selectedFiles.entries()).map(([, val]) => ({
        path: val.path,
        downloadUrl: val.downloadUrl,
      }));

      const res = await api.post("/oauth-connect/github/import", {
        files: filesPayload,
        repo: selectedRepo,
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
        <h2 className="mb-1 text-xl font-bold text-slate-800">GitHub</h2>
        <p className="mb-4 text-xs text-slate-400">
          Allowed file types: <span className="font-medium text-slate-500">{ALLOWED_EXTENSIONS}</span>
        </p>

        {!status.connected ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" fill="#181717" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">Connect your GitHub</h3>
            <p className="mb-6 max-w-sm text-sm text-slate-500">
              Sign in with GitHub to browse repositories and import files. You only need to do this once.
            </p>
            <Button onClick={handleConnect} className="bg-slate-800 font-medium text-white hover:bg-slate-900">
              Connect GitHub
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
              <button
                onClick={handleBreadcrumbToRepos}
                className={`hover:text-blue-600 ${isRepoList ? "font-medium text-slate-800" : ""}`}
              >
                Repositories
              </button>
              {selectedRepo && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <button
                    onClick={() => setFolderStack([])}
                    className={`hover:text-blue-600 ${folderStack.length === 0 ? "font-medium text-slate-800" : ""}`}
                  >
                    {selectedRepo}
                  </button>
                </>
              )}
              {folderStack.map((segment, i) => (
                <React.Fragment key={i}>
                  <ChevronRight className="h-3 w-3" />
                  <button
                    onClick={() => handleBreadcrumbClick(i)}
                    className={`hover:text-blue-600 ${i === folderStack.length - 1 ? "font-medium text-slate-800" : ""}`}
                  >
                    {segment}
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
                <div className="py-12 text-center text-sm text-slate-400">
                  {isRepoList ? "No repositories found" : "No supported files found in this folder"}
                </div>
              ) : (
                <>
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                        file.supported === false ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-slate-50"
                      } ${selectedFiles.has(file.id) ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        if (isRepoList) handleRepoClick(file);
                        else if (file.isFolder) handleFolderClick(file);
                        else if (file.supported !== false) toggleFileSelection(file);
                      }}
                    >
                      {file.isFolder ? (
                        <FolderOpen className="h-5 w-5 shrink-0 text-amber-500" />
                      ) : (
                        <>
                          <Checkbox
                            checked={selectedFiles.has(file.id)}
                            onCheckedChange={() => toggleFileSelection(file)}
                            onClick={(e) => e.stopPropagation()}
                            disabled={file.supported === false}
                            className="shrink-0"
                          />
                          {!isRepoList && <FileTypeIcon fileName={file.name} className="h-5 w-5 shrink-0" />}
                        </>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                        <p className="text-xs text-slate-400">
                          {isRepoList ? (
                            <>
                              {file.description || "No description"}
                              {file.modifiedTime && (
                                <> · Updated {new Date(file.modifiedTime).toLocaleDateString()}</>
                              )}
                            </>
                          ) : (
                            <>
                              {file.isFolder ? "Folder" : formatFileSize(file.size)}
                              {!file.isFolder && file.supported === false && (
                                <span className="ml-1 text-rose-400">· Unsupported</span>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                      {isRepoList && (
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {file.private ? (
                                <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              ) : (
                                <Globe className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{file.private ? "Private repository" : "Public repository"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {file.isFolder && <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />}
                    </div>
                  ))}

                  {nextPage && (
                    <div className="border-t border-slate-100 px-4 py-3 text-center">
                      <Button variant="ghost" size="sm" onClick={() => fetchFiles(nextPage)} disabled={filesLoading}>
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
              {selectedFiles.size > 0 ? `${selectedFiles.size} file(s) selected` : "No files selected"}
            </span>
            <Button
              onClick={handleImport}
              disabled={importing || selectedFiles.size === 0}
              className={`font-medium text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                selectedFiles.size > 0
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-slate-300"
              }`}
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
                </>
              ) : (
                `Import Selected${selectedFiles.size > 0 ? ` (${selectedFiles.size})` : ""}`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

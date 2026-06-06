"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  FolderOpen,
  Check,
  Unplug,
  RefreshCw,
  Search,
  ArrowUpDown,
  ChevronDown,
  X,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTypeIcon } from "@/components/FileTypeIcon";

const ALLOWED_EXTENSIONS = ".pdf, .txt, .doc, .docx, .csv, .xls, .xlsx, .ppt, .pptx, .md, .html, .htm, .rtf";

function formatFileSize(bytes) {
  if (!bytes || bytes === "0") return "—";
  const n = Number(bytes);
  if (n === 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function AddMegaCloudFiles({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;

  // Credentials kept in component state only — cleared when modal unmounts
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState(new Set());
  const [importing, setImporting] = useState(false);
  const [folderStack, setFolderStack] = useState([{ id: "root", name: "Cloud Drive" }]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [fileTypeDropdownOpen, setFileTypeDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState("modifiedTime");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [consentSessionStorage, setConsentSessionStorage] = useState(false);

  const currentFolderId = folderStack[folderStack.length - 1].id;

  const FILE_TYPE_OPTIONS = [
    { value: "all", label: "All file types" },
    { value: "folder", label: "Folders" },
    { value: "document", label: "Documents" },
    { value: "spreadsheet", label: "Spreadsheets" },
    { value: "pdf", label: "PDFs" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
  ];

  const SORT_OPTIONS = [
    { value: "modifiedTime", label: "Last modified" },
    { value: "name", label: "Name" },
    { value: "size", label: "Size" },
  ];

  const isDriveWideSearch = fileTypeFilter !== "all";

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;

      if (sortField === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortField === "size") {
        return (Number(b.size) || 0) - (Number(a.size) || 0);
      }
      if (sortField === "owner") {
        return (a.ownerName || "").localeCompare(b.ownerName || "");
      }
      return new Date(b.modifiedTime || 0) - new Date(a.modifiedTime || 0);
    });
  }, [files, sortField]);

  const fetchFiles = useCallback(
    async (pageToken = null) => {
      if (!connected || !loginEmail || !loginPassword) return;
      try {
        setFilesLoading(true);
        const body = {
          email: loginEmail,
          password: loginPassword,
        };

        if (fileTypeFilter !== "all") {
          body.fileType = fileTypeFilter;
        } else {
          body.folderId = currentFolderId;
        }

        if (searchQuery.trim()) {
          body.searchQuery = searchQuery.trim();
        }
        if (pageToken) body.pageToken = pageToken;

        const res = await api.post("/oauth-connect/mega/files", body);
        const data = res.data.data;

        if (pageToken) {
          setFiles((prev) => [...prev, ...data.files]);
        } else {
          setFiles(data.files);
        }
        setNextPageToken(data.nextPageToken);
      } catch (err) {
        if (err.response?.status === 401) {
          setConnected(false);
          toast.error("MEGA session expired. Please sign in again.");
        } else {
          toast.error(err.response?.data?.message || "Failed to load files");
        }
      } finally {
        setFilesLoading(false);
      }
    },
    [connected, loginEmail, loginPassword, currentFolderId, fileTypeFilter, searchQuery]
  );

  useEffect(() => {
    if (connected) {
      setSelectedFileIds(new Set());
      fetchFiles();
    }
  }, [connected, currentFolderId, fileTypeFilter, fetchFiles]);

  useEffect(() => {
    if (!connected) return;
    const timer = setTimeout(() => {
      setSelectedFileIds(new Set());
      fetchFiles();
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleConnect = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Please enter your MEGA email and password");
      return;
    }
    try {
      setConnecting(true);
      await api.post("/oauth-connect/mega/auth", {
        email: loginEmail.trim(),
        password: loginPassword,
        consentSessionStorage,
      });
      toast.success("MEGA connected successfully!");
      setLoginEmail(loginEmail.trim());
      setConnected(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to connect to MEGA");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await api.delete("/oauth-connect/mega/disconnect");
      setConnected(false);
      setLoginPassword("");
      setFiles([]);
      setFolderStack([{ id: "root", name: "Cloud Drive" }]);
      toast.success("MEGA disconnected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to disconnect");
    } finally {
      setDisconnecting(false);
    }
  };

  const handleFolderClick = (folder) => {
    setFolderStack((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index) => {
    setFolderStack((prev) => prev.slice(0, index + 1));
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  };

  const handleImport = async () => {
    if (!chatbotId) {
      toast.error("No chatbot selected");
      return;
    }
    if (selectedFileIds.size === 0) {
      toast.error("Select at least one file");
      return;
    }

    try {
      setImporting(true);
      const res = await api.post("/oauth-connect/mega/import", {
        email: loginEmail,
        password: loginPassword,
        fileIds: Array.from(selectedFileIds),
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <Button variant="ghost" size="sm" className="h-auto p-0 text-slate-500 hover:text-slate-800" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        {connected && (
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
        <h2 className="mb-1 text-xl font-bold text-slate-800">MEGA</h2>

        <p className="mb-4 text-xs text-slate-400">
          Allowed file types: <span className="font-medium text-slate-500">{ALLOWED_EXTENSIONS}</span>
        </p>

        {!connected ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg className="h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.18L20.18 7v10L12 21.82 3.82 17V7L12 2.18z" fill="#D9272E" />
                <path d="M12 5.5L6 9v6l6 3.5L18 15V9l-6-3.5zm0 1.73L16.18 10v4L12 16.77 7.82 14v-4L12 7.23z" fill="#D9272E" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">Sign in to MEGA</h3>
            <div className="mb-6 flex items-center justify-center gap-1.5">
              <p className="max-w-sm text-sm text-slate-500">
                Sign in to browse and import files.
              </p>
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip((v) => !v)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <Info className="h-4 w-4" />
                </button>
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 shadow-lg">
                    <p className="font-medium text-slate-700 mb-1">Your password is safe</p>
                    <p>Your password is <span className="font-medium">never stored</span> on our servers or database. It is only held temporarily in your browser while this panel is open and is used to authenticate directly with MEGA. Once you close this panel, your password is erased from memory.</p>
                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-3">
              <input
                type="email"
                placeholder="MEGA email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <Checkbox
                  checked={consentSessionStorage}
                  onCheckedChange={(checked) => setConsentSessionStorage(!!checked)}
                  className="mt-0.5"
                />
                <span className="text-xs text-slate-500 text-left leading-relaxed">
                  Allow storing password in the frontend session storage for file access using megajs
                </span>
              </label>
              <Button onClick={handleConnect} disabled={!consentSessionStorage || connecting} className="bg-red-600 font-medium text-white hover:bg-red-700">
                {connecting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</> : "Connect MEGA"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              <Check className="h-4 w-4" />
              Connected as <span className="font-medium">{loginEmail}</span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
              {/* Top bar */}
              <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                {/* File type dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setFileTypeDropdownOpen((o) => !o)}
                    className="flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {FILE_TYPE_OPTIONS.find((o) => o.value === fileTypeFilter)?.label}
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                  {fileTypeDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setFileTypeDropdownOpen(false)} />
                      <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          File Type
                        </div>
                        {FILE_TYPE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setFileTypeFilter(opt.value); setFileTypeDropdownOpen(false); setFiles([]); }}
                            className={`flex w-full items-center px-3 py-1.5 text-sm hover:bg-slate-100 ${
                              fileTypeFilter === opt.value ? "font-medium text-red-600" : "text-slate-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files..."
                    className="w-full rounded border border-slate-300 py-1.5 pl-8 pr-8 text-sm text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button onClick={() => fetchFiles()} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <RefreshCw className={`h-4 w-4 ${filesLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Breadcrumb */}
              {!isDriveWideSearch && (
                <div className="flex items-center gap-1 border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
                  {folderStack.map((folder, i) => (
                    <React.Fragment key={folder.id}>
                      {i > 0 && <ChevronRight className="h-3 w-3" />}
                      <button
                        onClick={() => handleBreadcrumbClick(i)}
                        className={`hover:text-red-600 ${i === folderStack.length - 1 ? "font-medium text-slate-700" : ""}`}
                      >
                        {folder.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              )}
              {isDriveWideSearch && (
                <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
                  Showing <span className="font-medium text-slate-700">{FILE_TYPE_OPTIONS.find((o) => o.value === fileTypeFilter)?.label}</span> across your entire MEGA storage
                </div>
              )}

              {/* Column headers */}
              <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-medium text-slate-500">
                <div className="w-8 shrink-0" />
                <div className="flex-1">Name</div>
                <button onClick={() => setSortField((prev) => prev === "owner" ? "modifiedTime" : "owner")} className={`w-[140px] shrink-0 text-left hover:text-slate-700 ${sortField === "owner" ? "font-semibold text-slate-700" : ""}`}>Owner{sortField === "owner" && <ArrowUpDown className="ml-1 inline h-3 w-3" />}</button>
                <div className="w-[80px] shrink-0 text-right">Size</div>
                <div className="flex w-[120px] shrink-0 items-center justify-end gap-1">
                  {SORT_OPTIONS.find((o) => o.value === sortField)?.label}
                  <div className="relative">
                    <button
                      onClick={() => setSortDropdownOpen((o) => !o)}
                      className="rounded p-0.5 hover:bg-slate-200"
                      title="Sort by"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                    {sortDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
                        <div className="absolute right-0 top-full z-20 mt-1 min-w-[170px] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                          {SORT_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => { setSortField(opt.value); setSortDropdownOpen(false); }}
                              className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-slate-100 ${
                                sortField === opt.value ? "font-medium text-slate-800" : "text-slate-600"
                              }`}
                            >
                              {sortField === opt.value && <Check className="h-3.5 w-3.5 text-slate-800" />}
                              {sortField !== opt.value && <span className="w-3.5" />}
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* File list */}
              <ScrollArea className="h-50 flex-grow">
                {filesLoading && files.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                ) : sortedFiles.length === 0 ? (
                  <div className="py-16 text-center text-sm text-slate-400">
                    {searchQuery || isDriveWideSearch ? "No files match your search" : "No files found in this folder"}
                  </div>
                ) : (
                  <>
                    {sortedFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center border-b border-slate-100 px-4 py-2.5 last:border-b-0 ${
                          file.supported === false ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-red-50/50"
                        } ${selectedFileIds.has(file.id) ? "bg-red-50" : ""}`}
                        onClick={() => {
                          if (file.isFolder) handleFolderClick(file);
                          else if (file.supported !== false) toggleFileSelection(file.id);
                        }}
                      >
                        <div className="flex w-8 shrink-0 items-center justify-center">
                          {file.isFolder ? (
                            <FolderOpen className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Checkbox
                              checked={selectedFileIds.has(file.id)}
                              onCheckedChange={() => toggleFileSelection(file.id)}
                              onClick={(e) => e.stopPropagation()}
                              disabled={file.supported === false}
                            />
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                          {!file.isFolder && <FileTypeIcon mimeType={file.mimeType} fileName={file.name} className="h-5 w-5 shrink-0" />}
                          <p className="truncate text-sm text-slate-800">{file.name}</p>
                          {!file.isFolder && file.supported === false && (
                            <span className="shrink-0 text-xs text-rose-400">Unsupported</span>
                          )}
                        </div>

                        <div className="w-[140px] shrink-0">
                          <p className="truncate text-sm text-slate-500">{file.ownerName || "—"}</p>
                        </div>

                        <div className="w-[80px] shrink-0 text-right">
                          <p className="text-sm text-slate-500">{file.isFolder ? "—" : formatFileSize(file.size)}</p>
                        </div>

                        <div className="w-[120px] shrink-0 text-right">
                          <p className="text-sm text-slate-500">
                            {file.modifiedTime
                              ? new Date(file.modifiedTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                              : "—"}
                          </p>
                        </div>
                      </div>
                    ))}

                    {nextPageToken && (
                      <div className="border-t border-slate-100 px-4 py-3 text-center">
                        <Button variant="ghost" size="sm" onClick={() => fetchFiles(nextPageToken)} disabled={filesLoading}>
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

      {/* Footer */}
      {connected && (
        <div className="flex items-center gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-3">
          <Button
            onClick={handleImport}
            disabled={importing || selectedFileIds.size === 0}
            size="sm"
            className="bg-red-600 font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {importing ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Importing...</> : `Select${selectedFileIds.size > 0 ? ` (${selectedFileIds.size})` : ""}`}
          </Button>
          <Button variant="outline" size="sm" onClick={onBack}>
            Cancel
          </Button>
          {selectedFileIds.size > 0 && (
            <span className="ml-auto text-xs text-slate-400">{selectedFileIds.size} file(s) selected</span>
          )}
        </div>
      )}
    </div>
  );
}

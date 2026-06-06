// AddSharePointFiles.jsx — Three-level: sites → folders → files, with breadcrumb navigation
//
// NOTE: SharePoint Pages (e.g. site pages, news posts) are NOT document files and
// will not appear in the document library listing. Only actual files (.pdf, .txt, .doc, .docx,
// .csv, .xls, .xlsx, .ppt, .pptx, .md, .html, .htm, .rtf) uploaded to a SharePoint Document Library will show up here.
// If the "Documents" library appears empty, upload files via the SharePoint web UI.
//
// The Microsoft Graph search endpoint (search?query=*) may return 500 errors on
// new/developer tenants because the search index isn't ready yet (resolves in 24-48h).
// The fallback to list sites by path is working correctly in that case.
//
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Loader2,
  Check,
  Unplug,
  RefreshCw,
  FolderOpen,
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

export function AddSharePointFiles({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;

  const [status, setStatus] = useState({ connected: false, email: null });
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState(new Set());
  const [importing, setImporting] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  // Navigation: null = sites list, { siteId, siteName } = drive list within site
  const [currentSite, setCurrentSite] = useState(null);
  // Drive: null = drives list, { driveId, driveName } = file browser within drive
  const [currentDrive, setCurrentDrive] = useState(null);
  const [folderStack, setFolderStack] = useState([]);

  const currentFolderId = folderStack.length > 0 ? folderStack[folderStack.length - 1].id : "root";

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/oauth-connect/sharepoint/status");
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
    async (pageToken = null) => {
      if (!status.connected) return;
      try {
        setFilesLoading(true);
        const params = new URLSearchParams();
        if (currentSite) {
          params.set("siteId", currentSite.siteId);
          if (currentDrive) {
            params.set("driveId", currentDrive.driveId);
            if (currentFolderId !== "root") params.set("folderId", currentFolderId);
          }
        }
        if (pageToken) params.set("skipToken", pageToken);

        const res = await api.get(`/oauth-connect/sharepoint/files?${params}`);
        const data = res.data.data;

        if (pageToken) {
          setFiles((prev) => [...prev, ...data.files]);
        } else {
          setFiles(data.files);
        }
        setNextPageToken(data.nextPageToken || null);
      } catch (err) {
        if (err.response?.status === 401) {
          setStatus({ connected: false, email: null });
          setFiles([]);
          setCurrentSite(null);
          setCurrentDrive(null);
          setFolderStack([]);
          toast.error("SharePoint session expired. Please reconnect.");
        } else {
          toast.error(err.response?.data?.message || "Failed to load files");
        }
      } finally {
        setFilesLoading(false);
      }
    },
    [status.connected, currentSite, currentDrive, currentFolderId]
  );

  useEffect(() => {
    if (status.connected) {
      setSelectedFileIds(new Set());
      fetchFiles();
    }
  }, [status.connected, fetchFiles]);

  const handleConnect = async () => {
    try {
      const res = await api.get("/oauth-connect/sharepoint/auth");
      window.location.href = res.data.data.authUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start SharePoint connection");
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await api.delete("/oauth-connect/sharepoint/disconnect");
    } catch {
      // Ignore errors — connection may already be gone
    } finally {
      setStatus({ connected: false, email: null });
      setFiles([]);
      setCurrentSite(null);
      setCurrentDrive(null);
      setFolderStack([]);
      setDisconnecting(false);
      toast.success("SharePoint disconnected");
    }
  };

  const openSite = (site) => {
    setCurrentSite({ siteId: site.id, siteName: site.name });
    setCurrentDrive(null);
    setFolderStack([]);
    setFiles([]);
    setSelectedFileIds(new Set());
    setNextPageToken(null);
  };

  const openDrive = (drive) => {
    setCurrentDrive({ driveId: drive.id, driveName: drive.name });
    setFolderStack([]);
    setFiles([]);
    setSelectedFileIds(new Set());
    setNextPageToken(null);
  };

  const openFolder = (folder) => {
    setFolderStack((prev) => [...prev, { id: folder.id, name: folder.name }]);
    setFiles([]);
    setSelectedFileIds(new Set());
    setNextPageToken(null);
  };

  const goBackToSites = () => {
    setCurrentSite(null);
    setCurrentDrive(null);
    setFolderStack([]);
    setFiles([]);
    setSelectedFileIds(new Set());
    setNextPageToken(null);
  };

  const goBackToDrives = () => {
    setCurrentDrive(null);
    setFolderStack([]);
    setFiles([]);
    setSelectedFileIds(new Set());
    setNextPageToken(null);
  };

  const goBackToFolder = (index) => {
    setFolderStack((prev) => prev.slice(0, index + 1));
    setFiles([]);
    setSelectedFileIds(new Set());
    setNextPageToken(null);
  };

  const goUpOneLevel = () => {
    if (folderStack.length > 0) {
      setFolderStack((prev) => prev.slice(0, -1));
      setFiles([]);
      setSelectedFileIds(new Set());
      setNextPageToken(null);
    } else if (currentDrive) {
      goBackToDrives();
    } else {
      goBackToSites();
    }
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
      const res = await api.post("/oauth-connect/sharepoint/import", {
        fileIds: Array.from(selectedFileIds),
        chatbotId,
        siteId: currentSite.siteId,
        driveId: currentDrive.driveId,
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
        <h2 className="mb-1 text-xl font-bold text-slate-800">SharePoint</h2>
        <p className="mb-2 text-xs text-slate-400">
          Import files from your SharePoint sites. Supported formats: {ALLOWED_EXTENSIONS}
        </p>
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>SharePoint requires a <strong>Microsoft 365 work/school account</strong>. Personal Microsoft accounts (@gmail.com, @outlook.com, @hotmail.com) are not supported. If you don&apos;t have one, you can get a free developer tenant at the <a href="https://developer.microsoft.com/en-us/microsoft-365/dev-program" target="_blank" rel="noopener noreferrer" className="underline font-medium">Microsoft 365 Developer Program</a>.</span>
        </div>

        <div className="mb-4 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>Only document files (<strong>.pdf, .txt, .doc, .docx, .csv, .xls, .xlsx, .ppt, .pptx, .md, .html, .htm, .rtf</strong>) from SharePoint Document Libraries are supported. SharePoint Pages (site pages, news posts) are not files and won&apos;t appear here — upload files to a Document Library via the SharePoint web UI.</span>
        </div>

        {!status.connected ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#038387]/10">
              <svg className="h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 2C6.81 2 3 5.81 3 10.5c0 .67.08 1.33.23 1.97A7.5 7.5 0 0 0 7.5 22h12A4.5 4.5 0 0 0 24 17.5c0-1.16-.44-2.22-1.16-3.02A8.5 8.5 0 0 0 11.5 2z" fill="#038387"/>
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">Connect your SharePoint</h3>
            <p className="mb-6 max-w-sm text-sm text-slate-500">
              Authorize access to your SharePoint sites to browse and import files. You only need to do this once.
            </p>
            <Button onClick={handleConnect} className="bg-[#038387] font-medium text-white hover:bg-[#026d70]">
              Connect SharePoint
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
                onClick={goBackToSites}
                className={`hover:underline ${!currentSite ? "font-medium text-slate-700" : "text-blue-500 hover:text-blue-700"}`}
              >
                Sites
              </button>
              {currentSite && (
                <>
                  <span>/</span>
                  <button
                    onClick={goBackToDrives}
                    className={`hover:underline ${!currentDrive ? "font-medium text-slate-700" : "text-blue-500 hover:text-blue-700"}`}
                  >
                    {currentSite.siteName}
                  </button>
                </>
              )}
              {currentDrive && (
                <>
                  <span>/</span>
                  <button
                    onClick={() => { setFolderStack([]); setFiles([]); setSelectedFileIds(new Set()); setNextPageToken(null); }}
                    className={`hover:underline ${folderStack.length === 0 ? "font-medium text-slate-700" : "text-blue-500 hover:text-blue-700"}`}
                  >
                    {currentDrive.driveName}
                  </button>
                </>
              )}
              {folderStack.map((folder, i) => (
                <React.Fragment key={folder.id}>
                  <span>/</span>
                  <button
                    onClick={() => goBackToFolder(i)}
                    className={`hover:underline ${i === folderStack.length - 1 ? "font-medium text-slate-700" : "text-blue-500 hover:text-blue-700"}`}
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* File list container */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
              {/* Top bar */}
              <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                {currentSite && (
                  <button onClick={goUpOneLevel} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                <span className="flex-1 text-sm font-medium text-slate-600">
                  {!currentSite ? "SharePoint Sites" : !currentDrive ? "Document Libraries" : currentFolderId === "root" ? currentDrive.driveName : folderStack[folderStack.length - 1]?.name}
                </span>
                <button onClick={() => fetchFiles()} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <RefreshCw className={`h-4 w-4 ${filesLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Column headers */}
              <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-medium text-slate-500">
                {currentDrive && <div className="w-8 shrink-0" />}
                <div className="flex-1">Name</div>
                {currentDrive && <div className="w-[80px] shrink-0 text-right">Size</div>}
              </div>

              {/* List */}
              <ScrollArea className="h-50 flex-grow">
                {filesLoading && files.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                ) : files.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">
                    {!currentSite ? "No SharePoint sites found" : !currentDrive ? "No document libraries found" : "This folder is empty"}
                  </div>
                ) : (
                  <>
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className={`flex cursor-pointer items-center border-b border-slate-100 px-4 py-2.5 last:border-b-0 hover:bg-blue-50/50 ${
                          selectedFileIds.has(file.id) ? "bg-blue-50" : ""
                        } ${!file.supported && !file.isFolder && !file.isSite ? "opacity-40" : ""}`}
                        onClick={() => {
                          if (file.isSite) openSite(file);
                          else if (file.isDrive) openDrive(file);
                          else if (file.isFolder) openFolder(file);
                          else if (file.supported) toggleFileSelection(file.id);
                        }}
                      >
                        {currentSite && !file.isSite && !file.isDrive && (
                          <div className="flex w-8 shrink-0 items-center justify-center">
                            {!file.isFolder && file.supported && (
                              <Checkbox
                                checked={selectedFileIds.has(file.id)}
                                onCheckedChange={() => toggleFileSelection(file.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </div>
                        )}
                        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                          {file.isFolder || file.isSite ? (
                            <FolderOpen className="h-4 w-4 shrink-0 text-blue-400" />
                          ) : (
                            <FileTypeIcon fileName={file.name} />
                          )}
                          <p className="truncate text-sm text-slate-800">{file.name}</p>
                        </div>
                        {currentDrive && !file.isSite && !file.isDrive && (
                          <div className="w-[80px] shrink-0 text-right text-sm text-slate-500">
                            {file.isFolder ? "—" : formatFileSize(file.size)}
                          </div>
                        )}
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
      {status.connected && currentSite && currentDrive && (
        <div className="flex items-center gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-3">
          <Button
            onClick={handleImport}
            disabled={importing || selectedFileIds.size === 0}
            size="sm"
            className="bg-blue-500 font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {importing ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Importing...</> : `Import${selectedFileIds.size > 0 ? ` (${selectedFileIds.size})` : ""}`}
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

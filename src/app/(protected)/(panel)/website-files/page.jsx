"use client";
import React, { useState, useEffect } from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  Search,
  Plus,
  Filter,
  Trash2,
  Copy,
  Check,
  Clock,
  AlertCircle,
  Eye,
  Wrench,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { AddFilesModal } from "./AddFilesModal";

const TABS = [
  {
    id: "total",
    title: "Total",
    icon: <Copy className="h-5 w-5 text-white" />,
    iconBg: "bg-[#3b82f6]",
    status: undefined,
  },
  {
    id: "trained",
    title: "Trained",
    icon: <Check className="h-5 w-5 text-white" />,
    iconBg: "bg-[#22c55e]",
    status: "COMPLETED",
  },
  {
    id: "pending",
    title: "Pending",
    icon: <Clock className="h-5 w-5 text-white" />,
    iconBg: "bg-[#eab308]",
    status: "PENDING",
  },
  {
    id: "failed",
    title: "Failed",
    icon: <AlertCircle className="h-5 w-5 text-white" />,
    iconBg: "bg-[#ef4444]",
    status: "FAILED",
  },
];

const WebsiteLinks = () => {
  const { selectedChatbot } = useChatbot();
  const [activeTab, setActiveTab] = useState("total");
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0, // Using initial mock values
    trained: 0,
    pending: 0,
    failed: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const activeTabTitle = TABS.find((t) => t.id === activeTab)?.title || "Total";

  const handleDownloadCSV = () => {
    if (!files || files.length === 0) {
      toast.error("No data to download");
      return;
    }

    const headers = [
      "file",
      "linkType",
      "status",
      "title",
      "addedOn",
      "lastSynced",
      "errorMessage",
      "fileSize",
    ];

    const rows = files.map((file) => {
      const url = file.metadata?.sourceUrl || file.fileName || "";
      const linkType = file.fileSource || "";

      let statusStr = "Unknown";
      if (file.status === "COMPLETED") statusStr = "Trained";
      else if (file.status === "PENDING") statusStr = "Pending";
      else if (file.status === "FAILED") statusStr = "Failed";

      const title = url;

      const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        try {
          const date = new Date(dateStr);
          return format(date, "MMM dd, yyyy, hh:mm a 'UTC'");
        } catch (e) {
          return dateStr;
        }
      };

      const addedOn = formatDateTime(file.createdAt);
      const lastSynced = formatDateTime(file.updatedAt);
      const errorMessage = file.errorMessage || "";
      const fileSize = file.fileSize != null ? `${file.fileSize} bytes` : "";

      return [
        url,
        linkType,
        statusStr,
        title,
        addedOn,
        lastSynced,
        errorMessage,
        fileSize,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const objUrl = URL.createObjectURL(blob);
    link.setAttribute("href", objUrl);
    link.setAttribute("download", `website_links_${activeTab}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshLinks = async () => {
    if (cooldown > 0) {
      toast.error("Please wait a moment before refreshing again");
      return;
    }

    setIsRefreshing(true);
    setCooldown(5);

    const activeTabConfig = TABS.find((t) => t.id === activeTab);
    await fetchFiles(currentPage, activeTabConfig?.status);

    setIsRefreshing(false);
    toast.success("List refreshed");
  };

  const fetchFiles = async (page = 1, status) => {
    try {
      setLoading(true);
      const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      const accountId = account?.id;

      if (!chatbotId || !accountId) {
        setLoading(false);
        return;
      }

      const params = { page };
      if (status) params.status = status;

      const response = await api.get(
        `/ingestion/account/${accountId}/chatbot/${chatbotId}/files`,
        { params },
      );

      if (response.data?.success) {
        setFiles(response.data.data.files);
        setTotalFiles(response.data.data.total);

        // Update the mock stat total for current tab
        setStats((prev) => {
          const tab = TABS.find((t) => t.status === status) || TABS[0];
          return { ...prev, [tab.id]: response.data.data.total };
        });
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to fetch website links");
      setFiles([]);
      setTotalFiles(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeTabConfig = TABS.find((t) => t.id === activeTab);
    fetchFiles(currentPage, activeTabConfig?.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatbot, activeTab, currentPage]);

  const handleTabChange = (tabId) => {
    if (activeTab === tabId) return;
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const formatBytes = (bytes) => {
    if (bytes == null) return "0 B";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "-";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <PanelNavbar
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Website Links" },
          ]}
        />
        <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              Links
            </h2>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex h-9 items-center justify-center gap-2 px-3 font-medium text-slate-500 hover:text-slate-700"
                    onClick={handleRefreshLinks}
                    disabled={isRefreshing || cooldown > 0}
                  >
                    {cooldown > 0 ? (
                      <span className="text-[11px] font-bold tracking-wider">
                        {cooldown}s
                      </span>
                    ) : (
                      <RefreshCw
                        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                    )}
                    <span>Refresh {activeTabTitle}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {cooldown > 0
                    ? `Please wait ${cooldown}s`
                    : `Refresh ${activeTabTitle.toLowerCase()} links`}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex h-9 items-center justify-center gap-2 px-3 font-medium text-slate-500 hover:text-slate-700"
                    onClick={handleDownloadCSV}
                  >
                    <Download className="h-4 w-4" />
                    <span>Download {activeTabTitle}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Export {activeTabTitle.toLowerCase()} links
                </TooltipContent>
              </Tooltip>
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search links..."
                  className="w-full bg-white pl-8 sm:w-[250px]"
                />
              </div>
              <Button
                className="border-0 bg-[#8392ab] text-white hover:bg-[#6e7d96]"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Files
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all ${
                    isActive
                      ? "border-blue-500 bg-[#f8faff] ring-1 ring-blue-500"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col p-5 pb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-lg ${tab.iconBg}`}
                      >
                        {tab.icon}
                      </div>
                      <div>
                        <p className="mb-0.5 text-xs font-medium text-slate-500">
                          {tab.title}
                        </p>
                        <h3 className="text-xl font-bold text-slate-700">
                          {stats[tab.id] || 0}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-auto flex border-t border-slate-100 bg-slate-50/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="flex flex-1 items-center justify-center border-r border-slate-100 py-2.5 transition-colors hover:bg-slate-100">
                          <Filter className="h-4 w-4 text-slate-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Filter all links
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="flex flex-1 items-center justify-center border-r border-slate-100 py-2.5 text-blue-500 transition-colors hover:bg-[#eaf1fb]">
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Resync all links
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="flex flex-1 items-center justify-center py-2.5 text-red-500 transition-colors hover:bg-[#ffeef0]">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Delete all links
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-4">
              <span className="text-sm text-slate-500">
                Showing {totalFiles > 0 ? (currentPage - 1) * 20 + 1 : 0} to{" "}
                {Math.min(currentPage * 20, totalFiles)} of{" "}
                <span className="font-semibold text-slate-700">
                  {totalFiles}
                </span>{" "}
                links
              </span>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2 px-2 text-sm text-slate-500">
                  <span>Page</span>
                  <Input
                    type="number"
                    value={currentPage}
                    readOnly
                    className="h-8 w-12 p-0 text-center"
                  />
                  <span>of {Math.ceil(totalFiles / 20) || 1}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  disabled={currentPage >= Math.ceil(totalFiles / 20)}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  disabled={currentPage >= Math.ceil(totalFiles / 20)}
                  onClick={() => setCurrentPage(Math.ceil(totalFiles / 20))}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="w-[40px] text-center">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">
                      URL
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">
                      SOURCE
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">
                      STATUS
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">
                      ADDED ON
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">
                      LAST SYNCED AT
                    </TableHead>
                    <TableHead className="w-[120px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-center">
                          <Checkbox disabled />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[300px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[80px] rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[100px]" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : files.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center text-slate-500 italic"
                      >
                        No links found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    files.map((file) => (
                      <TableRow key={file.id} className="hover:bg-slate-50/80">
                        <TableCell className="text-center">
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <a
                              href={file.metadata?.sourceUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="max-w-[400px] truncate text-[13px] font-medium text-slate-800 hover:text-blue-600"
                            >
                              {file.metadata?.sourceUrl || file.fileName}
                            </a>
                            <div className="flex items-center space-x-1 text-xs text-slate-400">
                              <span>{formatBytes(file.fileSize)}</span>
                              {(file.filePages || file.filePages === 0) && (
                                <>
                                  <span>•</span>
                                  <span>{file.filePages} pages</span>
                                </>
                              )}
                              {file.fileTokens && (
                                <>
                                  <span>•</span>
                                  <span>{file.fileTokens} tokens</span>
                                </>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[13px] font-medium text-slate-600">
                          {file.fileSource}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const st = file.status;
                            if (st === "COMPLETED") {
                              return (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="cursor-help border-emerald-200 bg-white font-medium text-emerald-500 hover:bg-white"
                                    >
                                      Success
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="border-none bg-[#222222] text-white"
                                  >
                                    <p>
                                      Your document has been processed and
                                      trained
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            if (
                              st === "CHUNKING" ||
                              st === "EMBEDDING" ||
                              st === "PENDING"
                            ) {
                              return (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="cursor-help border-amber-200 bg-white font-medium text-amber-500 hover:bg-white"
                                    >
                                      Processing
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="border-none bg-[#222222] text-white"
                                  >
                                    <p>Your document is being processed</p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            if (st === "DELETING") {
                              return (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="cursor-help border-orange-200 bg-white font-medium text-orange-500 hover:bg-white"
                                    >
                                      Deleting
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="border-none bg-[#222222] text-white"
                                  >
                                    <p>
                                      Your document is added to queue for
                                      deletion
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            if (st === "RESYNCING") {
                              return (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="cursor-help border-blue-200 bg-white font-medium text-blue-500 hover:bg-white"
                                    >
                                      Processing
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="border-none bg-[#222222] text-white"
                                  >
                                    <p>
                                      Your document is added to queue for resync
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            if (st === "FAILED") {
                              return (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="cursor-help border-rose-200 bg-white font-medium text-rose-500 hover:bg-white"
                                    >
                                      Failed
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="border-none bg-[#222222] text-white"
                                  >
                                    <p>Your document processing failed</p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            return (
                              <Badge variant="outline" className="bg-white">
                                {st}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-[13px] text-slate-600">
                          {getTimeAgo(file.createdAt)}
                        </TableCell>
                        <TableCell className="text-[13px] text-slate-600">
                          {getTimeAgo(file.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2 text-slate-400">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-slate-600"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-slate-600"
                                >
                                  <Wrench className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Settings</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-blue-600"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Sync</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <AddFilesModal isOpen={isAddModalOpen} onClose={setIsAddModalOpen} />
    </TooltipProvider>
  );
};

export default WebsiteLinks;

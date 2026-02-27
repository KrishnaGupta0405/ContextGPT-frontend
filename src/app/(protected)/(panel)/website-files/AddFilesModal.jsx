"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileText, Github, Box } from "lucide-react";
import Image from "next/image";
import { AddLocalFiles } from "./AddLocalFiles";

// Simple fallback components for icons that might not be in lucide-react or need specific branding colors
const NotionIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M4 4h16v16H4z"></path>
    <path d="M9 8v8l6-4z"></path>
  </svg>
);

const DriveIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-green-500"
  >
    <path d="M12 2L2 22h20L12 2z"></path>
  </svg>
);

const DropboxIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-blue-600"
  >
    <path d="M12 2l-6 5 6 5-6 5 6 5 6-5-6-5 6-5-6-5z"></path>
  </svg>
);

const OneDriveIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-blue-500"
  >
    <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5a4.5 4.5 0 00-4-4.5c0-3-2.5-5.5-5.5-5.5-2.5 0-4.5 1.5-5 4-2 0-3.5 1.5-3.5 3.5C4 12 2 14 2 16.5 2 19 4 21 6.5 21h11z"></path>
  </svg>
);

export function AddFilesModal({ isOpen, onClose }) {
  const [activeView, setActiveView] = useState("menu");

  const handleOpenChange = (open) => {
    if (!open) {
      setTimeout(() => setActiveView("menu"), 300); // Reset after closing animation
    }
    onClose(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-5xl flex-col overflow-hidden p-0 sm:max-w-5xl">
        {activeView === "menu" ? (
          <div className="p-6 sm:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-slate-800">
                Add Files
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm text-slate-500">
                Add files from multiple sources.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <p className="text-[14px] font-semibold text-slate-800">
                Choose a type to add files:
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Local Files */}
                <button
                  onClick={() => setActiveView("local")}
                  className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg text-blue-500 transition-transform group-hover:scale-110">
                    <FileText strokeWidth={2.5} className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <h4 className="text-[14px] font-bold text-slate-800">
                      Local Files
                    </h4>
                    <p className="text-[12px] leading-[1.3] text-slate-500">
                      Upload files from your system
                    </p>
                  </div>
                </button>

                {/* Notion */}
                <button
                  onClick={() => setActiveView("notion")}
                  className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg text-slate-800 transition-transform group-hover:scale-110">
                    <NotionIcon />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <h4 className="text-[14px] font-bold text-slate-800">
                      Notion
                    </h4>
                    <p className="text-[12px] leading-[1.3] text-slate-500">
                      Import files from Notion
                    </p>
                  </div>
                </button>

                {/* Google Drive */}
                <button
                  onClick={() => setActiveView("drive")}
                  className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                    <DriveIcon />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <h4 className="text-[14px] font-bold text-slate-800">
                      Google Drive
                    </h4>
                    <p className="text-[12px] leading-[1.3] text-slate-500">
                      Import files from Google Drive
                    </p>
                  </div>
                </button>

                {/* Dropbox */}
                <button
                  onClick={() => setActiveView("dropbox")}
                  className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                    <DropboxIcon />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <h4 className="text-[14px] font-bold text-slate-800">
                      Dropbox
                    </h4>
                    <p className="text-[12px] leading-[1.3] text-slate-500">
                      Import files from Dropbox
                    </p>
                  </div>
                </button>

                {/* OneDrive */}
                <button
                  onClick={() => setActiveView("onedrive")}
                  className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                    <OneDriveIcon />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <h4 className="text-[14px] font-bold text-slate-800">
                      OneDrive
                    </h4>
                    <p className="text-[12px] leading-[1.3] text-slate-500">
                      Import files from OneDrive
                    </p>
                  </div>
                </button>

                {/* Box */}
                <button
                  onClick={() => setActiveView("box")}
                  className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg text-blue-600 transition-transform group-hover:scale-110">
                    <Box strokeWidth={2.5} className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <h4 className="text-[14px] font-bold text-slate-800">
                      Box
                    </h4>
                    <p className="text-[12px] leading-[1.3] text-slate-500">
                      Import files from Box
                    </p>
                  </div>
                </button>

                {/* GitHub */}
                <button
                  onClick={() => setActiveView("github")}
                  className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg text-slate-800 transition-transform group-hover:scale-110">
                    <Github strokeWidth={2.5} className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <h4 className="text-[14px] font-bold text-slate-800">
                      GitHub
                    </h4>
                    <p className="text-[12px] leading-[1.3] text-slate-500">
                      Import files from GitHub
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : activeView === "local" ? (
          <div className="flex-1 overflow-hidden">
            <AddLocalFiles
              onBack={() => setActiveView("menu")}
              onAdd={() => setActiveView("menu")}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="text-center text-slate-500">
              <p>Form for {activeView} will go here.</p>
              <button
                onClick={() => setActiveView("menu")}
                className="mt-4 text-blue-500 hover:underline"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CloudUpload } from "lucide-react";

export function AddLocalFiles({ onBack, onAdd }) {
  return (
    <div className="flex h-full flex-col">
      {/* Header section matches the screenshot's top area */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-slate-500 hover:text-slate-800"
          onClick={onBack}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        <h2 className="mb-2 text-xl font-bold text-slate-800">
          Manually Upload Files
        </h2>
        <p className="mb-8 text-sm text-slate-500">
          Manually upload important documents and organize them into folders.
        </p>

        {/* Dropzone Area */}
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center text-slate-600">
            <CloudUpload
              strokeWidth={1.5}
              className="h-10 w-10 text-slate-500"
            />
          </div>
          <h3 className="mb-2 font-semibold text-slate-800">
            Choose one or more files to upload
          </h3>
          <p className="mb-6 text-sm text-slate-500">
            PDF, CSV, DOC, etc. formats, up to 10 MB each.
          </p>
          <Button variant="outline" className="font-medium text-slate-700">
            Browse File
          </Button>
        </div>
      </div>

      {/* Footer Area */}
      <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
        <div className="flex justify-end">
          <Button
            onClick={onAdd}
            className="bg-blue-400 font-medium text-white transition-all hover:bg-blue-500 hover:opacity-90 active:scale-95"
          >
            Upload Files
          </Button>
        </div>
      </div>
    </div>
  );
}

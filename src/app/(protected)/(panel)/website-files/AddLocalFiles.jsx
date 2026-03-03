"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CloudUpload, File, X, Loader2 } from "lucide-react";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";

export function AddLocalFiles({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (!selectedChatbot?.id && !selectedChatbot?.chatbotId) {
      toast.error("No chatbot selected");
      return;
    }

    const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("chatbotId", chatbotId);

      const response = await api.post("/ingestion/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        toast.success(response.data.message || "File uploaded successfully");
        if (onAdd) {
          onAdd(); // Calls the parent to close/refresh
        }
      } else {
        toast.error(response.data?.message || "Failed to upload file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

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
          Manually Upload File
        </h2>
        <p className="mb-8 text-sm text-slate-500">
          Manually upload important documents and organize them into folders.
        </p>

        {/* Dropzone Area */}
        {!selectedFile ? (
          <div
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center transition-colors hover:border-blue-400 hover:bg-slate-50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center text-slate-600">
              <CloudUpload
                strokeWidth={1.5}
                className="h-10 w-10 text-slate-500"
              />
            </div>
            <h3 className="mb-2 font-semibold text-slate-800">
              Choose a file to upload or drag & drop it here
            </h3>
            <p className="mb-6 text-sm text-slate-500">
              PDF, CSV, TXT, DOCX formats, up to 10 MB.
            </p>
            <Button
              variant="outline"
              className="font-medium text-slate-700"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <File className="h-6 w-6" />
            </div>
            <h3 className="mb-1 px-4 font-semibold break-all text-slate-800">
              {selectedFile.name}
            </h3>
            <p className="mb-6 text-sm text-slate-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              variant="outline"
              size="sm"
              className="font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
            >
              <X className="mr-2 h-4 w-4" /> Remove File
            </Button>
          </div>
        )}
      </div>

      {/* Footer Area */}
      <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
        <div className="flex justify-end">
          <Button
            onClick={handleUploadClick}
            disabled={!selectedFile || isUploading}
            className="bg-blue-400 font-medium text-white transition-all hover:bg-blue-500 hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

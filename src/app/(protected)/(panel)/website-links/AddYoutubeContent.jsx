"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";

export function AddYoutubeContent({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const [youtubeUrlsText, setYoutubeUrlsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to extract a YouTube Video ID from various URL formats
  const extractVideoId = (url) => {
    try {
      if (!url) return null;
      const urlObj = new URL(url);

      if (urlObj.hostname.includes("youtube.com")) {
        // Handle youtube.com/watch?v=XXXX
        if (urlObj.searchParams.has("v")) {
          return urlObj.searchParams.get("v");
        }
        // Handle edge youtube.com/embed/XXXX
        if (urlObj.pathname.startsWith("/embed/")) {
          return urlObj.pathname.split("/")[2];
        }
        // Handle youtube.com/shorts/XXXX
        if (urlObj.pathname.startsWith("/shorts/")) {
          return urlObj.pathname.split("/")[2];
        }
      }

      // Handle youtu.be/XXXX
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
    } catch (e) {
      // In case it's not a valid full URL but just the ID
      if (url.length === 11 && !url.includes("/") && !url.includes("?")) {
        return url;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!youtubeUrlsText.trim()) {
      toast.error("Please enter at least one YouTube URL");
      return;
    }

    const lines = youtubeUrlsText
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const videoIds = lines
      .map(extractVideoId)
      .filter((id) => id && id.length > 0);

    if (videoIds.length === 0) {
      toast.error("No valid YouTube Video URLs found");
      return;
    }

    const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;
    if (!chatbotId) {
      toast.error("No chatbot selected");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/ingestion/youtube-transcripts", {
        chatbotId,
        videoIds,
      });

      if (response.data?.success) {
        toast.success(
          response.data.message || "YouTube transcripts processing started.",
        );
        if (onAdd) onAdd();
      } else {
        toast.error(
          response.data?.message || "Failed to process YouTube transcripts",
        );
      }
    } catch (error) {
      console.error("Error submitting YouTube URLs:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit YouTube URLs",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-slate-500 hover:text-slate-800"
          onClick={onBack}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>
      <div>
        <h2 className="mb-6 text-xl font-bold text-slate-800">
          Add YouTube Content
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">
              YouTube URLs <span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="min-h-[160px]"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrlsText}
              onChange={(e) => setYoutubeUrlsText(e.target.value)}
            />
            <div className="mt-2 space-y-1 text-sm text-slate-500">
              <p>
                <strong>3 / 647 links</strong> - Enter YouTube URLs, one per
                line. Supported formats:
              </p>
              <p>
                <strong>Videos:</strong> youtube.com/watch?v=... or youtu.be/...
              </p>
              <p>
                <strong>Playlists:</strong> youtube.com/playlist?list=...
              </p>
              <p>
                <strong>Channels:</strong> youtube.com/@username or
                youtube.com/channel/...
              </p>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              The system will automatically extract transcripts from the videos.
              You have 647 pages remaining in your quota.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 font-medium text-white hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Add YouTube Content"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";

export function AddYoutubeContent({ onBack, onAdd }) {
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
            onClick={onAdd}
            className="bg-blue-600 font-medium text-white hover:bg-blue-700"
          >
            Add YouTube Content
          </Button>
        </div>
      </div>
    </div>
  );
}

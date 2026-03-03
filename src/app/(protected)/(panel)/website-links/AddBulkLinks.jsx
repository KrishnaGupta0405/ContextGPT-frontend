"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";

export function AddBulkLinks({ onBack, onAdd }) {
  const { selectedChatbot } = useChatbot();
  const [linksText, setLinksText] = useState("");
  const [extractMainContentOnly, setExtractMainContentOnly] = useState(true);
  const [includeSelectorsText, setIncludeSelectorsText] = useState("");
  const [excludeSelectorsText, setExcludeSelectorsText] = useState("");
  const [customHeadersText, setCustomHeadersText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!linksText.trim()) {
      toast.error("Please enter at least one link");
      return;
    }

    const urls = linksText
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const includeSelectors = includeSelectorsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const excludeSelectors = excludeSelectorsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;
    if (!chatbotId) {
      toast.error("No chatbot selected");
      return;
    }

    const payload = {
      chatbotId,
      urls,
      extractMainContentOnly,
    };

    if (includeSelectors.length > 0) {
      payload.includeSelectors = includeSelectors;
    }

    if (excludeSelectors.length > 0) {
      payload.excludeSelectors = excludeSelectors;
    }

    if (customHeadersText.trim()) {
      payload.customHeaders = customHeadersText.trim();
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/ingestion/web-scrape/bulk", payload);

      if (response.data?.success) {
        toast.success(response.data.message || "Batch scrape job started.");
        if (onAdd) onAdd();
      } else {
        toast.error(response.data?.message || "Failed to start scrape job");
      }
    } catch (error) {
      console.error("Error submitting bulk links:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit bulk links",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      <div className="mb-6 flex items-center gap-2">
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
          Add Bulk Links
        </h2>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              Links <span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="min-h-[120px]"
              placeholder="https://www.example.com/&#10;https://www.example.com/solutions"
              value={linksText}
              onChange={(e) => setLinksText(e.target.value)}
            />
            <p className="text-sm text-slate-500">
              2 / 998 links - You have 998 pages remaining in your quota.
            </p>
          </div>

          <div className="flex items-start justify-between space-x-4 rounded-lg border bg-slate-50/50 p-4">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-slate-700">
                Extract main content only
              </Label>
              <p className="text-sm text-slate-500">
                When enabled, only the main content of the page is extracted,
                excluding headers, footers, sidebars, and navigation elements.
              </p>
            </div>
            <Switch
              checked={extractMainContentOnly}
              onCheckedChange={setExtractMainContentOnly}
            />
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              HTML/CSS selectors to include
            </Label>
            <Textarea
              className="min-h-[80px]"
              placeholder="main&#10;.content&#10;#article"
              value={includeSelectorsText}
              onChange={(e) => setIncludeSelectorsText(e.target.value)}
            />
            <div className="space-y-1 text-sm text-slate-500">
              <p>Include content only from matching these CSS selectors.</p>
              <p>
                <strong>For example :-</strong>
              </p>
              <p>"main" to include content only from the "main" HTML tag,</p>
              <p>
                ".content" to include content only from elements with the
                "content" class,
              </p>
              <p>
                "#article" to include content only from elements with the
                "article" id.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              HTML/CSS selectors to exclude
            </Label>
            <Textarea
              className="min-h-[80px]"
              placeholder="footer&#10;.sidebar&#10;#comments"
              value={excludeSelectorsText}
              onChange={(e) => setExcludeSelectorsText(e.target.value)}
            />
            <div className="space-y-1 text-sm text-slate-500">
              <p>Exclude content matching these CSS selectors.</p>
              <p>
                <strong>For example :-</strong>
              </p>
              <p>"footer" to exclude content from the "footer" HTML tag,</p>
              <p>
                ".sidebar" to exclude content from elements with the "sidebar"
                class,
              </p>
              <p>
                "#comments" to exclude content from elements with the "comments"
                id.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              Custom Headers (Optional)
            </Label>
            <Textarea
              className="min-h-[80px]"
              placeholder="Authorization: Bearer your-token-here&#10;User-Agent: YourBot/1.0&#10;Cookie: session=abc123"
              value={customHeadersText}
              onChange={(e) => setCustomHeadersText(e.target.value)}
            />
            <div className="space-y-1 text-sm text-slate-500">
              <p>Add custom HTTP headers for accessing protected content.</p>
              <p>
                <strong>Format:</strong> One header per line as "HeaderName:
                HeaderValue"
              </p>
              <p>
                Useful for authentication, custom user agents, or other request
                customization.
              </p>
            </div>
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
              "Add Links"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

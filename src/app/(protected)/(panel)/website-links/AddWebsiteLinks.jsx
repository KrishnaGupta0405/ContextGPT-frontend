"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";

export function AddWebsiteLinks({ onBack, onAdd, initialData }) {
  const { selectedChatbot } = useChatbot();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [recursionDepth, setRecursionDepth] = useState(2);
  const [maxPages, setMaxPages] = useState(100);
  const [includeUrlPaths, setIncludeUrlPaths] = useState("");
  const [excludeUrlPaths, setExcludeUrlPaths] = useState("");
  const [allowedDomains, setAllowedDomains] = useState("");
  const [extractMainContentOnly, setExtractMainContentOnly] = useState(true);
  const [includeSelectorsText, setIncludeSelectorsText] = useState("");
  const [excludeSelectorsText, setExcludeSelectorsText] = useState("");
  const [customHeadersText, setCustomHeadersText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialData;

  React.useEffect(() => {
    if (initialData) {
      setWebsiteUrl(
        initialData.metadata?.sourceUrl || initialData.fileName || "",
      );
      if (initialData.metadata?.payload) {
        setExtractMainContentOnly(
          initialData.metadata.payload.extractMainContentOnly ?? true,
        );
        setIncludeSelectorsText(
          initialData.metadata.payload.includeSelectors?.join("\n") || "",
        );
        setExcludeSelectorsText(
          initialData.metadata.payload.excludeSelectors?.join("\n") || "",
        );
        setCustomHeadersText(initialData.metadata.payload.customHeaders || "");
      }
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!websiteUrl.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    const getLines = (text) =>
      text
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;
    if (!chatbotId) {
      toast.error("No chatbot selected");
      return;
    }

    let payload = {};
    let endpoint = "";

    if (isEditing) {
      payload = {
        sourceUrl: websiteUrl.trim(),
        extractMainContentOnly,
        includeSelectors: getLines(includeSelectorsText),
        excludeSelectors: getLines(excludeSelectorsText),
        customHeaders: customHeadersText.trim(),
      };
      console.log("initialData.id", initialData.id);
      endpoint = `/ingestion/${chatbotId}/links/update-resync?fileId=${initialData.id}`;
    } else {
      const depth = parseInt(recursionDepth, 10);
      if (isNaN(depth) || depth < 1 || depth > 5) {
        toast.error("Please enter a valid recursion depth (1-5)");
        return;
      }

      const maxP = parseInt(maxPages, 10);
      if (isNaN(maxP) || maxP <= 0) {
        toast.error("Please enter a valid number for max pages");
        return;
      }

      const includePaths = getLines(includeUrlPaths);
      const excludePaths = getLines(excludeUrlPaths);
      const domains = getLines(allowedDomains);

      payload = {
        chatbotId,
        websiteUrl: websiteUrl.trim(),
        recursionDepth: depth,
        maxPages: maxP,
        allowedDomains: domains,
        extractMainContentOnly,
      };

      if (includePaths.length > 0) payload.includeUrlPaths = includePaths;
      if (excludePaths.length > 0) payload.excludeUrlPaths = excludePaths;
      if (getLines(includeSelectorsText).length > 0)
        payload.includeSelectors = getLines(includeSelectorsText);
      if (getLines(excludeSelectorsText).length > 0)
        payload.excludeSelectors = getLines(excludeSelectorsText);
      if (customHeadersText.trim())
        payload.customHeaders = customHeadersText.trim();

      endpoint = "/ingestion/web-scrape/crawl";
    }

    try {
      setIsSubmitting(true);
      const response = isEditing
        ? await api.put(endpoint, payload)
        : await api.post(endpoint, payload);

      if (response.data?.success) {
        toast.success(
          response.data.message ||
            (isEditing ? "Update & resync started." : "Crawl job started."),
        );
        if (onAdd) onAdd();
      } else {
        toast.error(
          response.data?.message ||
            (isEditing
              ? "Failed to update configuration"
              : "Failed to start crawl job"),
        );
      }
    } catch (error) {
      console.error("Error submitting website links:", error);
      toast.error(
        error.response?.data?.message ||
          (isEditing
            ? "Failed to update configuration"
            : "Failed to submit website links"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      {onBack && (
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
      )}
      <div>
        <h2 className="mb-6 text-xl font-bold text-slate-800">
          {isEditing ? "Update Configuration" : "Add links from Website"}
        </h2>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              Website URL <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>

          {!isEditing && (
            <>
              <div className="space-y-3">
                <Label className="font-semibold text-slate-700">
                  Recursion Depth <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={recursionDepth}
                  onChange={(e) => setRecursionDepth(e.target.value)}
                />
                <p className="text-sm text-slate-500">
                  Number of levels (1-5) to scrape from the website. 1 means
                  only the root level pages will be scraped.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-slate-700">
                  Max Pages to Scrape <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={maxPages}
                  onChange={(e) => setMaxPages(e.target.value)}
                />
                <p className="text-sm text-slate-500">
                  The maximum number of pages to scrape from the website. You
                  have 998 pages remaining in your quota.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-slate-700">
                  URL paths to include
                </Label>
                <Textarea
                  className="min-h-[80px]"
                  placeholder="/blog&#10;/docs"
                  value={includeUrlPaths}
                  onChange={(e) => setIncludeUrlPaths(e.target.value)}
                />
                <p className="text-sm text-slate-500">
                  Only pages matching these path patterns will be scraped. For
                  example, "/blog" - will only include webpages which have
                  "/blog" in the URL path.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-slate-700">
                  URL paths to exclude
                </Label>
                <Textarea
                  className="min-h-[80px]"
                  placeholder="/blog/drafts&#10;/docs/internal"
                  value={excludeUrlPaths}
                  onChange={(e) => setExcludeUrlPaths(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-slate-700">
                  Allowed Domains
                </Label>
                <Textarea
                  className="min-h-[80px]"
                  placeholder="blog.example.com&#10;example-cdn.net"
                  value={allowedDomains}
                  onChange={(e) => setAllowedDomains(e.target.value)}
                />
                <p className="text-sm text-slate-500">
                  Links from these domains will be added to the crawl list but
                  will not be scraped further. Only links matching the main
                  website domain will be recursively scraped. Useful for
                  including subdomains or related external domains.
                </p>
              </div>
            </>
          )}

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
            ) : isEditing ? (
              "Update Configuration"
            ) : (
              "Add Links"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

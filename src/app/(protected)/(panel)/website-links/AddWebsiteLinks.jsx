"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";

export function AddWebsiteLinks({ onBack, onAdd }) {
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
          Add links from Website
        </h2>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              Website URL <span className="text-red-500">*</span>
            </Label>
            <Input placeholder="https://example.com" />
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              Recursion Depth <span className="text-red-500">*</span>
            </Label>
            <Input type="number" defaultValue={2} />
            <p className="text-sm text-slate-500">
              Number of levels (1-5) to scrape from the website. 1 means only
              the root level pages will be scraped.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              Max Pages to Scrape <span className="text-red-500">*</span>
            </Label>
            <Input type="number" defaultValue={100} />
            <p className="text-sm text-slate-500">
              The maximum number of pages to scrape from the website. You have
              998 pages remaining in your quota.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              URL paths to include
            </Label>
            <Textarea
              className="min-h-[80px]"
              placeholder="/blog&#10;/docs"
            />
            <p className="text-sm text-slate-500">
              Only pages matching these path patterns will be scraped. For
              example, "/blog" - will only include webpages which have "/blog"
              in the URL path.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              URL paths to exclude
            </Label>
            <Textarea
              className="min-h-[80px]"
              placeholder="/blog/drafts&#10;/docs/internal"
            />
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              Allowed Domains
            </Label>
            <Textarea
              className="min-h-[80px]"
              placeholder="blog.example.com&#10;example-cdn.net"
            />
            <p className="text-sm text-slate-500">
              Links from these domains will be added to the crawl list but will
              not be scraped further. Only links matching the main website
              domain will be recursively scraped. Useful for including
              subdomains or related external domains.
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
            <Switch defaultChecked />
          </div>

          <div className="space-y-3">
            <Label className="font-semibold text-slate-700">
              HTML/CSS selectors to include
            </Label>
            <Textarea
              className="min-h-[80px]"
              placeholder="main&#10;.content&#10;#article"
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
            onClick={onAdd}
            className="bg-blue-600 font-medium text-white hover:bg-blue-700"
          >
            Add Links
          </Button>
        </div>
      </div>
    </div>
  );
}

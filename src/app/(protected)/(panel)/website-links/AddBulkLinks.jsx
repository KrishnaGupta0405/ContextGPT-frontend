"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";

export function AddBulkLinks({ onBack, onAdd }) {
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

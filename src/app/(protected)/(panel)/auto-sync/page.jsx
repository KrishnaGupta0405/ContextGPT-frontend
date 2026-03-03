import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";
import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";

export const metadata = {
  title: "Auto Sync | ContextGPT",
  description: "View your chatbot auto sync jobs.",
};

export default function AutoSync() {
  return (
    <div className="flex h-full flex-col">
      <PanelNavbar items={[{ label: "Auto Sync" }]} />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Auto Sync Jobs
          </h2>
          <p className="text-sm text-slate-500">
            Keep your chatbot content up to date with automated sync jobs
          </p>
        </div>

        <div className="mt-8 flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Clock className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              No sync jobs yet
            </h3>
            <p className="mb-6 max-w-sm text-center text-sm text-slate-500">
              Start by adding content sources to your chatbot with automated
              sync enabled.
            </p>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

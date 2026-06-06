import React from "react";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReferralStats } from "./ReferralStats";
import { GenerateReferral } from "./GenerateReferral";
import { ApplyReferral } from "./ApplyReferral";
import { MyReferrals } from "./MyReferrals";
import { AvailablePromotions } from "./AvailablePromotions";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const ReferralPage = () => {
  return (
    <div className="animate-in fade-in zoom-in-95 container mx-auto flex h-[calc(100vh-80px)] max-w-7xl flex-col space-y-4 px-4 py-8 duration-500">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Referrals
            </h1>
            <Button
              variant="outline"
              size="sm"
              className="h-6 gap-1 rounded-full border-blue-200 bg-blue-50 px-3 text-xs font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            >
              <PlayCircle className="h-3.5 w-3.5 fill-blue-600 text-white" />
              Watch Video Tutorial
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Invite friends and earn bonus messages and pages for each successful
            referral.
          </p>
        </div>
      </div>

      {/* Available Promotions */}
      <div className="shrink-0">
        <h3 className="mb-2 text-sm font-semibold text-gray-600">
          Available Promotions
        </h3>
        <AvailablePromotions />
      </div>

      <div className="min-h-[600px] flex-1 overflow-hidden rounded-lg border bg-white shadow-sm">
        <ResizablePanelGroup orientation="horizontal">
          {/* Left Panel: Stats + Generate Code */}
          <ResizablePanel defaultSize="45%" minSize="35%" maxSize="60%">
            <div className="flex h-full flex-col space-y-6 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div>
                <h3 className="border-b border-gray-100 pb-2 text-sm font-semibold text-gray-600">
                  Generate Referral Code
                </h3>
                <div className="mt-4">
                  <GenerateReferral />
                </div>
              </div>

              <div>
                <h3 className="border-b border-gray-100 pb-2 text-sm font-semibold text-gray-600">
                  Referral Statistics
                </h3>
                <div className="mt-4">
                  <ReferralStats />
                </div>
              </div>

              <div>
                <h3 className="border-b border-gray-100 pb-2 text-sm font-semibold text-gray-600">
                  Apply a Referral Code
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Got a code from a friend? Apply it here before subscribing.
                </p>
                <div className="mt-3">
                  <ApplyReferral />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel: My Referrals List */}
          <ResizablePanel defaultSize="55%" minSize="40%" maxSize="65%">
            <MyReferrals />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ReferralPage;

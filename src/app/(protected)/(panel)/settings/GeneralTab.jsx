import React, { useState } from "react";
import { Copy, Lock, Trash2, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GeneralTab = () => {
  const [chatbotId] = useState("9aae556e-8cbd-415e-8333-886fb1d148d2");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chatbotId);
    // You could add a toast notification here
  };

  return (
    <div className="flex flex-col space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          General
        </h2>
        <p className="text-muted-foreground text-sm">
          Change the general settings of your chatbot.
        </p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Chatbot ID Card */}
        <div className="flex items-start space-x-4 rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] p-4">
          <div className="flex items-center justify-center rounded-lg bg-[#DBEAFE] p-2">
            <Settings className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[#1E3A8A]">
                Your Chatbot ID
              </h4>
            </div>
            <p className="text-xs text-[#1E3A8A]/70">
              Use this ID when integrating with third-party platforms like
              WordPress plugins.
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <code className="rounded bg-[#DBEAFE] px-2 py-1 text-xs font-medium text-[#1E3A8A]">
                {chatbotId}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs font-semibold text-[#2563EB] transition-colors hover:bg-[#DBEAFE]/50 hover:text-[#1E40AF]"
                onClick={copyToClipboard}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-900"
            >
              Description
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder=""
                className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="absolute right-2 bottom-2 opacity-50">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rotate-90 text-gray-400"
                >
                  <path d="M7 7l10 10M17 7l-10 10" />
                </svg>
              </div>
            </div>
            <p className="text-muted-foreground text-[12px] leading-relaxed">
              This description will be shown in the main home screen of your
              chatbot.
            </p>
          </div>

          {/* Smart Follow up questions */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-gray-900">
                Disable smart follow up questions
              </Label>
              <p className="text-muted-foreground max-w-[650px] text-[12px] leading-relaxed">
                SiteGPT suggests smart follow up questions to help the user get
                required information faster. Click this toggle to disable it.
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-blue-600" />
          </div>

          {/* Number of smart follow up questions */}
          <div className="space-y-2">
            <Label
              htmlFor="smart-follow-up-count"
              className="text-sm font-semibold text-gray-900"
            >
              Number of smart follow up questions to be shown
            </Label>
            <Input
              id="smart-follow-up-count"
              defaultValue="3"
              className="border-gray-200"
            />
            <p className="text-muted-foreground text-[12px] leading-relaxed">
              Choose a number between 1 and 5.
            </p>
          </div>

          {/* Lead notifications */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-gray-900">
                Disable lead notifications
              </Label>
              <p className="text-muted-foreground max-w-[650px] text-[12px] leading-relaxed">
                Disable this toggle if you wish to not receive email whenever a
                new lead is captured with your chatbot.
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-blue-600" />
          </div>

          {/* Page Context Awareness */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-gray-900">
                Enable Page Context Awareness
              </Label>
              <p className="text-muted-foreground max-w-[650px] text-[12px] leading-relaxed">
                When enabled, the chatbot will automatically know which page the
                user is viewing and can answer questions about the current page.
              </p>
            </div>
            <Switch
              defaultChecked
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* History Messages */}
          <div className="space-y-2">
            <Label
              htmlFor="history-messages"
              className="text-sm font-semibold text-gray-900"
            >
              Number of History Messages To Be Considered
            </Label>
            <Input
              id="history-messages"
              defaultValue="1"
              className="border-gray-200"
            />
            <p className="text-muted-foreground text-[12px] leading-relaxed">
              Choose a number between 0 and 4.
            </p>
          </div>

          {/* GPT Model */}
          <div className="space-y-2">
            <Label
              htmlFor="gpt-model"
              className="text-sm font-semibold text-gray-900"
            >
              GPT Model
            </Label>
            <Select defaultValue="gpt-4o">
              <SelectTrigger id="gpt-model" className="w-full border-gray-200">
                <SelectValue placeholder="Select the GPT model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-[12px] leading-relaxed">
              Select the GPT model you prefer.
            </p>
          </div>

          {/* Limit Messages Per Conversation */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold text-gray-900">
                  Limit Messages Per Conversation
                </Label>
                <Lock className="text-muted-foreground/60 h-3 w-3" />
              </div>
              <p className="text-muted-foreground max-w-[650px] text-[12px] leading-relaxed">
                When enabled, users will be prompted to start a new conversation
                after reaching the message limit.
              </p>
            </div>
            <div className="flex items-center justify-center rounded p-1 transition-colors hover:bg-gray-50">
              <Lock className="text-muted-foreground/40 h-4 w-4" />
            </div>
          </div>

          {/* Max Messages Per Conversation */}
          <div className="space-y-2 opacity-60">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="max-messages"
                className="text-sm font-semibold text-gray-900"
              >
                Max Messages Per Conversation
              </Label>
              <Lock className="text-muted-foreground/60 h-3 w-3" />
            </div>
            <Input
              id="max-messages"
              defaultValue="20"
              disabled
              className="border-gray-200 bg-gray-50/50"
            />
            <p className="text-muted-foreground text-[12px] leading-relaxed">
              Number of messages before users are prompted to start a new
              conversation.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-10">
          <div className="flex items-center justify-between border-t border-gray-100 pt-8">
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-gray-900">
                Danger Zone
              </h4>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                Once you delete your chatbot, you will no longer have access to
                message history.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-100 bg-red-50/30 px-6 text-red-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Delete Chatbot
            </Button>
          </div>
        </div>
      </div>

      {/* Footer / Save Button */}
      <div className="fixed right-10 bottom-6 z-50">
        <Button className="h-11 transform bg-blue-600 px-8 font-medium text-white shadow-xl transition-all hover:scale-105 hover:bg-blue-700 active:scale-95">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default GeneralTab;

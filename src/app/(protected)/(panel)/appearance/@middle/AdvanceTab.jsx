"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useChatbot } from "@/context/ChatbotContext";
import { PlayCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const AdvanceTab = () => {
  const { account } = useAuth();
  const { selectedChatbot } = useChatbot();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);

  const [formData, setFormData] = useState({
    hideSources: false,
    hideTooltip: false,
    hideFeedbackButtons: false,
    hideBottomNavigation: false,
    hideRefreshButton: false,
    hideExpandButton: false,
    hideHomePage: false,
    stayOnHomePage: false,
    requireTermsAcceptance: false,
    disclaimerText: "",
    autoOpenChatDesktop: false,
    autoOpenChatDesktopDelay: 3,
    autoOpenChatMobile: false,
    autoOpenChatMobileDelay: 3,
    smartFollowUpPromptsCount: 3,
  });

  useEffect(() => {
    if (account?.id && selectedChatbot?.id) {
      fetchBehavior();
    }
  }, [account?.id, selectedChatbot?.id]);

  const fetchBehavior = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/chatbots/account/${account.id}/chatbot/${selectedChatbot.id}/behavior`,
      );
      if (response.data.success && response.data.data) {
        setHasExistingSettings(true);
        const data = response.data.data;
        setFormData({
          hideSources: data.hideSources ?? false,
          hideTooltip: data.hideTooltip ?? false,
          hideFeedbackButtons: data.hideFeedbackButtons ?? false,
          hideBottomNavigation: data.hideBottomNavigation ?? false,
          hideRefreshButton: data.hideRefreshButton ?? false,
          hideExpandButton: data.hideExpandButton ?? false,
          hideHomePage: data.hideHomePage ?? false,
          stayOnHomePage: data.stayOnHomePage ?? false,
          requireTermsAcceptance: data.requireTermsAcceptance ?? false,
          disclaimerText: data.disclaimerText || "",
          autoOpenChatDesktop: data.autoOpenChatDesktop ?? false,
          autoOpenChatDesktopDelay: data.autoOpenChatDesktopDelay ?? 3,
          autoOpenChatMobile: data.autoOpenChatMobile ?? false,
          autoOpenChatMobileDelay: data.autoOpenChatMobileDelay ?? 3,
          smartFollowUpPromptsCount: data.smartFollowUpPromptsCount ?? 3,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHasExistingSettings(false);
      } else {
        console.error("Failed to fetch behavior settings:", error);
        toast.error("Failed to load behavior settings.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!account?.id || !selectedChatbot?.id) return;

    setIsSaving(true);
    try {
      let response;
      if (hasExistingSettings) {
        response = await api.patch(
          `/chatbots/account/${account.id}/chatbot/${selectedChatbot.id}/behavior`,
          formData,
        );
      } else {
        response = await api.post(
          `/chatbots/account/${account.id}/chatbot/${selectedChatbot.id}/behavior`,
          formData,
        );
      }

      if (response.data.success) {
        toast.success(
          response.data.message || "Behavior settings saved successfully",
        );
        setHasExistingSettings(true);
      } else {
        toast.error(response.data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Failed to save behavior settings:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while saving.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex shrink-0 items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
            Advanced Behavior
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-md border-blue-200 bg-white px-3 text-[13px] font-medium text-blue-600 hover:bg-blue-50"
          >
            <PlayCircle className="h-4 w-4 fill-blue-600 text-white" />
            Watch Video Tutorial
          </Button>
        </div>

        <Button
          className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
          onClick={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          Loading settings...
        </div>
      ) : (
        <div className="space-y-12 pb-10">
          {/* Widget Visibility & Features */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Widget Features
              </h2>
              <p className="text-sm text-slate-500">
                Toggle various UI elements in the chatbot widget.
              </p>
            </div>

            <div className="max-w-3xl space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-slate-700">
                    Hide Sources
                  </Label>
                  <p className="text-[13px] text-slate-500">
                    Do not show source links along with chatbot responses.
                  </p>
                </div>
                <Switch
                  checked={formData.hideSources}
                  onCheckedChange={(val) =>
                    handleInputChange("hideSources", val)
                  }
                />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 py-4">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-slate-700">
                    Hide Tooltip
                  </Label>
                  <p className="text-[13px] text-slate-500">
                    Disable the welcome tooltip bubble on initial load.
                  </p>
                </div>
                <Switch
                  checked={formData.hideTooltip}
                  onCheckedChange={(val) =>
                    handleInputChange("hideTooltip", val)
                  }
                />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 py-4">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-slate-700">
                    Hide Feedback Buttons
                  </Label>
                  <p className="text-[13px] text-slate-500">
                    Remove the thumbs up/down buttons on messages.
                  </p>
                </div>
                <Switch
                  checked={formData.hideFeedbackButtons}
                  onCheckedChange={(val) =>
                    handleInputChange("hideFeedbackButtons", val)
                  }
                />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 py-4">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-slate-700">
                    Hide Bottom Navigation
                  </Label>
                  <p className="text-[13px] text-slate-500">
                    Remove the footer navigation area in the widget.
                  </p>
                </div>
                <Switch
                  checked={formData.hideBottomNavigation}
                  onCheckedChange={(val) =>
                    handleInputChange("hideBottomNavigation", val)
                  }
                />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 py-4">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-slate-700">
                    Hide Refresh Button
                  </Label>
                  <p className="text-[13px] text-slate-500">
                    Disable the user's ability to reset the chat session.
                  </p>
                </div>
                <Switch
                  checked={formData.hideRefreshButton}
                  onCheckedChange={(val) =>
                    handleInputChange("hideRefreshButton", val)
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-slate-700">
                    Hide Expand Button
                  </Label>
                  <p className="text-[13px] text-slate-500">
                    Remove the fullscreen toggle button.
                  </p>
                </div>
                <Switch
                  checked={formData.hideExpandButton}
                  onCheckedChange={(val) =>
                    handleInputChange("hideExpandButton", val)
                  }
                />
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Behavior Rules */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Behavior Rules
              </h2>
              <p className="text-sm text-slate-500">
                Configure auto-open delays and content limits.
              </p>
            </div>

            <div className="max-w-3xl space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-8 border-b border-slate-100 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-slate-700">
                      Auto Open (Desktop)
                    </Label>
                    <Switch
                      checked={formData.autoOpenChatDesktop}
                      onCheckedChange={(val) =>
                        handleInputChange("autoOpenChatDesktop", val)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[13px] text-slate-600">
                      Desktop Delay (seconds)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.autoOpenChatDesktopDelay}
                      onChange={(e) =>
                        handleInputChange(
                          "autoOpenChatDesktopDelay",
                          Number(e.target.value),
                        )
                      }
                      className="max-w-[150px]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-slate-700">
                      Auto Open (Mobile)
                    </Label>
                    <Switch
                      checked={formData.autoOpenChatMobile}
                      onCheckedChange={(val) =>
                        handleInputChange("autoOpenChatMobile", val)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[13px] text-slate-600">
                      Mobile Delay (seconds)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.autoOpenChatMobileDelay}
                      onChange={(e) =>
                        handleInputChange(
                          "autoOpenChatMobileDelay",
                          Number(e.target.value),
                        )
                      }
                      className="max-w-[150px]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="font-semibold text-slate-700">
                    Smart Follow-Up Prompts Count
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    value={formData.smartFollowUpPromptsCount}
                    onChange={(e) =>
                      handleInputChange(
                        "smartFollowUpPromptsCount",
                        Number(e.target.value),
                      )
                    }
                    className="max-w-[200px]"
                  />
                  <p className="text-[13px] text-slate-500">
                    Number of dynamic suggestions to show to the user at the end
                    of a response.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Privacy & Legal */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Privacy & Legal
              </h2>
              <p className="text-sm text-slate-500">
                Settings related to terms and app home page.
              </p>
            </div>

            <div className="max-w-3xl space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-slate-700">
                    Hide Home Page
                  </Label>
                  <p className="text-[13px] text-slate-500">
                    Skips the default home page in the widget and goes straight
                    to chat.
                  </p>
                </div>
                <Switch
                  checked={formData.hideHomePage}
                  onCheckedChange={(val) =>
                    handleInputChange("hideHomePage", val)
                  }
                />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-slate-700">
                    Stay On Home Page
                  </Label>
                  <p className="text-[13px] text-slate-500">
                    If enabled, closing the chat returns back to home page
                    instead of history.
                  </p>
                </div>
                <Switch
                  checked={formData.stayOnHomePage}
                  onCheckedChange={(val) =>
                    handleInputChange("stayOnHomePage", val)
                  }
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-slate-700">
                    Require Terms Acceptance
                  </Label>
                  <p className="text-[13px] text-slate-500">
                    Users must agree to terms to start chatting.
                  </p>
                </div>
                <Switch
                  checked={formData.requireTermsAcceptance}
                  onCheckedChange={(val) =>
                    handleInputChange("requireTermsAcceptance", val)
                  }
                />
              </div>

              <div className="space-y-1.5 pt-3">
                <Label className="font-semibold text-slate-700">
                  Disclaimer / Terms Text
                </Label>
                <textarea
                  value={formData.disclaimerText}
                  onChange={(e) =>
                    handleInputChange("disclaimerText", e.target.value)
                  }
                  placeholder="By continuing, you agree to our Terms..."
                  className="min-h-[80px] w-full resize-none rounded-md border border-slate-200 p-3 text-sm shadow-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdvanceTab;

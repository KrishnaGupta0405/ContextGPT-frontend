"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useChatbot } from "@/context/ChatbotContext";
import { PlayCircle, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

// Helper for simple drag & drop image upload section
const ImageUploadZone = ({ label, description, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target.result); // Base64 string for preview/saving
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">{label}</Label>
      {description && (
        <p className="mb-2 text-xs text-slate-500">{description}</p>
      )}

      <div
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-6 text-center transition-colors",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-slate-200 hover:bg-slate-50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {value ? (
          <img
            src={value}
            alt="preview"
            className="mb-2 h-16 w-16 rounded border border-slate-100 bg-white object-contain shadow-sm"
          />
        ) : (
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <UploadCloud className="h-6 w-6 text-slate-400" />
          </div>
        )}
        <p className="text-sm font-medium text-slate-700">
          Click or drag image to upload
        </p>
        <p className="mt-1 text-xs text-slate-400">PNG, JPG, SVG up to 2MB</p>
      </div>
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          className="mt-1 h-8 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
        >
          Remove Image
        </Button>
      )}
    </div>
  );
};

const BasicTab = () => {
  const { account } = useAuth();
  const { selectedChatbot } = useChatbot();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);

  // Appearance Form State
  const [formData, setFormData] = useState({
    chatbotName: "", // Not natively in appearance DB, kept for UI
    tooltip: "",
    welcomeMessage: "",
    inputPlaceholderText: "",
    brandPrimaryColor: "#0000ff",
    brandTextColor: "#80ef80",
    brandIconBgColor: "#ffde21",
    showBackground: false,
    linkColor: "#cc8899",
    fontSize: 14,
    chatHeight: 100,
    externalLink: "",
    iconSize: 48,
    iconPosition: "right", // "left" or "right"
    defaultMode: "light", // "light" or "dark"
    watermarkBrandIcon: "",
    watermarkBrandText: "",
    watermarkBrandLink: "",
    watermarkBrandInfoShow: false,
    hideWatermarkSitegpt: false,
    rightToLeftMode: false,
    enableDarkMode: false,
    distanceFromBottom: 20,
    horizontalDistance: 20,
    botIconSrc: "",
    userIconSrc: "",
    agentIconSrc: "",
    bubbleIconSrc: "",
  });

  useEffect(() => {
    if (account?.id && selectedChatbot?.id) {
      if (selectedChatbot.name) {
        setFormData((prev) => ({ ...prev, chatbotName: selectedChatbot.name }));
      }
      fetchAppearance();
    }
  }, [account?.id, selectedChatbot?.id]);

  const fetchAppearance = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/chatbots/account/${account.id}/chatbot/${selectedChatbot.id}/appearance`,
      );
      if (response.data.success && response.data.data) {
        setHasExistingSettings(true);
        const data = response.data.data;
        setFormData((prev) => ({
          ...prev,
          tooltip: data.tooltip || "",
          welcomeMessage: data.welcomeMessage || "",
          inputPlaceholderText: data.inputPlaceholderText || "",
          brandPrimaryColor: data.brandPrimaryColor || "#000000",
          brandTextColor: data.brandTextColor || "#ffffff",
          brandIconBgColor: data.brandIconBgColor || "#000000",
          showBackground: data.showBackground ?? false,
          linkColor: data.linkColor || "#0000ee",
          fontSize: data.fontSize || 14,
          chatHeight: data.chatHeight || 100,
          externalLink: data.externalLink || "",
          iconSize: data.iconSize || 48,
          iconPosition: data.iconPosition || "right",
          defaultMode: data.defaultMode || "light",
          watermarkBrandIcon: data.watermarkBrandIcon || "",
          watermarkBrandText: data.watermarkBrandText || "",
          watermarkBrandLink: data.watermarkBrandLink || "",
          watermarkBrandInfoShow: data.watermarkBrandInfoShow ?? false,
          hideWatermarkSitegpt: data.hideWatermarkSitegpt ?? false,
          rightToLeftMode: data.rightToLeftMode ?? false,
          enableDarkMode: data.enableDarkMode ?? false,
          distanceFromBottom: data.distanceFromBottom ?? 20,
          horizontalDistance: data.horizontalDistance ?? 20,
          botIconSrc: data.botIconSrc || "",
          userIconSrc: data.userIconSrc || "",
          agentIconSrc: data.agentIconSrc || "",
          bubbleIconSrc: data.bubbleIconSrc || "",
        }));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHasExistingSettings(false);
      } else {
        console.error("Failed to fetch appearance settings:", error);
        toast.error("Failed to load appearance settings.");
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
      const { chatbotName, ...payload } = formData;

      let response;
      if (hasExistingSettings) {
        response = await api.patch(
          `/chatbots/account/${account.id}/chatbot/${selectedChatbot.id}/appearance`,
          payload,
        );
      } else {
        response = await api.post(
          `/chatbots/account/${account.id}/chatbot/${selectedChatbot.id}/appearance`,
          payload,
        );
      }

      if (response.data.success) {
        toast.success(
          response.data.message || "Appearance settings saved successfully",
        );
        setHasExistingSettings(true);
      } else {
        toast.error(response.data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Failed to save appearance settings:", error);
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
            Appearance
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
          {/* Content Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Content</h2>
              <p className="text-sm text-slate-500">
                Change the text related things in the chatbot.
              </p>
            </div>

            <div className="max-w-3xl space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">
                  Chatbot Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.chatbotName}
                  onChange={(e) =>
                    handleInputChange("chatbotName", e.target.value)
                  }
                  className="border-slate-200 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">
                  Tooltip
                </Label>
                <textarea
                  value={formData.tooltip}
                  onChange={(e) => handleInputChange("tooltip", e.target.value)}
                  placeholder="Tooltip, hello how can I assist you today?"
                  className="min-h-[80px] w-full resize-none rounded-md border border-slate-200 p-3 text-sm shadow-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
                <p className="text-[13px] text-slate-500">
                  This tooltip will be shown on the top of chatbot icon. If not
                  set, welcome message will be shown as tooltip.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">
                  Welcome Message
                </Label>
                <textarea
                  value={formData.welcomeMessage}
                  onChange={(e) =>
                    handleInputChange("welcomeMessage", e.target.value)
                  }
                  placeholder="welcome message, hello how can I assist you today?"
                  className="min-h-[80px] w-full resize-none rounded-md border border-slate-200 p-3 text-sm shadow-sm focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
                <p className="text-[13px] text-slate-500">
                  The first message that the users will see in the chatbot.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">
                  Input Placeholder Text
                </Label>
                <Input
                  value={formData.inputPlaceholderText}
                  onChange={(e) =>
                    handleInputChange("inputPlaceholderText", e.target.value)
                  }
                  placeholder="input placeholder text, ask me anythin"
                  className="border-slate-200 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">
                  External Link
                </Label>
                <Input
                  value={formData.externalLink}
                  onChange={(e) =>
                    handleInputChange("externalLink", e.target.value)
                  }
                  placeholder="https://example.com"
                  className="border-slate-200 shadow-sm"
                />
                <p className="text-[13px] text-slate-500">
                  Optional URL to an external support or contact page.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Chat Interface Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Chat Interface
              </h2>
              <p className="text-sm text-slate-500">
                This will be applied when embedded on a website.
              </p>
            </div>

            <div className="max-w-3xl space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Primary Color
                  </Label>
                  <div className="flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm focus-within:ring-1 focus-within:ring-slate-900">
                    <input
                      type="text"
                      value={formData.brandPrimaryColor}
                      onChange={(e) =>
                        handleInputChange("brandPrimaryColor", e.target.value)
                      }
                      className="flex-1 border-none text-sm outline-none focus:ring-0"
                    />
                    <input
                      type="color"
                      value={formData.brandPrimaryColor}
                      onChange={(e) =>
                        handleInputChange("brandPrimaryColor", e.target.value)
                      }
                      className="h-6 w-8 cursor-pointer rounded border-0 p-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Text Color
                  </Label>
                  <div className="flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm focus-within:ring-1 focus-within:ring-slate-900">
                    <input
                      type="text"
                      value={formData.brandTextColor}
                      onChange={(e) =>
                        handleInputChange("brandTextColor", e.target.value)
                      }
                      className="flex-1 border-none text-sm outline-none focus:ring-0"
                    />
                    <input
                      type="color"
                      value={formData.brandTextColor}
                      onChange={(e) =>
                        handleInputChange("brandTextColor", e.target.value)
                      }
                      className="h-6 w-8 cursor-pointer rounded border-0 p-0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Icon Background Color
                  </Label>
                  <div className="flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm focus-within:ring-1 focus-within:ring-slate-900">
                    <input
                      type="text"
                      value={formData.brandIconBgColor}
                      onChange={(e) =>
                        handleInputChange("brandIconBgColor", e.target.value)
                      }
                      className="flex-1 border-none text-sm outline-none focus:ring-0"
                    />
                    <input
                      type="color"
                      value={formData.brandIconBgColor}
                      onChange={(e) =>
                        handleInputChange("brandIconBgColor", e.target.value)
                      }
                      className="h-6 w-8 cursor-pointer rounded border-0 p-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Link Color
                  </Label>
                  <div className="flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm focus-within:ring-1 focus-within:ring-slate-900">
                    <input
                      type="text"
                      value={formData.linkColor}
                      onChange={(e) =>
                        handleInputChange("linkColor", e.target.value)
                      }
                      className="flex-1 border-none text-sm outline-none focus:ring-0"
                    />
                    <input
                      type="color"
                      value={formData.linkColor}
                      onChange={(e) =>
                        handleInputChange("linkColor", e.target.value)
                      }
                      className="h-6 w-8 cursor-pointer rounded border-0 p-0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 py-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-slate-700">
                      Transparent Icon Background
                    </Label>
                    <p className="text-[13px] text-slate-500">
                      Show no background behind the bot icon
                    </p>
                  </div>
                  <Switch
                    checked={!formData.showBackground}
                    onCheckedChange={(checked) =>
                      handleInputChange("showBackground", !checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-slate-700">
                      Enable Dark Mode
                    </Label>
                    <p className="text-[13px] text-slate-500">
                      Allow users to toggle dark mode in the chat
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableDarkMode}
                    onCheckedChange={(checked) =>
                      handleInputChange("enableDarkMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-slate-700">
                      Right to Left Mode (RTL)
                    </Label>
                    <p className="text-[13px] text-slate-500">
                      Enable RTL layout for languages like Arabic, Hebrew
                    </p>
                  </div>
                  <Switch
                    checked={formData.rightToLeftMode}
                    onCheckedChange={(checked) =>
                      handleInputChange("rightToLeftMode", checked)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Font Size (in px)
                  </Label>
                  <Input
                    type="number"
                    value={formData.fontSize}
                    onChange={(e) =>
                      handleInputChange("fontSize", Number(e.target.value))
                    }
                    className="border-slate-200 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Chat Height (in %)
                  </Label>
                  <Input
                    type="number"
                    min={10}
                    max={100}
                    value={formData.chatHeight}
                    onChange={(e) =>
                      handleInputChange("chatHeight", Number(e.target.value))
                    }
                    className="border-slate-200 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Icon Size (in px)
                  </Label>
                  <Input
                    type="number"
                    value={formData.iconSize}
                    onChange={(e) =>
                      handleInputChange("iconSize", Number(e.target.value))
                    }
                    className="border-slate-200 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Distance from Bottom (in px)
                  </Label>
                  <Input
                    type="number"
                    value={formData.distanceFromBottom}
                    onChange={(e) =>
                      handleInputChange(
                        "distanceFromBottom",
                        Number(e.target.value),
                      )
                    }
                    className="border-slate-200 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Horizontal Distance (in px)
                  </Label>
                  <Input
                    type="number"
                    value={formData.horizontalDistance}
                    onChange={(e) =>
                      handleInputChange(
                        "horizontalDistance",
                        Number(e.target.value),
                      )
                    }
                    className="border-slate-200 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Icon Position
                  </Label>
                  <Select
                    value={formData.iconPosition}
                    onValueChange={(val) =>
                      handleInputChange("iconPosition", val)
                    }
                  >
                    <SelectTrigger className="border-slate-200 bg-white">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="right">Bottom Right</SelectItem>
                      <SelectItem value="left">Bottom Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700">
                    Default Color Mode
                  </Label>
                  <Select
                    value={formData.defaultMode}
                    onValueChange={(val) =>
                      handleInputChange("defaultMode", val)
                    }
                  >
                    <SelectTrigger className="w-1/2 border-slate-200 bg-white">
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Watermark Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Watermark</h2>
              <p className="text-sm text-slate-500">
                Customize the branding at the bottom of the chat widget.
              </p>
            </div>

            <div className="max-w-3xl space-y-5">
              <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 py-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-slate-700">
                      Hide Default Website Watermark
                    </Label>
                    <p className="text-[13px] text-slate-500">
                      Remove the default "Powered by" branding (Pro feature)
                    </p>
                  </div>
                  <Switch
                    checked={formData.hideWatermarkSitegpt}
                    onCheckedChange={(checked) =>
                      handleInputChange("hideWatermarkSitegpt", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-slate-700">
                      Show Custom Watermark
                    </Label>
                    <p className="text-[13px] text-slate-500">
                      Display your own branding details in the widget base
                    </p>
                  </div>
                  <Switch
                    checked={formData.watermarkBrandInfoShow}
                    onCheckedChange={(checked) =>
                      handleInputChange("watermarkBrandInfoShow", checked)
                    }
                  />
                </div>
              </div>

              {formData.watermarkBrandInfoShow && (
                <div className="space-y-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <ImageUploadZone
                    label="Watermark Brand Icon"
                    description="Upload your company logo for the watermark (small rectangular or square format works best)."
                    value={formData.watermarkBrandIcon}
                    onChange={(val) =>
                      handleInputChange("watermarkBrandIcon", val)
                    }
                  />

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-slate-700">
                      Watermark Brand Text
                    </Label>
                    <Input
                      value={formData.watermarkBrandText}
                      onChange={(e) =>
                        handleInputChange("watermarkBrandText", e.target.value)
                      }
                      placeholder="e.g. Powered by MyCompany"
                      className="border-slate-200 bg-white shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-slate-700">
                      Watermark Brand Link
                    </Label>
                    <Input
                      value={formData.watermarkBrandLink}
                      onChange={(e) =>
                        handleInputChange("watermarkBrandLink", e.target.value)
                      }
                      placeholder="https://mycompany.com"
                      className="border-slate-200 bg-white shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Icons Setup */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Custom Icons</h2>
              <p className="text-sm text-slate-500">
                Personalize your chatbot's avatars and bubble icon.
              </p>
            </div>

            <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              <ImageUploadZone
                label="Bot Icon"
                description="Upload a custom icon for the bot avatar."
                value={formData.botIconSrc}
                onChange={(val) => handleInputChange("botIconSrc", val)}
              />
              <ImageUploadZone
                label="User Icon"
                description="Upload a custom icon for user messages."
                value={formData.userIconSrc}
                onChange={(val) => handleInputChange("userIconSrc", val)}
              />
              <ImageUploadZone
                label="Agent Icon"
                description="Upload a custom icon for human agents."
                value={formData.agentIconSrc}
                onChange={(val) => handleInputChange("agentIconSrc", val)}
              />
              <ImageUploadZone
                label="Bubble Icon"
                description="Upload an icon for the closed state bubble."
                value={formData.bubbleIconSrc}
                onChange={(val) => handleInputChange("bubbleIconSrc", val)}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default BasicTab;

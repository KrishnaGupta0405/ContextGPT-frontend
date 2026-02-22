"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const allFields = [
  "homeTitle",
  "homeDescription",
  "addDetails",
  "startConversation",
  "starting",
  "messagesTitle",
  "messagesDescription",
  "noMessages",
  "verifyEmailMessage",
  "conversationHistoryInfo",
  "botLabel",
  "youLabel",
  "agentLabel",
  "escalateConfirmation",
  "escalateDescription",
  "yesContinue",
  "cancel",
  "switchedToHuman",
  "startNewConversation",
  "maxMessagesTitle",
  "maxMessagesDescription",
  "connected",
  "disconnected",
  "connecting",
  "disconnecting",
  "reconnect",
  "accountTitle",
  "verifyEmailTitle",
  "verifyEmailDescription",
  "emailLabel",
  "nameLabel",
  "phoneLabel",
  "submitButton",
  "sendingOtp",
  "verifyOtp",
  "otpSentMessage",
  "otpLabel",
  "verifyContinue",
  "resendOtp",
  "editDetails",
  "resetting",
  "verifying",
  "logout",
  "loggingOut",
  "verified",
  "edit",
  "update",
  "updating",
  "leadFormTitle",
  "leadFormDescription",
  "formHeading",
  "formSubmittedMessage",
  "continueButton",
  "submittingText",
  "inputDisabledPlaceholder",
];

const formSchema = z.object(
  Object.fromEntries(allFields.map((f) => [f, z.string().optional()])),
);

const defaultValues = Object.fromEntries(allFields.map((f) => [f, ""]));

// Helper to render a label from a camelCase field name
const fieldLabel = (name) =>
  name.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

// Section groups
const sections = [
  {
    title: "Home",
    description: "Home screen text settings",
    fields: [
      "homeTitle",
      "homeDescription",
      "addDetails",
      "startConversation",
      "starting",
    ],
  },
  {
    title: "Messages",
    description: "Messages screen text settings",
    fields: [
      "messagesTitle",
      "messagesDescription",
      "noMessages",
      "verifyEmailMessage",
      "conversationHistoryInfo",
    ],
  },
  {
    title: "Chat Labels",
    description: "Labels for bot, user and agent",
    fields: ["botLabel", "youLabel", "agentLabel"],
  },
  {
    title: "Escalation",
    description: "Texts shown during escalation flow",
    fields: [
      "escalateConfirmation",
      "escalateDescription",
      "yesContinue",
      "cancel",
      "switchedToHuman",
      "startNewConversation",
    ],
  },
  {
    title: "Max Messages",
    description: "Texts shown when message limit is reached",
    fields: ["maxMessagesTitle", "maxMessagesDescription"],
  },
  {
    title: "Connection Status",
    description: "Real-time connection state labels",
    fields: [
      "connected",
      "disconnected",
      "connecting",
      "disconnecting",
      "reconnect",
    ],
  },
  {
    title: "Account & Verification",
    description: "Account page and email verification texts",
    fields: [
      "accountTitle",
      "verifyEmailTitle",
      "verifyEmailDescription",
      "emailLabel",
      "nameLabel",
      "phoneLabel",
      "submitButton",
      "sendingOtp",
      "verifyOtp",
      "otpSentMessage",
      "otpLabel",
      "verifyContinue",
      "resendOtp",
      "editDetails",
    ],
  },
  {
    title: "Actions & States",
    description: "General action labels and loading states",
    fields: [
      "resetting",
      "verifying",
      "logout",
      "loggingOut",
      "verified",
      "edit",
      "update",
      "updating",
    ],
  },
  {
    title: "Lead Form",
    description: "Lead collection form texts",
    fields: [
      "leadFormTitle",
      "leadFormDescription",
      "formHeading",
      "formSubmittedMessage",
      "continueButton",
      "submittingText",
      "inputDisabledPlaceholder",
    ],
  },
];

const LocalizationTab = () => {
  const { selectedChatbot } = useChatbot();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (selectedChatbot?.id || selectedChatbot?.chatbotId) {
      fetchSettings();
    }
  }, [selectedChatbot]);

  const fetchSettings = async () => {
    setInitialLoading(true);
    try {
      const chatbotId = selectedChatbot.id || selectedChatbot.chatbotId;
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      const accountId = account?.id;
      if (!accountId) throw new Error("Account ID missing");

      const response = await api.get(
        `/chatbot/account/${accountId}/chatbot/${chatbotId}/localization`,
      );

      if (response.data.success && response.data.data) {
        const dataArr = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
        const data = dataArr.find((d) => d.localeCode === "en") || dataArr[0];

        if (data) {
          form.reset(
            Object.fromEntries(allFields.map((f) => [f, data[f] || ""])),
          );
          setIsNewRecord(false);
        } else {
          setIsNewRecord(true);
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setIsNewRecord(true);
      } else {
        console.error("Failed to fetch localization settings", error);
        toast.error("Failed to load localization settings");
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const chatbotId = selectedChatbot.id || selectedChatbot.chatbotId;
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      const accountId = account?.id;
      if (!accountId) throw new Error("Account ID missing");

      const payload = { ...values, localeCode: "en" };

      let response;
      if (isNewRecord) {
        response = await api.post(
          `/chatbot/account/${accountId}/chatbot/${chatbotId}/localization`,
          payload,
        );
      } else {
        response = await api.patch(
          `/chatbot/account/${accountId}/chatbot/${chatbotId}/localization`,
          payload,
        );
      }

      if (response.data.success) {
        toast.success(
          isNewRecord
            ? "Localization settings created"
            : "Localization settings updated",
        );
        if (isNewRecord) setIsNewRecord(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          {sections.map((section) => (
            <div
              key={section.title}
              className="grid grid-cols-1 gap-8 border-b py-8 md:grid-cols-4"
            >
              <div className="md:col-span-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {section.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {section.description}
                </p>
              </div>

              <div className="space-y-6 md:col-span-3">
                {section.fields.map((name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">
                          {fieldLabel(name)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={fieldLabel(name)}
                            {...field}
                            className="h-10 max-w-xl text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Fixed Save Button */}
          <div className="fixed right-0 bottom-0 left-[240px] z-10 flex justify-end border-t bg-white p-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 font-medium text-white hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LocalizationTab;

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { useChatbot } from "@/context/ChatbotContext";
import { ChattingSocketProvider } from "@/context/ChattingSocketContext";
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import FeaturebaseWidget from "@/components/FeaturebaseWidget";

export default function StandaloneClientWrapper({ children }) {
  useScrollRestoration();
  const router = useRouter();
  const { selectedChatbot, updateChatbotRole } = useChatbot();

  // Ensure socket is connected for global events (e.g. member removal)
  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  // Listen for real-time member removal and redirect if kicked from current chatbot
  useEffect(() => {
    const socket = getSocket();

    const handleMemberRemoved = ({ chatbotId }) => {
      const currentChatbotId =
        selectedChatbot?.id || selectedChatbot?.chatbotId;
      if (chatbotId === currentChatbotId) {
        toast.error("You have been removed from this chatbot.");
        router.push("/select-chatbot");
      }
    };

    socket.on("member:removed", handleMemberRemoved);
    return () => socket.off("member:removed", handleMemberRemoved);
  }, [selectedChatbot, router]);

  // Listen for real-time role updates and apply them to the selected chatbot
  useEffect(() => {
    const socket = getSocket();

    const handleRoleUpdated = (event) => {
      const currentChatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;

      if (event.type === "chatbot" && event.chatbotId === currentChatbotId) {
        updateChatbotRole(event.newRole);
        const chatbotLabel = event.chatbotName || "a chatbot";
        const accountLabel = event.accountName ? ` (${event.accountName})` : "";
        toast.info(`Your role in ${chatbotLabel}${accountLabel} was updated to ${event.newRole}.`);
      } else if (event.type === "account") {
        // Account-level role change affects the selected chatbot if it belongs to this account
        const currentAccountId = selectedChatbot?.accountId;
        if (currentAccountId && event.accountId === currentAccountId) {
          updateChatbotRole(event.newRole);
          const accountLabel = event.accountName || "your account";
          toast.info(`Your role in ${accountLabel} was updated to ${event.newRole}.`);
        }
      }
    };

    socket.on("role:updated", handleRoleUpdated);
    return () => socket.off("role:updated", handleRoleUpdated);
  }, [selectedChatbot, updateChatbotRole]);

  // Inject the chatbot widget script once the chatbotId is available.
  // Each time selectedChatbot changes we do a full teardown + reinject so the
  // loader re-runs with the correct chatbot-id (updating data-chatbot-id on an
  // already-executed <script> has no effect).
  useEffect(() => {
    const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;
    if (!chatbotId) return;

    // Teardown any existing widget instance
    const existingScript = document.getElementById("contextgpt-widget-script");
    if (existingScript) existingScript.remove();
    const existingHost = document.getElementById("contextgpt-widget");
    if (existingHost) existingHost.remove();

    const script = document.createElement("script");
    script.id = "contextgpt-widget-script";
    script.type = "module";
    script.src =
      `https://contextgpt-widget-testing.vercel.app/loader.js?v=${Date.now()}`;
    script.setAttribute("data-chatbot-id", chatbotId);
    script.setAttribute("data-server", "http://localhost:9000");
    document.body.appendChild(script);

    return () => {
      const s = document.getElementById("contextgpt-widget-script");
      if (s) s.remove();
      const h = document.getElementById("contextgpt-widget");
      if (h) h.remove();
    };
  }, [selectedChatbot]);

  return (
    <ChattingSocketProvider>
      <UnsavedChangesProvider>
        <div className="flex min-h-screen w-full">
          {/* <FeaturebaseWidget /> */}
          <Sidebar>{children}</Sidebar>
        </div>
      </UnsavedChangesProvider>
    </ChattingSocketProvider>
  );
}

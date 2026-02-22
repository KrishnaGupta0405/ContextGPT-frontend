"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CustomResponsesContext = createContext();

export function CustomResponsesProvider({ children }) {
  const { selectedChatbot } = useChatbot();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getIds = () => {
    let accountId;
    try {
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      accountId = account?.id;
    } catch (e) {
      console.error("Failed to parse account from localStorage", e);
    }
    const chatbotId = selectedChatbot?.id || selectedChatbot?.chatbotId;
    return { accountId, chatbotId };
  };

  const fetchPrompts = useCallback(async () => {
    const { accountId, chatbotId } = getIds();
    if (!accountId || !chatbotId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(
        `/chatbots/account/${accountId}/chatbot/${chatbotId}/custom-responses`,
      );
      const list = res.data?.data?.data || [];
      setPrompts(list);
    } catch (err) {
      console.error("Error fetching custom prompts:", err);
      toast.error("Failed to load custom responses");
    } finally {
      setLoading(false);
    }
  }, [selectedChatbot]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const handleCreate = async (data) => {
    const { accountId, chatbotId } = getIds();
    try {
      const res = await api.post(
        `/chatbots/account/${accountId}/chatbot/${chatbotId}/custom-responses`,
        data,
      );
      const newPrompt = res.data?.data;
      if (newPrompt) {
        setPrompts((prev) => [newPrompt, ...prev]);
        toast.success("Custom response created successfully");
        router.push(`?promptId=${newPrompt.id}`);
        return true;
      }
    } catch (err) {
      console.error("Failed to create prompt", err);
      toast.error(
        err.response?.data?.message || "Failed to create custom response",
      );
      return false;
    }
  };

  const handleEdit = async (id, data) => {
    const { accountId, chatbotId } = getIds();
    try {
      const res = await api.patch(
        `/chatbots/account/${accountId}/chatbot/${chatbotId}/custom-responses/${id}`,
        data,
      );
      const updated = res.data?.data;
      if (updated) {
        setPrompts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
        toast.success("Custom response updated successfully");
        return true;
      }
    } catch (err) {
      console.error("Failed to update prompt", err);
      toast.error(
        err.response?.data?.message || "Failed to update custom response",
      );
      return false;
    }
  };

  const handleDelete = async (promptId) => {
    const { accountId, chatbotId } = getIds();
    try {
      await api.delete(
        `/chatbots/account/${accountId}/chatbot/${chatbotId}/custom-responses?customResponseId=${promptId}`,
      );
      setPrompts((prev) => prev.filter((p) => p.id !== promptId));
      toast.success("Custom response deleted");
      return true;
    } catch (err) {
      console.error("Failed to delete prompt", err);
      toast.error("Failed to delete custom response");
      return false;
    }
  };

  return (
    <CustomResponsesContext.Provider
      value={{
        prompts,
        loading,
        selectedChatbot,
        handleCreate,
        handleEdit,
        handleDelete,
        refresh: fetchPrompts,
      }}
    >
      {children}
    </CustomResponsesContext.Provider>
  );
}

export const useCustomResponses = () => {
  const context = useContext(CustomResponsesContext);
  if (!context) {
    throw new Error(
      "useCustomResponses must be used within a CustomResponsesProvider",
    );
  }
  return context;
};

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedChatbot = localStorage.getItem("selectedChatbot");
    if (storedChatbot) {
      try {
        setSelectedChatbot(JSON.parse(storedChatbot));
      } catch (e) {
        console.error("Failed to parse stored chatbot", e);
      }
    }
    setLoading(false);
  }, []);

  const selectChatbot = (chatbot) => {
    setSelectedChatbot(chatbot);
    if (chatbot) {
      localStorage.setItem("selectedChatbot", JSON.stringify(chatbot));
    } else {
      localStorage.removeItem("selectedChatbot");
    }
  };

  const updateChatbotRole = (newRole) => {
    setSelectedChatbot((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, userRole: newRole };
      localStorage.setItem("selectedChatbot", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ChatbotContext.Provider
      value={{ selectedChatbot, selectChatbot, updateChatbotRole, loading }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

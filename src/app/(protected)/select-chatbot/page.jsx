"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SelectChatbotPage() {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectChatbot } = useChatbot();
  const router = useRouter();

  const fetchChatbots = async () => {
    setLoading(true);
    try {
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      const accountId = account?.id;
      if (!accountId) {
        throw new Error("No account ID found");
      }

      const response = await api.get(
        `/chatbots/account/${accountId}/all-chatbots`,
      );
      const chatbotData = response.data.data?.chatbots || [];

      const mappedChatbots = chatbotData.map((cb) => ({
        ...cb,
        id: cb.chatbotId,
      }));

      setChatbots(mappedChatbots);
    } catch (error) {
      console.error("Failed to fetch chatbots", error);
      toast.error("Failed to load chatbots. Please try again.", {
        description: error.response?.data?.message,
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatbots();
  }, []);

  const handleSelect = (chatbot) => {
    selectChatbot(chatbot);
    console.log("Selected chatbot", chatbot);
    toast.success(`Selected ${chatbot.name}`);
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-muted-foreground font-medium">
          Fetching your chatbots...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 sm:p-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Select a Chatbot
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Choose a chatbot to manage its personality and data.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={fetchChatbots}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>
        </div>

        {chatbots.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border-2 border-dashed p-20 text-center">
            <div className="mb-4 rounded-full bg-blue-100 p-4">
              <MessageSquare className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="mb-2">No Chatbots Found</CardTitle>
            <CardDescription className="mb-6">
              You haven't created any chatbots yet. Get started by creating your
              first one.
            </CardDescription>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Your First Chatbot
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chatbots.map((chatbot) => (
              <Card
                key={chatbot.id}
                className="group relative cursor-pointer overflow-hidden transition-all hover:border-blue-200 hover:shadow-lg"
                onClick={() => handleSelect(chatbot)}
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-xl font-bold text-blue-600 uppercase">
                    {chatbot.name.substring(0, 2)}
                  </div>
                  <CardTitle>{chatbot.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {chatbot.description ||
                      "Conversational AI agent for your website."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      Active
                    </div>
                    <span>•</span>
                    <span>{chatbot.leadsCount || 0} leads</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto border-t bg-slate-50 py-3">
                  <span className="text-sm font-medium text-blue-600 group-hover:underline">
                    Manage Chatbot →
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

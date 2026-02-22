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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  Edit2,
} from "lucide-react";

// Schema for Instruction forms
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  instruction: z.string().min(1, "Instructions are required"),
  creativityLevel: z.coerce.number().min(0).max(1).default(0.7),
});

const defaultValues = {
  title: "",
  instruction: "",
  creativityLevel: 0.7,
};

const InstructionCard = ({
  instruction,
  isSelected,
  onSelect,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onSelect(instruction)}
      className={`mb-4 cursor-pointer overflow-hidden rounded-[10px] border transition-all ${
        isSelected
          ? "border-blue-600 bg-blue-50/10 ring-1 ring-blue-600"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-4 p-5 md:p-6">
        {/* Radio Button */}
        <div className="pt-0.5">
          <div
            className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors ${
              isSelected
                ? "border-blue-600 bg-blue-600"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && <Check className="h-3 w-3 stroke-[3] text-white" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="text-[15px] font-semibold text-gray-900">
              {instruction.title === "None" ? "None" : instruction.title}
            </div>

            {/* Action Buttons for Custom Instructions */}
            {instruction.title !== "None" && onEdit && onDelete && (
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onEdit(instruction)}
                  className="p-1 text-gray-400 transition-colors hover:text-gray-700"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(instruction)}
                  className="p-1 text-red-400 transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
          >
            {isExpanded ? "Hide Details" : "View Details"}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Expandable Section */}
          {isExpanded && (
            <div
              className="mt-4 cursor-default rounded-lg bg-gray-50 p-5 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 text-sm font-semibold text-gray-900">
                Instructions
              </div>
              <div className="mb-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-600">
                {instruction.instruction || "No instructions provided."}
              </div>

              {instruction.title !== "None" && (
                <>
                  <div className="mb-1 text-sm font-semibold text-gray-900">
                    Temperature
                  </div>
                  <div className="text-sm leading-relaxed text-gray-600">
                    {instruction.creativityLevel}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InstructionsTab = () => {
  const { selectedChatbot } = useChatbot();
  const [instructions, setInstructions] = useState([]);
  const [selectedInstructionId, setSelectedInstructionId] =
    useState("default-none");

  const [expandedCardId, setExpandedCardId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [fallbackMessage, setFallbackMessage] = useState("");
  const [savingFallback, setSavingFallback] = useState(false);

  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [editingInstructionId, setEditingInstructionId] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (selectedChatbot?.id || selectedChatbot?.chatbotId) {
      fetchInstructions();
      // Fetch fallback message from localization or general settings if needed
      // Mocking fallback message load for now:
      setFallbackMessage(
        "I'm sorry, I don't have enough information to answer your question, but I'm happy to assist with any other questions you may have.",
      );
    }
  }, [selectedChatbot]);

  const fetchInstructions = async (selectId = null) => {
    setInitialLoading(true);
    try {
      const chatbotId = selectedChatbot.id || selectedChatbot.chatbotId;
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      const accountId = account?.id;
      if (!accountId) throw new Error("Account ID missing");

      // Replace with actual API call to Instructions endpoint
      const response = await api.get(
        `/chatbots/account/${accountId}/chatbot/${chatbotId}/instruction`,
      );

      if (response.data.success) {
        let fetchedInstructions = response.data.data || [];
        // Ensure it's an array. If backend returns single object for some reason, wrap it.
        if (!Array.isArray(fetchedInstructions)) {
          fetchedInstructions = [fetchedInstructions];
        }

        setInstructions(fetchedInstructions);

        // Pre-select logic
        if (selectId) setSelectedInstructionId(selectId);
        else if (
          selectedInstructionId === "default-none" &&
          fetchedInstructions.length > 0
        ) {
          // If they have custom ones and none is selected, don't auto-select unless intended.
          // We'll leave it as "default-none" unless logic dictates otherwise
        }
      }
    } catch (error) {
      console.error("Failed to fetch instructions", error);
      // Suppress 404 error toast specifically as it implies "none created yet" based on controller
      if (error.response?.status !== 404) {
        toast.error("Failed to load instructions");
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSaveFallbackMessage = async () => {
    setSavingFallback(true);
    try {
      // Mocking save for Fallback Message
      // const chatbotId = selectedChatbot.id || selectedChatbot.chatbotId;
      // const accountId = JSON.parse(localStorage.getItem("account") || "{}")?.id;
      // await api.patch(`/chatbot/account/${accountId}/chatbot/${chatbotId}`, { fallbackMessage });

      // Network delay mock
      toast.success("Backend route not configured yet");
    } catch (error) {
      toast.error("Failed to save fallback message");
    } finally {
      setSavingFallback(false);
    }
  };

  const handleAddNewCustom = () => {
    setIsEditingCustom(true);
    setEditingInstructionId(null);
    form.reset(defaultValues);
  };

  const handleEditCustom = (instruction) => {
    setIsEditingCustom(true);
    setEditingInstructionId(instruction.id);
    form.reset({
      title: instruction.title || "",
      instruction: instruction.instruction || "",
      creativityLevel: instruction.creativityLevel ?? 0.7,
    });
    setSelectedInstructionId(instruction.id);
  };

  const cancelEditing = () => {
    setIsEditingCustom(false);
    setEditingInstructionId(null);
  };

  const onSubmitCustom = async (values) => {
    setLoading(true);
    try {
      const chatbotId = selectedChatbot.id || selectedChatbot.chatbotId;
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      const accountId = account?.id;

      const payload = {
        ...values,
        creativityLevel: Number(values.creativityLevel),
        deletable: true,
        isActive: true, // Assuming new ones are active or default false
      };

      let response;
      if (!editingInstructionId) {
        response = await api.post(
          `/chatbots/account/${accountId}/chatbot/${chatbotId}/instruction`,
          payload,
        );
      } else {
        response = await api.patch(
          `/chatbots/account/${accountId}/chatbot/${chatbotId}/instruction?instructionId=${editingInstructionId}`,
          payload,
        );
      }

      if (response.data.success) {
        toast.success(
          editingInstructionId ? "Instruction updated" : "Instruction created",
        );
        const newId = response.data.data?.id;
        setIsEditingCustom(false);
        fetchInstructions(newId || editingInstructionId);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save instruction",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustom = async (instruction) => {
    if (!confirm(`Are you sure you want to delete "${instruction.title}"?`))
      return;

    try {
      const chatbotId = selectedChatbot.id || selectedChatbot.chatbotId;
      const account = JSON.parse(localStorage.getItem("account") || "{}");

      const response = await api.delete(
        `/chatbots/account/${account.id}/chatbot/${chatbotId}/instruction?instructionId=${instruction.id}`,
      );

      if (response.data.success) {
        toast.success("Instruction deleted");
        if (selectedInstructionId === instruction.id) {
          setSelectedInstructionId("default-none");
        }
        fetchInstructions(selectedInstructionId);
      }
    } catch (error) {
      toast.error("Failed to delete instruction");
    }
  };

  const handleSaveChanges = async () => {
    toast.success("Active instruction selection saved!");
  };

  if (initialLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl pb-24">
      {/* Fallback Message Section */}
      <div className="grid grid-cols-1 gap-8 border-b border-gray-100 py-10 md:grid-cols-4">
        <div className="pr-6 md:col-span-1">
          <h3 className="text-base font-semibold text-gray-900">
            Fallback Message
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
            Customize the message shown when the chatbot can't find relevant
            information to answer a question.
          </p>
        </div>

        <div className="w-full md:col-span-3">
          <div className="mb-2 text-[13px] font-semibold text-gray-900">
            Fallback Message
          </div>
          <Textarea
            value={fallbackMessage}
            onChange={(e) => setFallbackMessage(e.target.value)}
            className="mb-2 min-h-[100px] resize-none text-[14px] shadow-sm"
          />
          <div className="mb-4 text-[13px] text-gray-500">
            This message will be shown when the chatbot cannot find relevant
            information to answer a user's question.
          </div>
          <Button
            onClick={handleSaveFallbackMessage}
            disabled={savingFallback}
            className="h-9 bg-blue-600 px-4 text-sm font-medium shadow-sm transition-colors hover:bg-blue-700"
          >
            {savingFallback && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Fallback Message
          </Button>
        </div>
      </div>

      {/* Default Instructions Section */}
      <div className="grid grid-cols-1 gap-8 border-b border-gray-100 py-10 md:grid-cols-4">
        <div className="pr-6 md:col-span-1">
          <h3 className="text-base font-semibold text-gray-900">
            Default Instructions
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
            Keep the default behavior.
          </p>
        </div>

        <div className="w-full md:col-span-3">
          <InstructionCard
            instruction={{
              id: "default-none",
              title: "None",
              instruction:
                "No specific base instructions applied. The chatbot will purely rely on standard behaviors and base prompts.",
            }}
            isSelected={selectedInstructionId === "default-none"}
            onSelect={(p) => setSelectedInstructionId(p.id)}
            isExpanded={expandedCardId === "default-none"}
            onToggleExpand={() =>
              setExpandedCardId(
                expandedCardId === "default-none" ? null : "default-none",
              )
            }
          />
        </div>
      </div>

      {/* Custom Instructions Section */}
      <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-4">
        <div className="pr-6 md:col-span-1">
          <h3 className="text-base font-semibold text-gray-900">
            Custom Instructions
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
            Give your chatbot custom instructions.
          </p>
        </div>

        <div className="w-full md:col-span-3">
          {/* List of Custom Instructions */}
          {!isEditingCustom &&
            instructions.map((instruction) => (
              <InstructionCard
                key={instruction.id}
                instruction={instruction}
                isSelected={selectedInstructionId === instruction.id}
                onSelect={(p) => setSelectedInstructionId(p.id)}
                isExpanded={expandedCardId === instruction.id}
                onToggleExpand={() =>
                  setExpandedCardId(
                    expandedCardId === instruction.id ? null : instruction.id,
                  )
                }
                onEdit={handleEditCustom}
                onDelete={handleDeleteCustom}
              />
            ))}

          {!isEditingCustom && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleAddNewCustom}
                className="h-10 w-full justify-start rounded-[8px] bg-white px-4 text-left font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Instructions
              </Button>
            </div>
          )}

          {/* Form for Creating/Editing Custom Instruction */}
          {isEditingCustom && (
            <div className="mb-6 rounded-[10px] border border-blue-100 bg-blue-50/30 p-6 shadow-sm">
              <h4 className="mb-5 text-base font-semibold text-gray-900">
                {editingInstructionId
                  ? "Edit Custom Instructions"
                  : "Create Custom Instructions"}
              </h4>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitCustom)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.g. Support Guidelines #1"
                            {...field}
                            className="h-10 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instruction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Instructions
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide system instructions..."
                            className="min-h-[150px] font-mono text-sm leading-relaxed"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="creativityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Creativity Level (0.0 to 1.0)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            {...field}
                            className="h-10 w-32 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-2 flex justify-end gap-3 border-t border-gray-200 pt-5">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 px-4 text-sm font-medium"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-9 bg-blue-600 px-4 text-sm font-medium shadow-sm hover:bg-blue-700"
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingInstructionId ? "Update" : "Save"} Custom
                      Instructions
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>

      {/* Global Save Button Container */}
      <div className="fixed right-0 bottom-0 left-[240px] z-10 flex justify-end border-t border-gray-200 bg-white p-4">
        <Button
          onClick={handleSaveChanges}
          className="h-10 rounded-md bg-blue-600 px-8 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default InstructionsTab;

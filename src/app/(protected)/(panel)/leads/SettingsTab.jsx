"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useChatbot } from "@/context/ChatbotContext";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Building2,
  AlarmClock,
  Type,
  Lightbulb,
} from "lucide-react";

// Schema based on backend constraints
const formSchema = z.object({
  enableLeadCollection: z.boolean().default(false),
  customerNameTake: z.boolean().default(false),
  customerPhoneTake: z.boolean().default(false),
  customerEmailTake: z.boolean().default(true),

  industryTemplate: z.string().optional(),

  whenToCollectLead: z.string().optional(),
  afterNMessagesCount: z.number().min(1).default(1),

  customerTriggerKeywords: z.string().optional(),

  bookingIntegration: z.boolean().default(false),
  bookingIntegrationLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),

  leadNotification: z.boolean().default(false),
  leadNotificationEmail: z.string().optional(),

  customerFormField: z
    .array(
      z.object({
        display_label: z.string().min(1, "Label is required"),
        field_name: z.string().min(1, "Field name is required"),
        field_type: z.enum(["text", "select"]),
        required: z.boolean().default(false),
        placeholder_text: z.string().optional(),
        options: z.string().optional(), // Comma separated for input
      }),
    )
    .optional(),
});

const DEFAULT_CUSTOM_FIELD = {
  display_label: "",
  field_name: "",
  field_type: "text",
  required: false,
  placeholder_text: "",
  options: "",
};

const SettingsTab = () => {
  const { selectedChatbot } = useChatbot();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isNewSettings, setIsNewSettings] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enableLeadCollection: false,
      customerNameTake: false,
      customerPhoneTake: false,
      customerEmailTake: true,
      industryTemplate: "",
      whenToCollectLead: "interest",
      afterNMessagesCount: 1,
      customerTriggerKeywords: "",
      bookingIntegration: false,
      bookingIntegrationLink: "",
      leadNotification: false,
      leadNotificationEmail: "",
      customerFormField: [DEFAULT_CUSTOM_FIELD],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customerFormField",
  });

  const isEnabled = form.watch("enableLeadCollection");
  const industryTemplate = form.watch("industryTemplate");

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
        `/chatbots/account/${accountId}/chatbot/${chatbotId}/lead-settings`,
      );

      if (response.data.success && response.data.data) {
        const data = response.data.data;

        // Parse "after_X_messages" into "after_n_messages" and X
        let whenToCollectLead = data.whenToCollectLead;
        let afterNMessagesCount = data.afterNMessagesCount || 1;

        if (whenToCollectLead && whenToCollectLead.startsWith("after_")) {
          const match = whenToCollectLead.match(/^after_(\d+)_messages$/);
          if (match) {
            afterNMessagesCount = parseInt(match[1]);
            whenToCollectLead = "after_n_messages";
          }
        }

        // Transform array to string for display
        const emailString = Array.isArray(data.leadNotificationEmail)
          ? data.leadNotificationEmail.join(", ")
          : "";

        // Transform properties mapping if backend still returns snake_case for some reason,
        // but user says backend returns camelCase, so we trust that.
        // We do need to handle customerFormField options which might be array -> string

        const formattedFormFields = (data.customerFormField || []).map((f) => ({
          ...f,
          options: Array.isArray(f.options) ? f.options.join(", ") : f.options,
        }));

        // Limit to 1 block to remove the others from UI/DB upon saving
        const limitedFormFields = formattedFormFields.slice(0, 1);

        form.reset({
          ...data,
          whenToCollectLead,
          afterNMessagesCount,
          leadNotificationEmail: emailString,
          industryTemplate: data.industryTemplate || "custom", // Default to custom if empty?
          customerTriggerKeywords: data.customerTriggerKeywords || "",
          bookingIntegrationLink: data.bookingIntegrationLink || "",
          customerFormField:
            limitedFormFields.length > 0
              ? limitedFormFields
              : [DEFAULT_CUSTOM_FIELD],
        });
        setIsNewSettings(false);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setIsNewSettings(true);
        form.reset({
          enableLeadCollection: false,
          customerNameTake: false,
          customerPhoneTake: false,
          customerEmailTake: true,
          industryTemplate: "",
          whenToCollectLead: "interest",
          customerTriggerKeywords: "",
          bookingIntegration: false,
          bookingIntegrationLink: "",
          leadNotification: false,
          leadNotificationEmail: "",
          customerFormField: [DEFAULT_CUSTOM_FIELD],
        });
      } else {
        console.error("Failed to fetch settings", error);
        toast.error("Failed to load settings");
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

      // Transform data for backend
      const whenToCollectValue =
        values.whenToCollectLead === "after_n_messages"
          ? `after_${values.afterNMessagesCount}_messages`
          : values.whenToCollectLead;

      const payload = {
        ...values,
        whenToCollectLead: whenToCollectValue,
        leadNotificationEmail: values.leadNotificationEmail
          ? values.leadNotificationEmail
              .split(",")
              .map((e) => e.trim())
              .filter((e) => e)
          : [],
        customerFormField: values.customerFormField?.map((f) => ({
          ...f,
          options: f.options
            ? f.options
                .split(",")
                .map((o) => o.trim())
                .filter((o) => o)
            : [],
        })),
      };

      let response;
      if (isNewSettings) {
        response = await api.post(
          `/chatbots/account/${accountId}/chatbot/${chatbotId}/lead-settings`,
          payload,
        );
      } else {
        response = await api.patch(
          `/chatbots/account/${accountId}/chatbot/${chatbotId}/lead-settings`,
          payload,
        );
      }

      if (response.data.success) {
        toast.success(
          isNewSettings
            ? "Settings created successfully"
            : "Settings updated successfully",
        );
        if (isNewSettings) setIsNewSettings(false);
        fetchSettings();
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save settings";
      console.error("Submit error", error);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border bg-white p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-medium">Lead Collection Settings</h3>
        <p className="text-muted-foreground text-sm">
          Configure how and when your chatbot collects visitor information.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Toggle */}
          <FormField
            control={form.control}
            name="enableLeadCollection"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Enable Lead Collection
                  </FormLabel>
                  <FormDescription>
                    Allow the chatbot to collect leads from visitors.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Field Toggles */}
            <div
              className={`space-y-4 rounded-lg border p-4 ${!isEnabled ? "pointer-events-none opacity-50" : ""}`}
            >
              <h4 className="mb-4 text-sm font-medium">
                Information to Collect
              </h4>

              <FormField
                control={form.control}
                name="customerNameTake"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="font-normal">Name</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEnabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerPhoneTake"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="font-normal">
                        Phone Number
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEnabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmailTake"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="font-normal">
                        Email Address
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Always required for lead identification and follow-up
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} defaultChecked disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Collection Triggers Section */}
            <div
              className={`space-y-6 rounded-xl border bg-white p-6 shadow-sm ${!isEnabled ? "pointer-events-none opacity-50" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-pink-50 p-2 text-pink-500">
                  <AlarmClock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Collection Triggers
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Choose when the AI should attempt to collect visitor contact
                    information
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="whenToCollectLead"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-sm font-semibold">
                      When to collect leads
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                        disabled={!isEnabled}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="interest" id="interest" />
                          <Label
                            htmlFor="interest"
                            className="text-sm font-normal"
                          >
                            When user shows interest (Recommended)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value="unable_to_answer"
                            id="unable_to_answer"
                          />
                          <Label
                            htmlFor="unable_to_answer"
                            className="text-sm font-normal"
                          >
                            When unable to answer
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value="after_n_messages"
                            id="after_n_messages"
                          />
                          <div className="flex items-center gap-2 text-sm font-normal">
                            <span>After</span>
                            <FormField
                              control={form.control}
                              name="afterNMessagesCount"
                              render={({ field: countField }) => (
                                <Input
                                  type="number"
                                  className="h-8 w-16 text-center"
                                  {...countField}
                                  disabled={!isEnabled}
                                  onChange={(e) =>
                                    countField.onChange(Number(e.target.value))
                                  }
                                />
                              )}
                            />
                            <span>messages (static form)</span>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Custom Trigger Keywords Section */}
            <div
              className={`space-y-6 rounded-xl border bg-white p-6 shadow-sm ${!isEnabled ? "pointer-events-none opacity-50" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-500">
                  <Type className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Custom Trigger Keywords
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Define specific keywords that trigger lead collection
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-amber-50/50 p-3 text-sm text-amber-600">
                <Lightbulb className="h-4 w-4 shrink-0" />
                <p>
                  Not used with "After X messages" - form shows automatically
                </p>
              </div>

              <FormField
                control={form.control}
                name="customerTriggerKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-500">
                      Keywords (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="pricing, demo, consultation, quote, appointment, contact, schedule, buy, purchase"
                        className="min-h-[120px] resize-none border-slate-200"
                        {...field}
                        disabled={!isEnabled}
                      />
                    </FormControl>
                    <FormDescription className="text-xs leading-relaxed text-slate-400">
                      Enter keywords separated by commas. When visitors mention
                      these words, the AI will attempt to collect their contact
                      information.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Industry Template Section */}
          <div
            className={`space-y-4 rounded-lg border p-4 ${!isEnabled ? "pointer-events-none opacity-50" : ""}`}
          >
            <div className="mb-2 flex items-start gap-4">
              <div className="rounded-lg bg-slate-100 p-2">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h4 className="mb-1 text-lg leading-none font-semibold">
                  Industry Template
                </h4>
                <p className="text-muted-foreground text-sm italic">
                  Choose a template optimized for your industry, or select
                  Custom to configure manually
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="industryTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase">
                    Template Selection
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "custom"}
                    disabled={!isEnabled}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="custom">
                        <div className="flex flex-col">
                          <span className="font-medium">Custom</span>
                          <span className="text-muted-foreground text-xs">
                            Configure your own lead collection settings
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dental">
                        <div className="flex flex-col">
                          <span className="font-medium">Dental Clinic</span>
                          <span className="text-muted-foreground text-xs">
                            Optimized for dental practices and patient
                            scheduling
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="hvac">
                        <div className="flex flex-col">
                          <span className="font-medium">HVAC Services</span>
                          <span className="text-muted-foreground text-xs">
                            For heating, cooling, and air conditioning services
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="legal">
                        <div className="flex flex-col">
                          <span className="font-medium">Legal Services</span>
                          <span className="text-muted-foreground text-xs">
                            For law firms and legal consultations
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="real_estate">
                        <div className="flex flex-col">
                          <span className="font-medium">Real Estate</span>
                          <span className="text-muted-foreground text-xs">
                            For realtors and property services
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="automotive">
                        <div className="flex flex-col">
                          <span className="font-medium">Automotive</span>
                          <span className="text-muted-foreground text-xs">
                            For auto repair, dealerships, and car services
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="healthcare">
                        <div className="flex flex-col">
                          <span className="font-medium">Healthcare</span>
                          <span className="text-muted-foreground text-xs">
                            For medical practices and health services
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="saas">
                        <div className="flex flex-col">
                          <span className="font-medium">SaaS/Software</span>
                          <span className="text-muted-foreground text-xs">
                            For software companies and SaaS products
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ecommerce">
                        <div className="flex flex-col">
                          <span className="font-medium">E-commerce</span>
                          <span className="text-muted-foreground text-xs">
                            For online stores and retail businesses
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="consulting">
                        <div className="flex flex-col">
                          <span className="font-medium">Consulting</span>
                          <span className="text-muted-foreground text-xs">
                            For consultants and professional services
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Form Fields - Only when Template is Custom */}
            {industryTemplate === "custom" && (
              <div className="mt-4 space-y-4 rounded-lg border bg-slate-50 p-4">
                <h5 className="font-medium text-slate-800">
                  Custom Form Fields
                </h5>
                <p className="text-muted-foreground text-xs">
                  Define additional fields to collect from the user.
                </p>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative grid grid-cols-1 gap-4 rounded-md border bg-white p-4 md:grid-cols-2 lg:grid-cols-3"
                  >
                    <FormField
                      control={form.control}
                      name={`customerFormField.${index}.display_label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Display Label
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`customerFormField.${index}.field_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Field Name</FormLabel>
                          <FormControl>
                            <Input placeholder="company_name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`customerFormField.${index}.field_type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Field Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`customerFormField.${index}.placeholder_text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Placeholder</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`customerFormField.${index}.required`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-y-0 space-x-2 rounded-md border p-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-normal">
                            Required
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    {/* Conditional Options Input for Select Type */}
                    {form.watch(`customerFormField.${index}.field_type`) ===
                      "select" && (
                      <FormField
                        control={form.control}
                        name={`customerFormField.${index}.options`}
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
                            <FormLabel className="text-xs">
                              Options (Comma separated)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Morning, Afternoon, Evening"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => remove(index)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full border-dashed"
                  onClick={() =>
                    append({
                      display_label: "",
                      field_name: "",
                      field_type: "text",
                      required: false,
                      placeholder_text: "",
                      options: "",
                    })
                  }
                >
                  + Add Field
                </Button>
              </div>
            )}
          </div>

          {/* Integrations */}
          <div
            className={`space-y-4 rounded-lg border p-4 ${!isEnabled ? "pointer-events-none opacity-50" : ""}`}
          >
            <h4 className="mb-2 text-sm font-medium">Booking Integration</h4>
            <FormField
              control={form.control}
              name="bookingIntegration"
              render={({ field }) => (
                <FormItem className="mb-4 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="font-normal">
                      Enable Booking Integration
                    </FormLabel>
                    <FormDescription>
                      Link to Calendly or similar tools
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEnabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("bookingIntegration") && (
              <FormField
                control={form.control}
                name="bookingIntegrationLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://calendly.com/your-link"
                        {...field}
                        disabled={!isEnabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Notifications */}
          <div
            className={`space-y-4 rounded-lg border p-4 ${!isEnabled ? "pointer-events-none opacity-50" : ""}`}
          >
            <h4 className="mb-2 text-sm font-medium">Notifications</h4>
            <FormField
              control={form.control}
              name="leadNotification"
              render={({ field }) => (
                <FormItem className="mb-4 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="font-normal">
                      Email Notifications
                    </FormLabel>
                    <FormDescription>
                      Get notified when a new lead is captured
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEnabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("leadNotification") && (
              <FormField
                control={form.control}
                name="leadNotificationEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Emails</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com, another@example.com"
                        {...field}
                        disabled={!isEnabled}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma separated list of emails
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Settings
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SettingsTab;

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Play } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import GeneralTab from "./GeneralTab";
import UserDataTab from "./UserDataTab";
import ChatModesTab from "./ChatModesTab";
import LocalizationTab from "./LocalizationTab";
import PersonasTab from "./PersonasTab";
import InstructionsTab from "./InstructionsTab";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";

const VALID_TABS = [
  "general",
  "user-data",
  "chat-modes",
  "localization",
  "personas",
  "instructions",
];

const SettingsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");

  const initialTab = useMemo(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      return tabParam;
    }
    return "localization";
  }, [tabParam]);

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <PanelNavbar
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings" },
        ]}
      />
      <div className="flex flex-col gap-8 p-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-[#0f172a]">Settings</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-lg border-blue-100 bg-blue-50/50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100/50 hover:text-blue-700"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
              <Play className="fill-current" size={10} />
            </div>
            Watch Video Tutorial
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList
            variant="line"
            className="h-auto w-1/3 justify-start gap-8 border-b-0 px-0"
          >
            <TabsTrigger
              value="general"
              className="px-0 pb-4 text-base font-medium data-[state=active]:text-blue-600 data-[state=active]:after:bg-blue-600"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="user-data"
              className="px-0 pb-4 text-base font-medium data-[state=active]:text-blue-600 data-[state=active]:after:bg-blue-600"
            >
              User Data
            </TabsTrigger>
            <TabsTrigger
              value="chat-modes"
              className="px-0 pb-4 text-base font-medium data-[state=active]:text-blue-600 data-[state=active]:after:bg-blue-600"
            >
              Chat Modes
            </TabsTrigger>
            <TabsTrigger
              value="localization"
              className="px-0 pb-4 text-base font-medium data-[state=active]:text-blue-600 data-[state=active]:after:bg-blue-600"
            >
              Localization
            </TabsTrigger>
            <TabsTrigger
              value="personas"
              className="px-0 pb-4 text-base font-medium data-[state=active]:text-blue-600 data-[state=active]:after:bg-blue-600"
            >
              Personas
            </TabsTrigger>
            <TabsTrigger
              value="instructions"
              className="px-0 pb-4 text-base font-medium data-[state=active]:text-blue-600 data-[state=active]:after:bg-blue-600"
            >
              Instructions
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 w-full">
            <TabsContent value="general">
              <GeneralTab />
            </TabsContent>
            <TabsContent value="user-data">
              <UserDataTab />
            </TabsContent>
            <TabsContent value="chat-modes">
              <ChatModesTab />
            </TabsContent>
            <TabsContent value="localization">
              <LocalizationTab />
            </TabsContent>
            <TabsContent value="personas">
              <PersonasTab />
            </TabsContent>
            <TabsContent value="instructions">
              <InstructionsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default SettingsPage;

"use client";

import React, { useState } from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicTab from "./BasicTab";
import AdvanceTab from "./AdvanceTab";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";

const AppearanceMiddle = () => {
  const { guardNavigation } = useUnsavedChanges();
  const [activeTab, setActiveTab] = useState("basic");

  const handleTabChange = (value) => {
    guardNavigation(() => setActiveTab(value));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="mb-6 flex items-center border-b border-slate-200 pb-4">
              <TabsList className="grid w-full max-w-[350px] grid-cols-2">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advance">Advanced Behavior</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="basic"
              className="mt-0 outline-none data-[state=inactive]:hidden"
              forceMount
            >
              <BasicTab />
            </TabsContent>
            <TabsContent
              value="advance"
              className="mt-0 outline-none data-[state=inactive]:hidden"
              forceMount
            >
              <AdvanceTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AppearanceMiddle;

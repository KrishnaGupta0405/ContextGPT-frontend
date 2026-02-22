"use client";

import React, { useState } from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicTab from "./BasicTab";
import AdvanceTab from "./AdvanceTab";

const AppearanceMiddle = () => {
  return (
    <div className="flex h-full flex-col bg-slate-50/50">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-8">
          <Tabs defaultValue="basic" className="w-full">
            <div className="mb-6 flex items-center border-b border-slate-200 pb-4">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advance">Advanced Behavior</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic" className="mt-0 outline-none">
              <BasicTab />
            </TabsContent>
            <TabsContent value="advance" className="mt-0 outline-none">
              <AdvanceTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AppearanceMiddle;

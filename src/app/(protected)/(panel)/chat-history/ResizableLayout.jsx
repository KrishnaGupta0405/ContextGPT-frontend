"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export function ResizableLayout({ middle, right }) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1 overflow-hidden"
    >
      <ResizablePanel defaultSize="45%" minSize="30%" maxSize="60%">
        <div className="bg-background flex h-full flex-col overflow-hidden">
          {middle}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="60%" minSize="30%" maxSize="70%">
        <div className="bg-background flex h-full flex-col overflow-hidden">
          {right}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

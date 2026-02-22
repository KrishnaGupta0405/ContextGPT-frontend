"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { cn } from "@/lib/utils";

/**
 * PanelNavbar - A slim navigation bar for the panel area.
 * Contains the sidebar trigger and breadcrumbs.
 *
 * @param {Object[]} items - Breadcrumb items { label: string, href?: string }
 * @param {React.ReactNode} children - Optional additional content on the right side
 * @param {string} className - Optional className for the header
 */
export function PanelNavbar({ items = [], children, className }) {
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-10 flex h-12 w-full shrink-0 items-center gap-2 border-b px-4",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:bg-accent hover:text-accent-foreground -ml-1 h-8 w-8" />
        <Separator orientation="vertical" className="mx-1 h-4" />
        <CustomBreadcrumb items={items} className="text-[13px]" />
      </div>

      {/* Slot for additional content (buttons, actions, etc.) */}
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
}

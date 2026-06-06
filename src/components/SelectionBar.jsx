"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCw, Trash2 } from "lucide-react";

const SelectionBar = ({
  selectedCount,
  onResync,
  onDelete,
  onClearSelection,
  loading,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="animate-in slide-in-from-bottom-2 fade-in fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-white p-2 shadow-lg duration-300">
      <div className="mr-2 flex items-center gap-2 border-r px-2 pr-4">
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
          {selectedCount}
        </span>
        <span className="hidden text-sm font-medium sm:inline-block">
          selected
        </span>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onResync}
            disabled={loading}
            className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <RefreshCw className="mr-1.5 h-4 w-4" />
            Resync {selectedCount} {selectedCount === 1 ? "entry" : "entries"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Resync selected entries</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={loading}
            className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Delete {selectedCount} {selectedCount === 1 ? "entry" : "entries"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete selected entries</TooltipContent>
      </Tooltip>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="ml-1 h-8 text-slate-400 hover:text-slate-600"
      >
        Clear selection
      </Button>
    </div>
  );
};

export default SelectionBar;

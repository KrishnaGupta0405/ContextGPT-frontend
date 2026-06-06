"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, X, Star, Trash2, Archive, ArchiveRestore } from "lucide-react";

const BottomBar = ({
  selectedCount,
  onResolve,
  onUnresolve,
  onImportant,
  onUnimportant,
  onArchive,
  onUnarchive,
  onDelete,
  onClearSelection,
  updating,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-background animate-in slide-in-from-bottom-2 fade-in absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border p-2 shadow-lg duration-300">
      <div className="mr-2 flex items-center gap-2 border-r px-2 pr-4">
        <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-bold">
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
            onClick={onResolve}
            disabled={updating}
            className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            Mark as Resolved
          </Button>
        </TooltipTrigger>
        <TooltipContent>Resolve selected threads</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onUnresolve}
            disabled={updating}
            className="h-8"
          >
            <X className="mr-1.5 h-4 w-4" />
            Mark as Unresolved
          </Button>
        </TooltipTrigger>
        <TooltipContent>Re-open selected threads</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onImportant}
            disabled={updating}
            className="h-8 border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
          >
            <Star className="mr-1.5 h-4 w-4" />
            Mark as Important
          </Button>
        </TooltipTrigger>
        <TooltipContent>Flag selected as important</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onUnimportant}
            disabled={updating}
            className="h-8"
          >
            <Star className="text-muted-foreground mr-1.5 h-4 w-4 fill-none" />
            Remove Mark
          </Button>
        </TooltipTrigger>
        <TooltipContent>Remove important flag</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onArchive}
            disabled={updating}
            className="h-8 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700"
          >
            <Archive className="mr-1.5 h-4 w-4" />
            Archive
          </Button>
        </TooltipTrigger>
        <TooltipContent>Archive selected threads</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onUnarchive}
            disabled={updating}
            className="h-8"
          >
            <ArchiveRestore className="mr-1.5 h-4 w-4" />
            Unarchive
          </Button>
        </TooltipTrigger>
        <TooltipContent>Unarchive selected threads</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            // disabled={updating}
            disabled={true}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 hover:[cursor:not-allowed]"
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Delete
          </Button>
        </TooltipTrigger>
        <TooltipContent>Archive/Delete selected</TooltipContent>
      </Tooltip>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="text-muted-foreground ml-1 h-8"
      >
        Clear selection
      </Button>
    </div>
  );
};

export default BottomBar;

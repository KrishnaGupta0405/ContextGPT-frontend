"use client";

import React from "react";
import { MessageSquareDashed } from "lucide-react";

export default function DefaultRightPage() {
  return (
    <div className="bg-muted/20 flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="bg-muted relative flex h-20 w-20 items-center justify-center rounded-full">
        <MessageSquareDashed className="text-muted-foreground h-10 w-10" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-xl font-semibold">No Conversation Selected</h3>
        <p className="text-muted-foreground text-sm">
          Select a conversation from the list to view the chat history, details,
          and manage the discussion.
        </p>
      </div>
    </div>
  );
}

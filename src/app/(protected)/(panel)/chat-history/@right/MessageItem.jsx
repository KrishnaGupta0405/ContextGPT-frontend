"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Pencil, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const MessageItem = ({ message, threadDetails, onEdit }) => {
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === "user" || message.role === "USER";

  let avatarSrc = "";
  if (message.role === "AGENT") {
    avatarSrc = threadDetails?.agentIconSrc;
  } else if (
    message.role === "ASSISTANT" ||
    message.role === "assistant" ||
    message.role === "bot" ||
    message.role === "ai"
  ) {
    avatarSrc = threadDetails?.botIconSrc;
  } else {
    avatarSrc = threadDetails?.userIconSrc;
  }

  // Determine message style based on reaction for non-user messages
  let messageStyle = "bg-blue-500 text-primary-foreground rounded-tr-none"; // Default blue
  if (!isUser) {
    if (message.reaction === "POSITIVE") {
      messageStyle =
        "bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-tr-none";
    } else if (message.reaction === "NEGATIVE") {
      messageStyle =
        "bg-rose-100 text-rose-900 border border-rose-200 rounded-tr-none";
    }
  } else {
    messageStyle = "bg-muted text-foreground rounded-tl-none";
  }

  const createdTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const updatedTime =
    message.updatedAt && message.updatedAt !== message.createdAt
      ? new Date(message.updatedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <div
      className={cn(
        "group/msg flex max-w-[80%] gap-3",
        !isUser ? "flex-row-reverse self-end" : "self-start",
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0 border">
        <AvatarImage src={avatarSrc} />
        {!isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex max-w-full flex-col items-start gap-1">
        <div
          className={cn(
            "group relative rounded-xl px-4 py-2 text-sm shadow-sm",
            messageStyle,
          )}
        >
          <p className="break-words whitespace-pre-wrap">{message.content}</p>

          {/* Footer with actions and time */}
          <div className="mt-2 flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-[10px] opacity-90">
            {/* Actions for AI/Agent */}
            {!isUser &&
              (message.role === "ASSISTANT" ||
                message.role === "assistant" ||
                message.role === "bot" ||
                message.role === "ai" ||
                message.role === "AGENT") && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(message);
                    }}
                    className="flex cursor-pointer items-center gap-1 font-medium transition-colors hover:underline"
                  >
                    <Pencil className="h-3 w-3" />
                    {message.role === "ASSISTANT" ||
                    message.role === "assistant"
                      ? "Incorrect? Modify bot's answer"
                      : "Edit message"}
                  </button>
                  <span>|</span>
                  <span className="text-[10px]">
                    {updatedTime || message.editedBy
                      ? updatedTime || "Edited"
                      : createdTime}
                  </span>
                  {(message.role === "assistant" || message.role === "ai") && (
                    <div className="mt-1 flex w-full justify-end sm:mt-0 sm:w-auto">
                      <span className="mx-1 hidden sm:inline">|</span>
                      <button
                        onClick={() => setShowSources(!showSources)}
                        className="cursor-pointer font-medium transition-colors hover:underline"
                      >
                        Sources
                      </button>
                    </div>
                  )}
                </>
              )}

            {/* Standard footer for User or when no actions */}
            {(isUser ||
              (message.role !== "ASSISTANT" &&
                message.role !== "assistant" &&
                message.role !== "bot" &&
                message.role !== "ai" &&
                message.role !== "AGENT")) && (
              <>
                <span>{createdTime}</span>
                {!isUser && (updatedTime || message.editedBy) && (
                  <span className="flex items-center gap-1 italic">
                    <span>(edited)</span>
                    {updatedTime && <span>{updatedTime}</span>}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Source Badges */}
          {showSources &&
            (message.role === "assistant" || message.role === "ai") && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-2">
                {(message.source || message.sources) &&
                (message.source || message.sources).length > 0 ? (
                  (message.source || message.sources).map((src, index) => {
                    const url =
                      src.metadata?.sourceUrl ||
                      src.sourceUrl ||
                      src.metadata?.sourceURL ||
                      src.sourceURL ||
                      "#";
                    return (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer"
                      >
                        <Badge
                          variant="secondary"
                          className="border-none bg-white/10 px-2 py-0.5 text-[10px] font-normal text-current hover:bg-white/20"
                        >
                          {url !== "#" ? url : "Source"}
                        </Badge>
                      </a>
                    );
                  })
                ) : (
                  <Badge
                    variant="outline"
                    className="border-white/20 text-[10px] font-normal text-current opacity-70"
                  >
                    No sources available
                  </Badge>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ROLES, ROLE_LEVEL } from "./roles";

export const AccountMembers = () => {
  const { account, user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const accountId = account?.id;
      if (!accountId) return;

      const response = await api.get(
        `/teams/account/${accountId}/members/get-all-members`,
      );
      if (response.data.success) {
        setMembers(response.data.data.members || []);
      }
    } catch (error) {
      console.error("Failed to fetch account members:", error);
      toast.error("Failed to fetch account members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [account]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setProcessingId(userId);
      const accountId = account?.id;
      if (!accountId) return;

      const response = await api.patch(
        `/teams/account/${accountId}/members/update-role`,
        {
          userId: userId,
          role: newRole,
        },
      );

      if (response.data.success) {
        toast.success("Role updated successfully");
        setMembers((prev) =>
          prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m)),
        );
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update member role.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveMember = async (userId) => {
    const accountId = account?.id;
    if (!accountId) return;

    const isSelf = userId === user?.id;
    const confirmPrompt = isSelf
      ? "Are you sure you want to leave this account?"
      : "Are you sure you want to remove this member?";

    if (!window.confirm(confirmPrompt)) return;

    try {
      setProcessingId(userId);
      const response = await api.delete(
        `/teams/account/${accountId}/members/remove-member`,
        {
          data: {
            userId: userId,
          },
        },
      );

      if (response.data.success) {
        toast.success(
          isSelf ? "Successfully left the account" : "Member removed",
        );
        setMembers((prev) => prev.filter((m) => m.id !== userId));

        if (isSelf) {
          window.location.href = "/select-account";
        }
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member.");
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const currentUserMember = members.find((m) => m.id === user?.id);
  const currentUserRole = currentUserMember?.role;
  const currentUserLevel = ROLE_LEVEL[currentUserRole] ?? -1;

  return (
    <>
      <div className="mt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-gray-50 py-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {members.map((member) => {
              const isCurrentUser = member.id === user?.id;
              const isProcessing = processingId === member.id;

              return (
                <div
                  className="flex items-center justify-between border-b border-gray-100 py-4 last:border-0"
                  key={member.id}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      {member.avatar && <AvatarImage src={member.avatar} />}
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        {member.name}{" "}
                        {isCurrentUser && (
                          <span className="font-normal text-gray-500">
                            (You)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isProcessing ? (
                      <Loader2 className="mr-8 h-5 w-5 animate-spin text-gray-400" />
                    ) : (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 min-w-[110px] border-gray-200 bg-white font-normal text-gray-600 shadow-sm hover:bg-gray-50"
                            >
                              {ROLES.find((r) => r.value === member.role)
                                ?.label || member.role}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-[300px] p-2"
                            align="end"
                          >
                            {ROLES.map((role) => {
                              const isDisabled =
                                ROLE_LEVEL[role.value] > currentUserLevel;
                              return (
                                <DropdownMenuItem
                                  key={role.value}
                                  disabled={isDisabled}
                                  onClick={() => {
                                    if (!isDisabled)
                                      handleUpdateRole(member.id, role.value);
                                  }}
                                  className={`mb-1 rounded-md p-2 last:mb-0 ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${member.role === role.value ? "bg-blue-50" : ""}`}
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <div
                                      className={`font-semibold sm:text-sm ${isDisabled ? "text-gray-400" : "text-blue-600"}`}
                                    >
                                      {role.label}
                                    </div>
                                    <div className="text-muted-foreground text-xs leading-relaxed whitespace-normal">
                                      {role.description}
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className={`ml-2 px-2 text-sm font-medium transition-colors hover:underline ${isCurrentUser ? "text-red-500 hover:text-red-700" : "text-gray-500 hover:text-red-600"}`}
                        >
                          {isCurrentUser ? "Leave" : "Remove"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

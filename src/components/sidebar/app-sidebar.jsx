"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Code,
  MessageSquare,
  BookUser,
  MessageSquareText,
  Type,
  Link2,
  FileText,
  History,
  HelpCircle,
  Reply,
  Sparkles,
  UserCircle,
  Globe,
  Palette,
  Headset,
  Users,
  Plug,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { NavUser } from "./nav-user";
import { useChatbot } from "@/context/ChatbotContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      // items: [
      //   { title: "Stats Overview", url: "/dashboard/stats" },
      //   { title: "Recent Activity", url: "/dashboard/activity" },
      // ],
    },
    {
      title: "Installation",
      url: "/installation",
      icon: Briefcase,
      items: [
        {
          title: "Website integration",
          url: "/installation/website-integration",
        },
        { title: "SDK Advanced", url: "/installation/sdk-advanced" },
      ],
    },
    // { title: "SDK (Advanced)", url: "/sdk", icon: Code, badge: "New" },
    { title: "Chat History", url: "/chat-history", icon: MessageSquare },
    { title: "Leads", url: "/leads", icon: BookUser },
  ],
  knowledgeBase: [
    {
      title: "Custom Responses",
      url: "/custom-responses",
      icon: MessageSquareText,
    },
    { title: "Text Snippets", url: "/text-snippets", icon: Type },
    { title: "Website Links", url: "/website-links", icon: Link2 },
    { title: "Files & Data Sources", url: "/website-files", icon: FileText },
    { title: "Auto Sync Jobs", url: "/auto-sync", icon: History, badge: "New" },
  ],
  customizations: [
    {
      title: "Conversation Starters",
      url: "/conversation-starters",
      icon: HelpCircle,
    },
    {
      title: "Conversation Followups",
      url: "/conversation-followups",
      icon: Reply,
    },
    {
      title: "Chatbot Instructions",
      url: "/settings?tab=instructions",
      icon: Sparkles,
    },
    {
      title: "Chatbot Persona",
      url: "/settings?tab=personas",
      icon: UserCircle,
    },
    {
      title: "Language & Region",
      url: "/settings?tab=localization",
      icon: Globe,
    },
    { title: "Appearance", url: "/appearance", icon: Palette },
    { title: "Human Support", url: "/leads?tab=human-settings", icon: Headset },
  ],
  advanced: [
    { title: "Members", url: "/members", icon: Users },
    { title: "Integrations", url: "/integrations", icon: Plug },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
};

export function AppSidebar() {
  const { user } = useAuth();
  const { selectedChatbot } = useChatbot();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-14">
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-muted-foreground w-full max-w-[150px] truncate text-xs">
                      {user?.email || "user@example.com"}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white uppercase">
                        {selectedChatbot?.name?.substring(0, 2) || "CH"}
                      </div>
                      <span className="max-w-[120px] truncate text-sm font-semibold">
                        {selectedChatbot?.name || "Select Chatbot"}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="text-muted-foreground ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  My Chatbots
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => router.push("/select-chatbot")}
                >
                  <div className="bg-background flex h-6 w-6 items-center justify-center rounded border">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  Switch Chatbot
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="bg-background flex h-6 w-6 items-center justify-center rounded border">
                    <Plus className="h-4 w-4" />
                  </div>
                  Create Chatbot
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Knowledge Base */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 text-[11px] font-bold tracking-wider uppercase">
            Knowledge Base
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.knowledgeBase.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Customizations */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 text-[11px] font-bold tracking-wider uppercase">
            Customizations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.customizations.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Advanced */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 text-[11px] font-bold tracking-wider uppercase">
            Advanced
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.advanced.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "User Name",
            email: user?.email || "user@example.com",
            avatar: user?.avatar || "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavItem({ item }) {
  const pathname = usePathname();
  const hasItems = item.items && item.items.length > 0;

  // Check if current page is this item or one of its sub-items
  const isActive =
    pathname === item.url || item.items?.some((sub) => sub.url === pathname);

  if (!hasItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={pathname === item.url}
        >
          <Link href={item.url} className="flex items-center gap-2">
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
        {item.badge && (
          <SidebarMenuBadge className="bg-emerald-100 text-[10px] font-bold text-emerald-700">
            {item.badge}
          </SidebarMenuBadge>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        defaultOpen={isActive}
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
            <ChevronRight className="transition-transform" />
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuItem key={subItem.title}>
                <SidebarMenuButton asChild isActive={pathname === subItem.url}>
                  <Link href={subItem.url} className="pl-4">
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}

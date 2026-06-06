"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Rss,
  FileText,
  Clock,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  TOOL_CATEGORIES,
  getToolsByCategory,
} from "@/app/(not-protected)/tools/_config/tools.config";

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

// Compact tool links shown in the navbar dropdown (first 4 per category)
const NAV_TOOLS = TOOL_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = getToolsByCategory(cat).slice(0, 4);
  return acc;
}, {});

export default function NavigationMenuDemo() {
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar if scrolling up or at the very top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 10) {
        // Hide navbar if scrolling down and past the top
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  return (
    <div
      className={cn(
        "bg-background/80 border-border top-0 right-0 left-0 z-50 border-b shadow-sm backdrop-blur-md transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/icons/Contextgpt_icon.png"
              alt="ContextGPT"
              className="-mt-2 h-10 w-full"
            />
            <span
              className="text-2xl tracking-tight"
              style={{ fontWeight: 650 }}
            >
              Context
              <span className="text-blue-600" style={{ fontWeight: 650 }}>
                GPT
              </span>
            </span>
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/lead-generation" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Lead Generation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/features" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Features
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/integration" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Integrations
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* Resources dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[580px] p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Left: Quick Links */}
                    <div>
                      <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-blue-600 uppercase">
                        Quick Links
                      </p>
                      <ul>
                        {[
                          {
                            href: "/blog",
                            icon: <Rss className="h-4 w-4" />,
                            title: "Blog",
                            description: "Product updates, tips, and insights",
                          },
                          {
                            href: "/docs",
                            icon: <FileText className="h-4 w-4" />,
                            title: "Docs",
                            description:
                              "API documentation and developer guides",
                          },
                          {
                            href: "/aboutus",
                            icon: <BookOpen className="h-4 w-4" />,
                            title: "About Us",
                            description: "Learn about our mission and team",
                          },
                          {
                            href: "/changelog",
                            icon: <Clock className="h-4 w-4" />,
                            title: "Changelog",
                            description:
                              "Stay up to date with the latest updates",
                          },
                        ].map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="hover:bg-accent hover:text-accent-foreground flex items-start gap-3 rounded-md px-3 py-2 no-underline transition-colors outline-none select-none"
                              >
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-white text-base shadow-sm">
                                  {item.icon}
                                </span>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm leading-none font-medium">
                                    {item.title}
                                  </span>
                                  <span className="text-muted-foreground line-clamp-1 text-xs leading-snug">
                                    {item.description}
                                  </span>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: Featured card */}
                    <div className="flex flex-col gap-2">
                      <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-blue-600 uppercase">
                        What&apos;s New
                      </p>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/features"
                          className="group flex flex-col overflow-hidden rounded-xl border no-underline shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex items-center justify-center gap-3 bg-linear-to-br from-blue-500 to-blue-700 px-4 py-6">
                            <Zap className="h-8 w-8 text-white opacity-90" />
                            <span className="text-lg font-bold text-white">
                              ContextGPT
                            </span>
                          </div>
                          <div className="bg-background px-4 py-3">
                            <p className="text-sm font-semibold">
                              AI-Powered Context Engine
                            </p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              Connect your data sources and chat instantly
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Tools mega-dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Free Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[700px] p-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {TOOL_CATEGORIES.map((cat) => (
                      <div key={cat}>
                        <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-blue-600 uppercase">
                          {cat}
                        </p>
                        <ul>
                          {NAV_TOOLS[cat].map((tool) => (
                            <li key={tool.slug}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/tools/${tool.slug}`}
                                  className="hover:bg-accent hover:text-accent-foreground flex items-start gap-3 rounded-md px-3 py-2 no-underline transition-colors outline-none select-none"
                                >
                                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-white text-base shadow-sm">
                                    {tool.icon}
                                  </span>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-sm leading-none font-medium">
                                      {tool.title}
                                    </span>
                                    <span className="text-muted-foreground line-clamp-1 text-xs leading-snug">
                                      {tool.description}
                                    </span>
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Footer link */}
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/tools"
                        className="flex items-center gap-1.5 px-3 text-xs font-semibold text-blue-600 no-underline hover:underline"
                      >
                        View all free tools →
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="hover:bg-accent hover:text-accent-foreground text-muted-foreground flex items-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition-all"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-primary-foreground rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition-all hover:opacity-90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex flex-col gap-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

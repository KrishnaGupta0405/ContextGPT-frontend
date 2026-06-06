"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",

        // Success – soft green
        "--success-bg": "#ecfdf5",
        "--success-text": "#065f46",
        "--success-border": "#a7f3d0",

        // Info – soft blue
        "--info-bg": "#eff6ff",
        "--info-text": "#1e40af",
        "--info-border": "#bfdbfe",

        // Warning – soft amber
        "--warning-bg": "#fffbeb",
        "--warning-text": "#92400e",
        "--warning-border": "#fde68a",

        // Error – soft red
        "--error-bg": "#fef2f2",
        "--error-text": "#991b1b",
        "--error-border": "#fecaca",
      }}
      closeButton={true}
      {...props}
    />
  );
};

export { Toaster };

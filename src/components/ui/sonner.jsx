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

        // Emerald green success (matches Tailwind emerald-500 vibe)
        "--success-bg": "oklch(0.696 0.149 162.5)",
        "--success-text": "oklch(0.25 0.06 162)",
        "--success-border": "oklch(0.60 0.13 162)",

        // Info – blue-ish
        "--info-bg": "oklch(0.95 0.04 240)",
        "--info-text": "oklch(0.30 0.08 240)",
        "--info-border": "oklch(0.85 0.06 240)",

        // Warning – amber/orange
        "--warning-bg": "oklch(0.95 0.08 80)",
        "--warning-text": "oklch(0.35 0.10 80)",
        "--warning-border": "oklch(0.88 0.07 80)",

        // Error – red
        "--error-bg": "oklch(0.95 0.06 25)",
        "--error-text": "oklch(0.30 0.09 25)",
        "--error-border": "oklch(0.85 0.05 25)",
      }}
      closeButton={true}
      {...props}
    />
  );
};

export { Toaster };

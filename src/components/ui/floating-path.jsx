"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Pre-computed duration offsets avoid Math.random() in render (SSR hydration mismatch)
const DURATION_OFFSETS = [0, 3.7, 7.1, 1.9, 5.3, 8.4, 2.6, 4.8, 6.2];

export function FloatingPathsBackground({
  children,
  className,
  position = 1,
  pathCount = 6,
  baseOpacity = 0.02,
  opacityStep = 0.04,
  baseWidth = 0.4,
  widthStep = 0.04,
  animationDuration = 40,
  color,
  // Controls how far apart paths spread horizontally. Higher = less clustered.
  hSpread = 4,
  // Controls how far apart paths spread vertically. Higher = more diagonal fan.
  vSpread = 10,
}) {
  const paths = useMemo(
    () =>
      Array.from({ length: pathCount }, (_, i) => ({
        id: i,

        // SVG cubic bezier: M (start) → C (two control points) → end point → C → end point
        // The path is a long S-curve that flows across and off the canvas.
        //
        // Each path is offset from the previous one by:
        //   hSpread * position  — shifts the entire curve left horizontally per step
        //   vSpread             — tilts the curve up/down per step
        //
        // Breakdown of key numbers:
        //   -380  → start X, off the left edge of the viewBox (696 wide)
        //   -189  → start Y, above the top edge of the viewBox (316 tall)
        //    152  → mid-curve X anchor (roughly left-centre of canvas)
        //    343  → mid-curve Y anchor (roughly just past bottom of canvas)
        //    616  → second control point X (right side of canvas)
        //    684  → end X (off the right edge)
        //    875  → end Y (well below the canvas — curve exits bottom-right)
        d: `M-${380 - i * hSpread * position} -${189 + i * vSpread}C-${
          380 - i * hSpread * position
        } -${189 + i * vSpread} -${312 - i * hSpread * position} ${216 - i * vSpread} ${
          152 - i * hSpread * position
        } ${343 - i * vSpread}C${616 - i * hSpread * position} ${470 - i * vSpread} ${
          684 - i * hSpread * position
        } ${875 - i * vSpread} ${684 - i * hSpread * position} ${875 - i * vSpread}`,

        // Each successive path is slightly thicker than the last.
        width: baseWidth + i * widthStep,

        // Each successive path is slightly more opaque than the last.
        opacity: baseOpacity + i * opacityStep,

        // SPEED lives here. duration = total seconds to complete one pathOffset cycle [0 → 1 → 0].
        // Longer duration = slower movement. Speed ≈ 1 / duration.
        // DURATION_OFFSETS staggers each path so they don't all move in sync.
        // To make everything faster: lower animationDuration (e.g. 10).
        // To make everything slower: raise it (e.g. 40).
        duration:
          animationDuration +
          (DURATION_OFFSETS[i % DURATION_OFFSETS.length] ?? 0),
      })),
    [
      pathCount,
      position,
      baseOpacity,
      opacityStep,
      baseWidth,
      widthStep,
      animationDuration,
      hSpread,
      vSpread,
    ],
  );

  return (
    <div className={cn("relative w-full", className)}>
      <div className="pointer-events-none absolute inset-0">
        <svg
          className={cn(
            "h-full w-full",
            color ? "" : "text-slate-950 dark:text-white",
          )}
          style={color ? { color } : undefined}
          viewBox="0 0 696 316"
          fill="none"
          aria-hidden="true"
        >
          {paths.map((path) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={path.opacity}
              initial={{ pathLength: 0.3, opacity: 0.6 }}
              animate={{
                pathLength: 1,
                opacity: [0.3, 0.6, 0.3],
                pathOffset: [0, 1, 0],
              }}
              transition={{
                duration: path.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </svg>
      </div>
      {children}
    </div>
  );
}

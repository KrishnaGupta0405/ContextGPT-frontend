"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animate } from "framer-motion";

export function useScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Instant reset to top on navigation to prevent layout jitter
    window.scrollTo(0, 0);

    const savedPosition = sessionStorage.getItem(`scrollPos:${pathname}`);

    if (savedPosition) {
      const targetY = parseInt(savedPosition, 10);

      // 2. High-performance "Sleek" Animation
      // Using a Quintic Out curve [0.23, 1, 0.32, 1] for a premium feel
      const controls = animate(window.scrollY, targetY, {
        type: "tween",
        ease: [0.23, 1, 0.32, 1],
        duration: 0.8,
        onUpdate: (latest) => window.scrollTo(0, latest),
      });

      return () => controls.stop();
    }
  }, [pathname]);

  useEffect(() => {
    // 3. Optimized Scroll Tracking
    let timeoutId;

    const handleScroll = () => {
      // Debounce the save to prevent main-thread lag during scrolling
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sessionStorage.setItem(
          `scrollPos:${pathname}`,
          window.scrollY.toString(),
        );
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname]);
}

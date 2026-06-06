"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function FeaturebaseWidget() {
  const { user } = useAuth();
  const initRef = useRef(false);

  // Initialize the SDK and the widgets exactly once
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Load Featurebase SDK
    (function (w, d) {
      const a = "featurebase-sdk";
      function n() {
        if (!d.getElementById(a)) {
          const e = d.createElement("script");
          e.id = a;
          e.src = "https://do.featurebase.app/js/sdk.js";
          d.getElementsByTagName("script")[0].parentNode.insertBefore(
            e,
            d.getElementsByTagName("script")[0],
          );
        }
      }
      if (typeof w.Featurebase !== "function") {
        w.Featurebase = function () {
          (w.Featurebase.q = w.Featurebase.q || []).push(arguments);
        };
      }
      if (d.readyState === "complete" || d.readyState === "interactive") {
        n();
      } else {
        d.addEventListener("DOMContentLoaded", n);
      }
    })(window, document);

    // Feedback widget — floating button on the right
    window.Featurebase("initialize_feedback_widget", {
      organization: "contextgpt0405",
      theme: "light",
      placement: "right",
    });
  }, []);

  // Update user identity whenever the user object is available/changes
  useEffect(() => {
    if (user?.email) {
      window.Featurebase("identify", {
        organization: "contextgpt0405",
        email: user.email,
        ...(user.name && { name: user.name }),
        // Using either user.id or user._id if available for more robust tracking
        ...(user.id && { userId: user.id }),
        ...(user._id && !user.id && { userId: user._id }),
      });
    }
  }, [user]);

  return null;
}

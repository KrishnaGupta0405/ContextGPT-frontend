"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getOtherTools } from "../_config/tools.config";

export default function OtherTools({ currentSlug }) {
  const scrollRef = useRef(null);
  const tools = getOtherTools(currentSlug, 12);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="bg-[#f0f4ff] pb-20 pt-4">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-blue-600">
          Other Tools
        </p>
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Try our other free tools!
        </h2>

        {/* Scrollable row */}
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tools.map((tool) => (
              <div
                key={tool.slug}
                className="flex w-60 flex-none flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                {/* Icon */}
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${tool.iconBg}`}
                >
                  {typeof tool.icon === "string" && tool.icon.length <= 2 ? (
                    <span>{tool.icon}</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-600">
                      {tool.icon}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mb-1 text-sm font-semibold leading-snug text-gray-900">
                  {tool.title}
                </h3>

                {/* Description */}
                <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-500 line-clamp-3">
                  {tool.description}
                </p>

                <Link
                  href={`/tools/${tool.slug}`}
                  className="mt-auto inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Try tool
                </Link>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Nav dots (decorative) */}
        <div className="mt-6 flex justify-center gap-1">
          <button className="h-2 w-6 rounded-full bg-gray-400" />
          <button className="h-2 w-2 rounded-full bg-gray-200" />
          <button className="h-2 w-2 rounded-full bg-gray-200" />
        </div>
      </div>
    </section>
  );
}

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export default function FAQAccordion({ items }) {
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
      <FAQColumn items={left} startIndex={0} />
      <FAQColumn items={right} startIndex={mid} />
    </div>
  );
}

function FAQColumn({ items, startIndex }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={startIndex + i} value={`item-${startIndex + i}`}>
          <AccordionTrigger className="flex items-start gap-3 py-4 text-left text-sm font-medium text-gray-900 hover:no-underline dark:text-white [&>svg]:shrink-0">
            <span className="flex-1">{item.question}</span>
            <div
              onClick={(e) => e.stopPropagation()}
              className="ml-2 flex shrink-0 items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Ask
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-sm text-gray-500 dark:text-gray-400">
            {item.parts ? (
              <div>
                {item.parts.map((part, idx) =>
                  typeof part === "string" ? (
                    <span key={idx} dangerouslySetInnerHTML={{ __html: part }} />
                  ) : (
                    <Link
                      key={idx}
                      href={part.href}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {part.label}
                    </Link>
                  )
                )}
              </div>
            ) : (
              <>
                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                {item.link && (
                  <Link
                    href={item.link.href}
                    className="ml-1 text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {item.link.label}
                  </Link>
                )}
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

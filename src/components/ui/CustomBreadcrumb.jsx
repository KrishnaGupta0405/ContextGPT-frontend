"use client";

import * as React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/lib/routes";

/**
 * CustomBreadcrumb Component
 * @param {Object[]} items - Array of breadcrumb items { label: string, href?: string }
 * @param {string} className - Optional className for the nav element
 */
export function CustomBreadcrumb({ items = [], className }) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const href = item.href || ROUTES[item.label];

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {!isLast && href ? (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

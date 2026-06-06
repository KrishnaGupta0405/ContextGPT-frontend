import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?.title}
          className={cn(
            "relative group block p-2 h-full w-full",
            item.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          )}
          onMouseEnter={() => !item.disabled && setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={item.disabled ? undefined : item?.onClick}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-slate-100 dark:bg-slate-800/[0.8] block rounded-2xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          {item.tooltip ? (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Card>
                      <div className="flex items-center gap-3">
                        {item.icon && <span>{item.icon}</span>}
                        <CardTitle>{item.title}</CardTitle>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </Card>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs">
                  {item.tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Card>
              <div className="flex items-center gap-3">
                {item.icon && <span>{item.icon}</span>}
                <CardTitle>{item.title}</CardTitle>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {item.badge}
                  </span>
                )}
              </div>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-xl h-full w-full p-4 overflow-hidden bg-white border border-slate-200 shadow-sm group-hover:border-slate-300 group-hover:shadow-md relative z-20 transition-shadow",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-slate-800 font-bold tracking-wide mt-0", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        "mt-2 text-slate-500 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

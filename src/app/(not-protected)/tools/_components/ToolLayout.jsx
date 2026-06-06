import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";

export default function ToolLayout({ tool, children }) {
  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex justify-center">
          <CustomBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: tool.title },
            ]}
          />
        </div>

        {/* Category badge */}
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-blue-600">
          {tool.category}
        </p>

        {/* Title */}
        <h1 className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900">
          {tool.title}
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mx-auto mb-10 max-w-xl text-center text-base leading-relaxed">
          {tool.description}
        </p>

        {/* Tool UI card */}
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

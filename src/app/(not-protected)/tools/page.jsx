import Link from "next/link";
import { ALL_TOOLS, TOOL_CATEGORIES, getToolsByCategory } from "./_config/tools.config";

export const metadata = {
  title: "Free AI Tools — ContextGPT",
  description:
    "Free AI tools for converting documents to Markdown, generating content with AI, analyzing chatbot conversations, and more.",
};

const CATEGORY_DESCRIPTIONS = {
  "Convert to Markdown":
    "Convert any document, file, or URL to clean Markdown instantly.",
  "AI Chat Tools":
    "Upload or paste your data and chat with AI to get instant answers.",
  "AI Generators": "Generate professional content in seconds with AI.",
  "Other Tools":
    "Sitemap tools, ROI calculators, email signatures, and more.",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      {/* Hero */}
      <div className="border-b border-blue-100 bg-white px-4 py-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
          Free Tools
        </p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          All Free Tools
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed">
          {ALL_TOOLS.length} free tools to help you convert documents, generate AI content,
          analyze chatbots, and manage your website. No sign up required.
        </p>
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16">
        {TOOL_CATEGORIES.map((category) => {
          const tools = getToolsByCategory(category);
          return (
            <section key={category}>
              {/* Category header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {CATEGORY_DESCRIPTIONS[category]}
                </p>
              </div>

              {/* Tool cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Icon */}
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${tool.iconBg}`}
                    >
                      {tool.icon}
                    </div>

                    {/* Title */}
                    <h3 className="mb-1.5 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-600">
                      {tool.title}
                    </h3>

                    {/* Description */}
                    <p className="flex-1 text-xs leading-relaxed text-gray-500 line-clamp-3">
                      {tool.description}
                    </p>

                    {/* CTA */}
                    <span className="mt-4 text-xs font-semibold text-blue-600 group-hover:underline">
                      Try tool →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

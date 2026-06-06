import { notFound } from "next/navigation";
import { ALL_TOOLS, TOOL_TYPES, getToolBySlug } from "../_config/tools.config";
import ToolLayout from "../_components/ToolLayout";
import OtherTools from "../_components/OtherTools";
import ToolWithUsage from "../_components/ToolWithUsage";
import FileToMarkdownTool from "../convert-to-markdown/_components/FileToMarkdownTool";
import UrlToMarkdownTool from "../convert-to-markdown/_components/UrlToMarkdownTool";
import ClientSideConverterTool from "../convert-to-markdown/_components/ClientSideConverterTool";
import AiGeneratorTool from "../ai-generators/_components/AiGeneratorTool";
import AiChatTool from "../ai-chat-tools/_components/AiChatTool";
import SitemapTool from "../other-tools/_components/SitemapTool";
import RoiCalculatorTool from "../other-tools/_components/RoiCalculatorTool";
import EmailSignatureTool from "../other-tools/_components/EmailSignatureTool";

export async function generateStaticParams() {
  return ALL_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: `${tool.title} — ContextGPT`,
    description: tool.description,
  };
}

// Tools that are client-side only and don't hit the backend
const CLIENT_ONLY_TYPES = [
  TOOL_TYPES.CLIENT_CONVERTER,
  TOOL_TYPES.ROI_CALCULATOR,
  TOOL_TYPES.EMAIL_SIGNATURE,
];

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const isClientOnly = CLIENT_ONLY_TYPES.includes(tool.toolType);

  const ToolComponent = () => {
    switch (tool.toolType) {
      case TOOL_TYPES.FILE_TO_MARKDOWN:
        return <FileToMarkdownTool tool={tool} />;
      case TOOL_TYPES.URL_TO_MARKDOWN:
        return <UrlToMarkdownTool tool={tool} />;
      case TOOL_TYPES.CLIENT_CONVERTER:
        return <ClientSideConverterTool tool={tool} />;
      case TOOL_TYPES.AI_GENERATOR:
        return <AiGeneratorTool tool={tool} />;
      case TOOL_TYPES.AI_CHAT:
        return <AiChatTool tool={tool} />;
      case TOOL_TYPES.SITEMAP:
        return <SitemapTool tool={tool} />;
      case TOOL_TYPES.ROI_CALCULATOR:
        return <RoiCalculatorTool />;
      case TOOL_TYPES.EMAIL_SIGNATURE:
        return <EmailSignatureTool />;
      default:
        return <p className="text-sm text-gray-400">Coming soon.</p>;
    }
  };

  return (
    <>
      <ToolLayout tool={tool}>
        {isClientOnly ? (
          <ToolComponent />
        ) : (
          <ToolWithUsage>
            <ToolComponent />
          </ToolWithUsage>
        )}
      </ToolLayout>
      <OtherTools currentSlug={slug} />
    </>
  );
}

import ToolLayout from "../../_components/ToolLayout";
import OtherTools from "../../_components/OtherTools";
import AiChatTool from "../_components/AiChatTool";

const TOOL = {
  slug: "ai-chat-website-data",
  title: "AI Chat with Your Website Data",
  category: "AI Chat Tools",
  description:
    "Enter a public website URL and instantly chat with AI about its content. Great for research, competitive analysis, and content extraction. Free to use.",
  toolType: "ai-chat",
  chatMode: "website",
  apiEndpoint: "tools/chat/website",
  icon: "🌐",
  bgColor: "bg-indigo-50",
  iconBg: "bg-indigo-100",
};

export const metadata = {
  title: "AI Chat with Your Website Data — ContextGPT",
  description: TOOL.description,
};

export default function AiChatWebsiteDataPage() {
  return (
    <>
      <ToolLayout tool={TOOL}>
        <AiChatTool tool={TOOL} />
      </ToolLayout>
      <OtherTools currentSlug={TOOL.slug} />
    </>
  );
}

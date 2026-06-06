import ToolLayout from "../../_components/ToolLayout";
import OtherTools from "../../_components/OtherTools";
import AiChatTool from "../_components/AiChatTool";

const TOOL = {
  slug: "ai-chat-text-data",
  title: "AI Chat with Your Text Data",
  category: "AI Chat Tools",
  description:
    "Paste any text — articles, reports, notes — and ask AI questions about it. Get instant answers from your own content. No training required. Free to use.",
  toolType: "ai-chat",
  chatMode: "text",
  apiEndpoint: "tools/chat/text",
  icon: "💬",
  bgColor: "bg-blue-50",
  iconBg: "bg-blue-100",
};

export const metadata = {
  title: "AI Chat with Your Text Data — ContextGPT",
  description: TOOL.description,
};

export default function AiChatTextDataPage() {
  return (
    <>
      <ToolLayout tool={TOOL}>
        <AiChatTool tool={TOOL} />
      </ToolLayout>
      <OtherTools currentSlug={TOOL.slug} />
    </>
  );
}

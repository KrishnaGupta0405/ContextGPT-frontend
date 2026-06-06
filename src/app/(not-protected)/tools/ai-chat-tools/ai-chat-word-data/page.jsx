import ToolLayout from "../../_components/ToolLayout";
import OtherTools from "../../_components/OtherTools";
import AiChatTool from "../_components/AiChatTool";

const TOOL = {
  slug: "ai-chat-word-data",
  title: "AI Chat with Your Word Document & Data",
  category: "AI Chat Tools",
  description:
    "Upload a Word document (.docx) and chat with AI about its content. Extract key information and insights instantly. Free to use.",
  toolType: "ai-chat",
  chatMode: "word",
  apiEndpoint: "tools/chat/word",
  acceptedFileTypes: ".docx,.doc",
  maxFileSizeMB: 10,
  fileHint: ".docx / .doc supported, up to 10 MB.",
  icon: "📝",
  bgColor: "bg-sky-50",
  iconBg: "bg-sky-100",
};

export const metadata = {
  title: "AI Chat with Your Word Document & Data — ContextGPT",
  description: TOOL.description,
};

export default function AiChatWordDataPage() {
  return (
    <>
      <ToolLayout tool={TOOL}>
        <AiChatTool tool={TOOL} />
      </ToolLayout>
      <OtherTools currentSlug={TOOL.slug} />
    </>
  );
}

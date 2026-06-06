import ToolLayout from "../../_components/ToolLayout";
import OtherTools from "../../_components/OtherTools";
import AiChatTool from "../_components/AiChatTool";

const TOOL = {
  slug: "ai-chat-pdf-data",
  title: "AI Chat with Your PDF Document & Data",
  category: "AI Chat Tools",
  description:
    "Upload any PDF and chat with AI about its content. Ask questions, get summaries, and extract information instantly. Free to use. No sign up required.",
  toolType: "ai-chat",
  chatMode: "pdf",
  apiEndpoint: "tools/chat/pdf",
  acceptedFileTypes: ".pdf",
  maxFileSizeMB: 10,
  fileHint: ".pdf format supported, up to 10 MB.",
  icon: "📄",
  bgColor: "bg-red-50",
  iconBg: "bg-red-100",
};

export const metadata = {
  title: "AI Chat with Your PDF Document & Data — ContextGPT",
  description: TOOL.description,
};

export default function AiChatPdfDataPage() {
  return (
    <>
      <ToolLayout tool={TOOL}>
        <AiChatTool tool={TOOL} />
      </ToolLayout>
      <OtherTools currentSlug={TOOL.slug} />
    </>
  );
}

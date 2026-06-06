import ToolLayout from "../../_components/ToolLayout";
import OtherTools from "../../_components/OtherTools";
import AiChatTool from "../_components/AiChatTool";

const TOOL = {
  slug: "ai-chat-document-data",
  title: "AI Chat with Your Document & Data",
  category: "AI Chat Tools",
  description:
    "Upload a document (TXT, MD, CSV) and chat with AI about its content. Get instant answers without reading the entire file. Free to use.",
  toolType: "ai-chat",
  chatMode: "document",
  apiEndpoint: "tools/chat/document",
  acceptedFileTypes: ".txt,.md,.csv",
  maxFileSizeMB: 5,
  fileHint: ".txt, .md, .csv supported, up to 5 MB.",
  icon: "📁",
  bgColor: "bg-violet-50",
  iconBg: "bg-violet-100",
};

export const metadata = {
  title: "AI Chat with Your Document & Data — ContextGPT",
  description: TOOL.description,
};

export default function AiChatDocumentDataPage() {
  return (
    <>
      <ToolLayout tool={TOOL}>
        <AiChatTool tool={TOOL} />
      </ToolLayout>
      <OtherTools currentSlug={TOOL.slug} />
    </>
  );
}

import RecaptchaProvider from "@/components/providers/RecaptchaProvider";

export default function ToolsLayout({ children }) {
  return <RecaptchaProvider>{children}</RecaptchaProvider>;
}

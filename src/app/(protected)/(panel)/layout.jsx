import StandaloneClientWrapper from "./StandaloneClientWrapper";

export const metadata = {
  title: "ContextGPT",
  description: "Convert your website into AI Powered chatbot",
  //   icons: {
  //     icon: "/icon.svg", // path from the public/ folder
  //   },
};

// Layout now uses StandaloneClientWrapper to manage Sidebar and hooks
export default function Layout({ children }) {
  return <StandaloneClientWrapper>{children}</StandaloneClientWrapper>;
}

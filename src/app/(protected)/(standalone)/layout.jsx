import Sidebar from "@/components/sidebar";

export const metadata = {
  title: "ContextGPT",
  description: "Convert your website into AI Powered chatbot",
  //   icons: {
  //     icon: "/icon.svg", // path from the public/ folder
  //   },
};

// Layout now expects `middle` and `right` slots
export default function ({ children }) {
  return (
    <>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Middle Pane */}
        {children}
      </div>
    </>
  );
}

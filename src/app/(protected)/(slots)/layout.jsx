import Sidebar from "@/components/sidebar";

export const metadata = {
  title: "ContextGPT",
  description: "Convert your website into AI Powered chatbot",
  //   icons: {
  //     icon: "/icon.svg", // path from the public/ folder
  //   },
};

// Layout now expects `middle` and `right` slots
export default function ({ middle, right }) {
  return (
    <>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar />
        {/* Middle Pane */}
        <div className="flex-1 border-4 border-amber-300">
          <div className="mx-auto w-full max-w-[1200px] p-4">{middle}</div>
        </div>

        {/* Right Pane */}
        <div className="hidden w-[40rem] border-4 border-emerald-500 lg:block">
          <div className="mx-auto w-full max-w-[1200px] p-4">{right}</div>
        </div>
      </div>
    </>
  );
}

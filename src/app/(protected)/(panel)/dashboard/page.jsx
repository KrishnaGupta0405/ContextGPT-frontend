import React from "react";
import { PanelNavbar } from "@/components/navbar/PanelNavbar";
import {
  Link as LinkIcon,
  FileText,
  Quote,
  CalendarDays,
  ThumbsUp,
  ThumbsDown,
  LayoutTemplate,
  Info,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Copy,
  CodeXml,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard | ContextGPT",
  description: "View your chatbot performance analytics and overview.",
};

export default function Dashboard() {
  return (
    <>
      <PanelNavbar items={[{ label: "Dashboard" }]} />
      <div className="flex-1 space-y-8 overflow-y-auto p-6 md:p-8">
        {/* DASHBOARD HEADER */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Links */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-600" />
                <span className="text-[13px] font-bold text-slate-800">
                  Total Links
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[26.5px] leading-none font-extrabold text-slate-900">
                36
              </span>
              <Link
                href="/website-links"
                className="flex items-center text-[12.5px] font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                View All Links{" "}
                <ChevronRight className="ml-1 h-3 w-3" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Total Files */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-[13px] font-bold text-slate-800">
                  Total Files
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[26.5px] leading-none font-extrabold text-slate-900">
                3
              </span>
              <Link
                href="/website-files"
                className="flex items-center text-[12.5px] font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                View All Files{" "}
                <ChevronRight className="ml-1 h-3 w-3" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Total Custom Responses */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Quote className="h-5 w-5 text-blue-600" />
                <span className="text-[13px] font-bold text-slate-800">
                  Total Custom Responses
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[26.5px] leading-none font-extrabold text-slate-900">
                4
              </span>
              <Link
                href="/custom-responses"
                className="flex items-center text-[12.5px] font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                View All Responses{" "}
                <ChevronRight className="ml-1 h-3 w-3" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Total Messages */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <span className="text-[13px] font-bold text-slate-800">
                  Total Messages
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[26.5px] leading-none font-extrabold text-slate-900">
                74
              </span>
              <Link
                href="/chat-history"
                className="flex items-center text-[12.5px] font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                View Chat History{" "}
                <ChevronRight className="ml-1 h-3 w-3" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Positive Feedback */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 fill-green-500 text-green-500" />
                <span className="text-[13px] font-bold text-slate-800">
                  Positive Feedback
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[26.5px] leading-none font-extrabold text-slate-900">
                8.1%
              </span>
              <Link
                href="#"
                className="flex items-center text-[12.5px] font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                View Feedback{" "}
                <ChevronRight className="ml-1 h-3 w-3" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Negative Feedback */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThumbsDown className="h-5 w-5 fill-red-500 text-red-500" />
                <span className="text-[13px] font-bold text-slate-800">
                  Negative Feedback
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[26.5px] leading-none font-extrabold text-slate-900">
                2.7%
              </span>
              <Link
                href="#"
                className="flex items-center text-[12.5px] font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                View Feedback{" "}
                <ChevronRight className="ml-1 h-3 w-3" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Total Pages Consumed */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-blue-600" />
                <span className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800">
                  Total Pages Consumed
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[26.5px] leading-none font-extrabold text-slate-900">
                348
              </span>
            </div>
          </div>
        </div>

        <hr className="my-8 border-slate-100" />

        {/* STATUS & PREVIEW SECTION */}
        <div className="space-y-4">
          <h3 className="text-[17px] font-bold text-slate-900">
            Status & Preview
          </h3>
          <div className="rounded-[14px] border border-blue-100 bg-[#f4f7fc] p-6 shadow-sm">
            <div className="flex items-start gap-3.5">
              <RefreshCw className="mt-0.5 h-[18px] w-[18px] text-blue-500" />
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-blue-600">
                  Training is in progress — but you&apos;re good to go!
                </h4>
                <p className="max-w-[800px] pb-3 text-[13.5px] leading-relaxed text-blue-600/80">
                  Your chatbot is already trained on 42 documents and can answer
                  questions. 1 more is
                  <br className="hidden sm:block" />
                  still being processed to expand its knowledge.
                </p>
                <div>
                  <Button
                    variant="outline"
                    className="h-[34px] rounded-[8px] border-blue-200 bg-white px-3.5 text-[13px] font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    Chat with your chatbot{" "}
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-slate-100" />

        {/* INSTALLATION SECTION */}
        <div className="space-y-4 pb-8">
          <h3 className="text-[17px] font-bold text-slate-900">Installation</h3>
          <div className="space-y-4">
            {/* Chatbot ID */}
            <div className="rounded-[14px] border border-blue-100 bg-[#f4f7fc] p-6 shadow-sm">
              <div className="mb-2 flex items-center gap-2.5">
                <Copy className="h-4 w-4 text-blue-600" />
                <h4 className="text-[14.5px] font-bold text-slate-900">
                  Chatbot ID
                </h4>
              </div>
              <p className="mb-5 max-w-[800px] text-[13.5px] leading-relaxed text-blue-600/80">
                This is your unique chatbot identifier. Use this ID when
                integrating with third-party platforms like WordPress plugins.
              </p>
              <div className="flex items-center gap-4">
                <div className="rounded-md bg-[#dce6f6] px-3.5 py-1.5 font-mono text-[13.5px] text-blue-800">
                  93ab558e-8c8d-415e-8355-0fe0c1df4bb2
                </div>
                <button className="flex items-center text-[13.5px] font-bold text-blue-600 transition-colors hover:text-blue-800">
                  <Copy className="mr-1.5 h-3.5 w-3.5" strokeWidth={2.5} /> Copy
                </button>
              </div>
            </div>

            {/* Embed Code */}
            <div className="rounded-[14px] border border-blue-100 bg-[#f4f7fc] p-6 shadow-sm">
              <div className="mb-2 flex items-center gap-2.5">
                <CodeXml className="h-[18px] w-[18px] text-blue-600" />
                <h4 className="text-[14.5px] font-bold text-slate-900">
                  Embed Code
                </h4>
              </div>
              <p className="mb-5 max-w-[800px] text-[13.5px] leading-relaxed text-blue-600/80">
                Copy this code and paste it in your website&apos;s HTML to embed
                your chatbot.
              </p>

              <div className="relative mt-2 rounded-[8px] bg-[#dce6f6] p-4 font-mono text-[13.5px] text-blue-800">
                <button className="absolute top-4 right-4 flex items-center font-sans text-[13.5px] font-bold text-blue-600 transition-colors hover:text-blue-800">
                  <Copy className="mr-1.5 h-3.5 w-3.5" strokeWidth={2.5} /> Copy
                </button>
                <div className="max-w-[85%] leading-relaxed select-all">
                  &lt;script
                  type=&quot;text/javascript&quot;&gt;window.$sitegpt=[];(function()
                  <br />
                  &#123;d=document;s=d.createElement(&quot;script&quot;);s.src=&quot;https://sitegpt.ai/widget/93ab558e-8c8d-415e-8355-
                  <br />
                  0fe0c1df4bb2.js&quot;;s.async=1;d.getElementsByTagName(&quot;head&quot;)[0].appendChild(s);&#125;)();&lt;/script&gt;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { Mail } from "lucide-react";

export const metadata = {
  title: "Contact Us | ContextGPT",
};

export default function Contact() {
  return (
    <div className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          You can contact us at any time you like. We will get back to you as
          soon as possible.
        </p>

        <div className="mt-12 inline-flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Email</p>
            <p className="mt-1 text-sm text-slate-600">
              You can contact us directly at{" "}
              <a
                href="mailto:support@contextgpt.ai"
                className="text-blue-600 hover:underline"
              >
                support@contextgpt.ai
              </a>
              . You will get a response as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

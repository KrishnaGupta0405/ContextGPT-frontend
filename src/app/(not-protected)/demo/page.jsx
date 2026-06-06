import React from "react";

const DemoPage = () => {
  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-4 items-center">
          
          {/* Left Side Content */}
          <div className="flex flex-col text-left max-w-xl mx-auto lg:mx-0">
            <span className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-2">
              Live Demo
            </span>
            <p className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-[4rem] leading-tight mb-4">
              See for yourself.
            </p>
            <p className="text-xl text-slate-600">
              Ask the ContextGPT chatbot a question about itself.
            </p>
          </div>

          {/* Right Side Chatbot Placeholder */}
          <div className="flex justify-center lg:justify-center w-full">
            <div className="w-full max-w-[420px] h-[600px] bg-white rounded-3xl shadow-xl border border-slate-200 flex items-center justify-center relative overflow-hidden">
              <img
                src="/icons/Contextgpt_icon.png"
                alt="ContextGPT Bot"
                className="w-32 h-32 md:w-48 md:h-48 object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DemoPage;

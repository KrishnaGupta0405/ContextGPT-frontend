import React from "react";
import Image from "next/image";

const features = [
{
  title: "Purpose-built for LLMs",
  description: "Advanced language models optimized for reasoning, enabling accurate handling of complex customer support interactions.",
  image: "/landing/llm.avif",
  imageClassName: "w-full h-auto object-cover min-h-[16rem]",
},
{
  title: "Designed for simplicity",
  description: "Effortlessly build, manage, and launch AI agents without technical overhead, and automate support workflows in minutes.",
  image: "/landing/simplicity.avif",
  imageClassName: "w-full h-auto object-cover min-h-[16rem]",
},
{
  title: "Engineered for security",
  description: "Built with enterprise-grade protection, including strong encryption and strict compliance to safeguard your data.",
  image: "/landing/security.avif",
  imageClassName: "w-full h-auto object-cover min-h-[16rem]",
}
];

export default function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="mx-auto w-full">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20 items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-gray-200 bg-white">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              <span className="text-sm font-medium text-gray-700">Highlights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-[1.1] tracking-tight">
              The complete platform for AI support helpdesks
            </h2>
          </div>
          <div className="pb-2">
            <p className="text-lg leading-relaxed text-gray-500">
              ContextGPT is designed for building AI-powered customer support agents that solve your customers' hardest problems while improving business outcomes.
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col border border-gray-200 rounded-[1.2rem] bg-white overflow-hidden max-h-[28rem]"
            >
              <div className={`flex-1 flex items-center justify-center min-h-[16rem]`}>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={400}
                  height={300}
                  className={feature.imageClassName}
                />
              </div>
              <div className="p-8 pt-6 border-t border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


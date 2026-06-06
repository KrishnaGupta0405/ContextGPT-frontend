import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Zap,
  MessageSquare,
  TrendingUp,
  GitBranch,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import IntegrateWith from "./IntegrateWith";
import FeaturesCards from "./FeaturesCards";
import ChatAnimationCard from "./ChatAnimationCard";
import DataSourcesCard from "./DataSourcesCard";
import { useIsMobile } from "../../../hooks/use-mobile";
import Image from "next/image";

const FloatingPathsBackground = dynamic(
  () =>
    import("../../../components/ui/floating-path").then(
      (m) => m.FloatingPathsBackground,
    ),
  { ssr: false },
);

const useInView = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, ...options },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
};

const BentoGridItem = ({ item, globeConfig, isMobile }) => {
  const Icon = item.icon;
  const itemRef = useRef(null);
  const isInView = useInView(itemRef);

  return (
    <div
      ref={itemRef}
      style={{
        gridColumn: isMobile ? "span 4" : `span ${item.colSpan}`,
        gridRow: `span ${item.rowSpan}`,
      }}
      className={`relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white bg-linear-to-br p-8`}
    >
      {item.hasDataSources ? (
        <>
          <DataSourcesCard />
          <div className="relative z-10 flex h-full flex-col items-start justify-start">
            <div
              className="rounded-xl pr-16 pb-4"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.65) 60%, rgba(255,255,255,0) 100%)",
                backdropFilter: "blur(0.5px)",
                WebkitBackdropFilter: "blur(0.5px)",
              }}
            >
              <h3
                className={item.titleClassName}
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
              <p
                className={item.descriptionClassName}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          </div>
        </>
      ) : item.hasAnimation ? (
        <ChatAnimationCard />
      ) : item.hasFloatingPaths ? (
        isInView && (
          <FloatingPathsBackground
            className="absolute inset-0 overflow-hidden rounded-2xl"
            position={item.floatingPathsConfig?.position}
            pathCount={item.floatingPathsConfig?.pathCount}
            baseOpacity={item.floatingPathsConfig?.baseOpacity}
            opacityStep={item.floatingPathsConfig?.opacityStep}
            baseWidth={item.floatingPathsConfig?.baseWidth}
            widthStep={item.floatingPathsConfig?.widthStep}
            animationDuration={item.floatingPathsConfig?.animationDuration}
            color={item.floatingPathsConfig?.color}
          >
            <div className="relative z-10 flex h-full flex-col items-end justify-start p-8">
              <h3
                className={item.titleClassName}
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
              <p
                className={item.descriptionClassName}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          </FloatingPathsBackground>
        )
      ) : item.hasCustomImages ? (
        <div className="flex h-full w-full items-center justify-between gap-8">
          <div className="min-w-[40%]">
            <h3
              className={item.titleClassName}
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <p
              className={item.descriptionClassName}
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </div>
          <div
            className="relative flex-1"
            style={{ height: "28rem", minWidth: "36rem" }}
          >
            {item.customImages?.map((image, i) => {
              const angle = item.diagonalAngle || 45;

              const getClipPath = (index, angle) => {
                const normalizedAngle = ((angle % 360) + 360) % 360;

                const getLinePoints = (angle) => {
                  const rad = (angle * Math.PI) / 180;
                  const centerX = 50;
                  const centerY = 50;
                  const distance = 100;

                  const x1 = centerX + distance * Math.cos(rad);
                  const y1 = centerY + distance * Math.sin(rad);
                  const x2 = centerX - distance * Math.cos(rad);
                  const y2 = centerY - distance * Math.sin(rad);

                  return { x1, y1, x2, y2 };
                };

                const { x1, y1, x2, y2 } = getLinePoints(normalizedAngle);

                if (index === 0) {
                  return `polygon(0 0, 100% 0, ${x1}% ${y1}%, ${x2}% ${y2}%)`;
                } else if (index === 1) {
                  return `polygon(${x1}% ${y1}%, 100% 0, 100% 100%, 0 100%, ${x2}% ${y2}%)`;
                } else {
                  return `polygon(${x2}% ${y2}%, ${x1}% ${y1}%, 100% 100%, 0 100%)`;
                }
              };

              return (
                <div
                  key={i}
                  className="absolute inset-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                  style={{
                    clipPath: getClipPath(i, angle),
                    zIndex: i,
                    boxShadow: i > 0 ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `Brand Image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="flex h-full flex-col">
            <div className="relative z-20">
              <h3
                className={`${item.titleClassName} ${item.hasGlobe ? "z-20" : ""}`}
              >
                {item.title}
              </h3>
              <p
                className={item.descriptionClassName}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
            {item.hasGlobe ? (
              <div className="absolute right-0 bottom-0">
                <Image
                  src="/landing/map.jpg"
                  alt="globe"
                  width={600}
                  height={500}
                  className="right-0 h-[20rem] w-[26rem] rounded-xl object-contain"
                />
              </div>
            ) : item.image ? (
              <div className="mt-4">
                <div className="relative w-full">
                  <div className={`${item.image.containerClass || ""}`}>
                    <img
                      src={item.image.src}
                      alt={item.image.alt}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                  {item.image.overlayClass && (
                    <div
                      className={`absolute inset-0 ${item.image.overlayClass} pointer-events-none`}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-auto flex justify-end">
                <div className="bg-opacity-50 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                  <Icon className="h-6 w-6 text-gray-700" />
                </div>
              </div>
            )}
            {item.slaContent && (
              <div className="relative z-20 mt-auto">
                {" "}
                {/* Add relative + z-20 here */}
                <p className={`${item.slaContentClassName}`}>
                  {item.slaContent}
                </p>
                <p className={`${item.slaDescriptionClassName}`}>
                  {item.slaDescription}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const BentoGrid = () => {
  const isMobile = useIsMobile();

  const items = [
    {
      id: 1,
      title: "Aggregate data from diverse sources",
      description:
        "Import data seamlessly from platforms like Google Drive, Meta, Apple, and SharePoint, while keeping all your information unified <br/> and accessible in one place.",
      titleClassName:
        "text-2xl font-semibold text-gray-900 mb-3 underline decoration-dashed decoration-indigo-500 decoration-offset-4",
      descriptionClassName: "text-sm text-gray-700 leading-relaxed",
      icon: Zap,
      bgGradient: "white",
      colSpan: 2,
      rowSpan: 1,
      bgGradient: "",
      hasDataSources: true,
    },
    {
      id: 2,
      title: "Develop a bespoke chatbot trained on proprietary content",
      description:
        "Ever wished you could duplicate yourself to handle customer questions? <br/> Now it’s possible! Train a chatbot using your own content <br/> and let it reflect your brand’s tone perfectly. <br/><br/>Who would’ve thought a chatbot could act as your virtual twin? :)",
      titleClassName:
        "text-2xl font-semibold text-gray-900 mb-3 text-right decoration underline decoration-dashed decoration-indigo-500",
      descriptionClassName: "text-sm text-gray-700 leading-relaxed text-right",
      icon: MessageSquare,
      bgGradient: "white",
      colSpan: 2,
      rowSpan: 1,
      bgGradient: "",
      hasFloatingPaths: true,
      floatingPathsConfig: {
        position: 2,
        pathCount: 20,
        baseOpacity: 0.04,
        opacityStep: 0.05,
        baseWidth: 0.4,
        widthStep: 0.025,
        animationDuration: 18,
        color: "orange",
        hSpread: 5,
        vSpread: 10,
      },
    },
    {
      id: 6,
      title:
        "Matches <span class='line-through'>any</span> <span class='underline decoration-dashed decoration-indigo-500 decoration-offset-2'> Your Brand</span> identity.",
      description:
        "Customize your chatbot to appear native—control every color, icon, and chat element",
      titleClassName: "text-4xl font-semibold text-gray-900 mb-3",
      descriptionClassName: "text-sm text-gray-700 leading-relaxed",
      icon: TrendingUp,
      bgGradient: "white",
      colSpan: 4,
      rowSpan: 1,
      bgGradient: "",
      hasCustomImages: true,
      diagonalAngle: -60,
      customImages: [
        { src: "/landing/sla-demo.png", alt: "Brand Demo 1" },
        { src: "/landing/sla-demo.png", alt: "Brand Demo 3" },
        { src: "/landing/bg.avif", alt: "Brand Demo 2" },
      ],
      imageShifts: [
        { x: -90, y: 0 },
        { x: 0, y: 0 },
        { x: 60, y: 0 },
      ],
    },
    {
      id: 3,
      title: "Compare AI models",
      description:
        "Experiment with various models and configurations to make sure you have the best setup for your use case.",
      titleClassName: "text-xl font-semibold text-gray-900 mb-3",
      descriptionClassName: "text-sm text-gray-700 leading-relaxed",
      icon: GitBranch,
      bgGradient: "white",
      colSpan: 1,
      rowSpan: 1,
      bgGradient: "",
      hasAnimation: true,
    },
    {
      id: 4,
      title: "Global CDN Coverage",
      description:
        "Instant chatbot replies within seconds to your users<br/> anywhere in the world.",
      titleClassName: "text-xl font-semibold text-gray-900 mb-3",
      descriptionClassName: "text-sm text-gray-700 leading-relaxed",
      slaContentClassName: "text-sm font-semibold text-gray-900",
      slaDescriptionClassName: "text-xs text-gray-600 mt-1",
      bgGradient: "white",
      colSpan: 2,
      rowSpan: 1,
      bgGradient: "",
      hasGlobe: true,
      slaContent: "Industry-leading Global CDN Provider",
      slaDescription:
        "North America • Europe • Asia Pacific • South America • Africa",
      cdnRegions: ["N. America", "Europe", "Asia", "S. America", "Africa"],
    },
    {
      id: 5,
      title: "Advanced reporting",
      description:
        "Gain insights and optimize chatbot performance with detailed analytics, with industry standards SLAs.",
      titleClassName: "text-xl font-semibold text-gray-900 mb-3",
      descriptionClassName: "text-sm text-gray-700 leading-relaxed",
      icon: BarChart3,
      colSpan: 1,
      rowSpan: 1,
      bgGradient: "white",
      // slaContent: '99.99% uptime SLA',
      // slaDescription: 'We guarantee 99.99% uptime SLA for our platform.',
      image: {
        src: "/landing/sla-demo.png",
        alt: "Analytics",
        width: "80%",
        height: "50%",
        position: {
          bottom: "0em",
          left: "50%",
          transform: "translateX(-50%)",
        },
        containerClass: "rounded-t-2xl overflow-hidden",
        overlayClass:
          "rounded-t-2xl bg-linear-to-b from-transparent via-transparent to-blue-100/2 ",
      },
    },
  ];

  return (
    <div className="mt-16 mb-16 pt-20 pb-16">
      {/* <div className='border-2 border-pink-500 w-[50rem] h-[50rem]'><World  globeConfig={globeConfig} isMobile={isMobile} /></div> */}

      {/* Header Section */}
      <div className="mb-10 grid grid-cols-1 items-end lg:grid-cols-1">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-teal-500"></span>
            <span className="text-sm font-medium text-gray-700">
              Why choose
            </span>
          </div>
          <h2 className="mb-3 text-3xl leading-[1.1] font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            The complete platform for AI support helpdesks
          </h2>
        </div>
        <div className="pb-2">
          <p className="text-lg leading-relaxed text-gray-500">
            Build an AI assistant that can handle complex, multi-turn
            conversations—powered by the same models used by top companies
            worldwide.
          </p>
        </div>
      </div>
      <div className="grid auto-rows-max grid-cols-4 gap-6">
        {items.map((item) => (
          <BentoGridItem key={item.id} item={item} isMobile={isMobile} />
        ))}
      </div>
      <IntegrateWith />
      <FeaturesCards />
    </div>
  );
};

export default BentoGrid;

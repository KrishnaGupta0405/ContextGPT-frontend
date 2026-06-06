import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";
import { User } from "lucide-react";

const ChatAnimationCard = () => {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  const chatSequence = [
    { type: "user", text: "How can you help my business?" },
    {
      type: "bot",
      text: "I provide instant customer support, lead qualification, and 24/7 availability.",
    },
    { type: "user", text: "Can you integrate with my CRM?" },
    {
      type: "bot",
      text: "Yes! I integrate seamlessly with popular CRMs and support systems.",
    },
    { type: "user", text: "What languages do you support?" },
    {
      type: "bot",
      text: "I support 50+ languages for global customer engagement.",
    },
  ];

  // Auto-scroll animation: smoothly scroll to bottom when new messages arrive (800ms duration with easeInOutQuad)
  useEffect(() => {
    if (messagesContainerRef.current) {
      const targetScroll = messagesContainerRef.current.scrollHeight;
      const currentScroll = messagesContainerRef.current.scrollTop;
      const distance = targetScroll - currentScroll;
      const duration = 1000; // 800ms animation duration for smooth scrolling
      const startTime = Date.now();

      const animateScroll = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeInOutQuad easing function for natural acceleration and deceleration
        const easeInOutQuad =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;
        messagesContainerRef.current.scrollTop =
          currentScroll + distance * easeInOutQuad;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      animateScroll();
    }
  }, [messages]);

  useEffect(() => {
    if (currentStep < chatSequence.length) {
      const currentMessage = chatSequence[currentStep];

      if (currentMessage.type === "bot" && isTyping) {
        const timer = setTimeout(() => {
          setMessages((prev) => [...prev, currentMessage]);
          setIsTyping(false);
          setCurrentStep((prev) => prev + 1);
        }, 1800);
        return () => clearTimeout(timer);
      }

      if (currentMessage.type === "user") {
        const delay = currentStep === 0 ? 500 : 3500;
        const timer = setTimeout(() => {
          setMessages((prev) => [...prev, currentMessage]);
          setCurrentStep((prev) => prev + 1);
        }, delay);
        return () => clearTimeout(timer);
      }

      if (isTyping) {
        const timer = setTimeout(() => {
          setIsTyping(true);
        }, 400);
        return () => clearTimeout(timer);
      }

      const timer = setTimeout(() => {
        setIsTyping(true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const resetTimer = setTimeout(() => {
        setMessages([]);
        setCurrentStep(0);
        setIsTyping(false);
      }, 4000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentStep, isTyping]);

  return (
    <div className="-m-4 flex w-full flex-col justify-between lg:w-[16rem]">
      <div
        ref={messagesContainerRef}
        className="mb-4 h-[15rem] space-y-4 overflow-hidden scroll-smooth pr-1"
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence>
          {messages.map((message, idx) => (
            // Message appearance animation: 0.5s duration with easeInOut for smooth fade-in and scale
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`flex items-end gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "bot" && (
                <Avatar className="h-8 w-8 shrink-0 border border-gray-200 bg-white shadow-sm">
                  <AvatarImage
                    src="/icons/Contextgpt_icon.png"
                    alt="Bot"
                    className="object-contain p-1"
                  />
                  <AvatarFallback className="bg-gray-50 text-[10px] font-medium text-gray-500">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[65%] rounded-lg px-3 py-2 text-xs shadow-sm ${
                  message.type === "user"
                    ? "ml-auto rounded-br-none bg-blue-500 text-white"
                    : "mr-auto rounded-bl-none border border-gray-200 bg-white text-gray-900"
                }`}
              >
                {message.text}
              </div>
              {message.type === "user" && (
                <Avatar className="h-8 w-8 shrink-0 border border-gray-200 shadow-sm">
                  <AvatarImage
                    src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
                    alt="Bot"
                    className="object-contain"
                  />
                  <AvatarFallback className="bg-gray-50 text-gray-500">
                    <User size={16} strokeWidth={2.5} />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex items-end justify-start gap-2"
            >
              <Avatar className="h-8 w-8 shrink-0 border border-gray-200 bg-white shadow-sm">
                <AvatarImage
                  src="/icons/Contextgpt_icon.png"
                  alt="Bot"
                  className="object-contain p-1"
                />
                <AvatarFallback className="bg-gray-50 text-[10px] font-medium text-gray-500">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="flex max-w-[75%] gap-1 rounded-lg rounded-bl-none border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-sm">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"></span>
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                  style={{ animationDelay: "0.1s" }}
                ></span>
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                  style={{ animationDelay: "0.2s" }}
                ></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative mt-4 border-t border-gray-200 pt-4">
        <div className="absolute inset-x-0 top-0 h-8 bg-linear-to-b from-blue-500/20 to-transparent blur-md"></div>
        <div className="relative px-1 pt-2">
          <h3 className="mb-1 text-sm font-semibold text-gray-900">
            Lightning-Fast AI Assistant
          </h3>
          <p className="text-xs text-gray-600">
            Industry-leading latency with global CDN, intelligent caching, and
            optimized response times.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAnimationCard;

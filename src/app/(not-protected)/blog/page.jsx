"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const CATEGORIES = [
  "All",
  "AI Chatbots",
  "Customer Support",
  "Product Updates",
  "Guides",
  "Case Studies",
];

const POSTS = [
  {
    slug: "how-to-build-ai-chatbot-for-your-website",
    title: "How to Build an AI Chatbot for Your Website in 5 Minutes",
    excerpt:
      "A step-by-step guide to creating a personalized AI chatbot that answers your visitors' questions using your own content.",
    category: "Guides",
    date: "Mar 25, 2026",
    readTime: "6 min read",
  },
  {
    slug: "ai-customer-support-vs-traditional-chatbots",
    title: "AI Customer Support vs Traditional Chatbots: What's the Difference?",
    excerpt:
      "Learn why AI-powered support agents outperform rule-based chatbots and how to make the switch.",
    category: "AI Chatbots",
    date: "Mar 18, 2026",
    readTime: "5 min read",
  },
  {
    slug: "reduce-support-tickets-with-ai",
    title: "How to Reduce Support Tickets by 60% with AI",
    excerpt:
      "Real strategies and data on how businesses are using AI chatbots to deflect repetitive tickets and free up their support teams.",
    category: "Customer Support",
    date: "Mar 10, 2026",
    readTime: "7 min read",
  },
  {
    slug: "multilingual-chatbot-support-guide",
    title: "The Complete Guide to Multilingual Chatbot Support",
    excerpt:
      "How to serve customers in 95+ languages without hiring a single translator.",
    category: "Guides",
    date: "Mar 3, 2026",
    readTime: "8 min read",
  },
  {
    slug: "lead-generation-with-ai-chatbots",
    title: "Turn Your Chatbot into a 24/7 Lead Generation Machine",
    excerpt:
      "Capture, qualify, and route leads automatically with AI-powered conversations that never sleep.",
    category: "AI Chatbots",
    date: "Feb 24, 2026",
    readTime: "5 min read",
  },
  {
    slug: "contextgpt-vs-intercom-vs-drift",
    title: "ContextGPT vs Intercom vs Drift: 2026 Comparison",
    excerpt:
      "An honest comparison of the leading AI customer support platforms — features, pricing, and use cases.",
    category: "AI Chatbots",
    date: "Feb 15, 2026",
    readTime: "10 min read",
  },
  {
    slug: "chatbot-security-best-practices",
    title: "Chatbot Security: Best Practices for Protecting Customer Data",
    excerpt:
      "SOC 2, GDPR, HIPAA — what compliance really means for AI chatbots and how to ensure your data stays safe.",
    category: "Customer Support",
    date: "Feb 8, 2026",
    readTime: "6 min read",
  },
  {
    slug: "ecommerce-chatbot-case-study",
    title: "How an E-Commerce Store Saved $50K/Year with ContextGPT",
    excerpt:
      "A real-world case study showing how an online retailer automated 70% of their pre-sales and post-sales support.",
    category: "Case Studies",
    date: "Jan 28, 2026",
    readTime: "4 min read",
  },
  {
    slug: "whats-new-march-2026",
    title: "What's New: March 2026 Product Updates",
    excerpt:
      "New integrations, improved accuracy, and faster response times — here's what we shipped this month.",
    category: "Product Updates",
    date: "Mar 1, 2026",
    readTime: "3 min read",
  },
];

export default function Blog() {
  return (
    <div className="bg-white text-slate-900">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 to-white" />
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            Blog
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mx-auto mt-4 max-w-2xl text-lg text-slate-600"
          >
            Insights on AI customer support, chatbot best practices, and product
            updates from the ContextGPT team.
          </motion.p>
        </div>
      </section>

      {/* ─── Category Filter ─── */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Posts Grid ─── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post, i) => (
            <motion.article
              key={post.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i % 3}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              {/* Colored header bar */}
              <div className="h-2 rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-600" />

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    <Tag className="h-3 w-3" />
                    {post.category}
                  </span>
                </div>

                <h2 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-600">
                  {post.title}
                </h2>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Read <ArrowRight className="inline h-3 w-3" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

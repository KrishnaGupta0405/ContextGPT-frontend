// ===========================================================================
// Tool type enum — determines which UI component is rendered
// ===========================================================================
export const TOOL_TYPES = {
  FILE_TO_MARKDOWN: "file-to-markdown", // file upload → backend → markdown
  URL_TO_MARKDOWN: "url-to-markdown", // URL input → backend → markdown
  CLIENT_CONVERTER: "client-converter", // pure client-side conversion
  AI_GENERATOR: "ai-generator", // form → LLM → text output
  AI_CHAT: "ai-chat", // file/url/text context → chat
  SITEMAP: "sitemap", // URL → backend → sitemap data
  ROI_CALCULATOR: "roi-calculator", // pure client-side math
  EMAIL_SIGNATURE: "email-signature", // pure client-side HTML generation
};

// ===========================================================================
// All tools
// ===========================================================================
export const ALL_TOOLS = [
  // -------------------------------------------------------------------------
  // CONVERT TO MARKDOWN
  // -------------------------------------------------------------------------
  {
    slug: "convert-pdf-to-markdown",
    title: "Convert PDF to Markdown",
    category: "Convert to Markdown",
    description:
      "Upload any PDF file and convert it to clean Markdown instantly. Perfect for migrating documentation, reports, and blog posts. Free to use. No sign up required.",
    toolType: TOOL_TYPES.FILE_TO_MARKDOWN,
    apiEndpoint: "tools/convert/pdf-to-markdown",
    acceptedFileTypes: ".pdf",
    fileHint: ".pdf format supported, up to 10 MB.",
    actionLabel: "Convert to Markdown",
    icon: "📄",
    bgColor: "bg-red-50",
    iconBg: "bg-red-100",
  },
  {
    slug: "convert-docx-to-markdown",
    title: "Convert DOCX to Markdown",
    category: "Convert to Markdown",
    description:
      "Upload any Word document (.docx) and convert it to clean Markdown. Perfect for migrating Word documents to web-friendly Markdown format. Free to use.",
    toolType: TOOL_TYPES.FILE_TO_MARKDOWN,
    apiEndpoint: "tools/convert/docx-to-markdown",
    acceptedFileTypes: ".docx,.doc",
    fileHint: ".docx / .doc format supported, up to 10 MB.",
    actionLabel: "Convert to Markdown",
    icon: "📝",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    slug: "convert-html-to-markdown",
    title: "Convert HTML to Markdown",
    category: "Convert to Markdown",
    description:
      "Upload any HTML file and convert it to clean Markdown instantly. Perfect for migrating web content, documentation, and blog posts. Free to use. No sign up required.",
    toolType: TOOL_TYPES.FILE_TO_MARKDOWN,
    apiEndpoint: "tools/convert/html-to-markdown",
    acceptedFileTypes: ".html,.htm",
    fileHint: ".html format supported, up to 2 MB.",
    actionLabel: "Convert to Markdown",
    icon: "🌐",
    bgColor: "bg-orange-50",
    iconBg: "bg-orange-100",
  },
  {
    slug: "convert-notion-to-markdown",
    title: "Convert Notion to Markdown",
    category: "Convert to Markdown",
    description:
      "Enter a public Notion page URL and convert its content to clean Markdown. Make sure the Notion page is set to 'Public' sharing. Free to use.",
    toolType: TOOL_TYPES.URL_TO_MARKDOWN,
    apiEndpoint: "tools/convert/notion-to-markdown",
    inputLabel: "Notion Page URL",
    inputPlaceholder: "https:/notion.so/your-page-id",
    inputHint: "The Notion page must be publicly shared.",
    actionLabel: "Convert to Markdown",
    icon: "🗒️",
    bgColor: "bg-gray-50",
    iconBg: "bg-gray-100",
  },
  {
    slug: "convert-google-docs-to-markdown",
    title: "Convert Google Docs to Markdown",
    category: "Convert to Markdown",
    description:
      "Enter a Google Docs sharing URL and convert the document to clean Markdown. The document must be shared with 'Anyone with the link can view'. Free to use.",
    toolType: TOOL_TYPES.URL_TO_MARKDOWN,
    apiEndpoint: "tools/convert/google-docs-to-markdown",
    inputLabel: "Google Docs URL",
    inputPlaceholder: "https:/docs.google.com/document/d/...",
    inputHint: "Document must be shared with 'Anyone with the link'.",
    actionLabel: "Convert to Markdown",
    icon: "📃",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100",
  },
  {
    slug: "convert-xml-to-markdown",
    title: "Convert XML to Markdown",
    category: "Convert to Markdown",
    description:
      "Paste or upload your XML content and convert it to clean, readable Markdown. Runs entirely in your browser — no data sent to server. Free to use.",
    toolType: TOOL_TYPES.CLIENT_CONVERTER,
    converterType: "xml",
    inputLabel: "Paste your XML here",
    inputPlaceholder:
      '<?xml version="1.0"?>\n<root>\n  <item>...</item>\n</root>',
    actionLabel: "Convert to Markdown",
    icon: "🔖",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    slug: "convert-csv-to-markdown",
    title: "Convert CSV to Markdown",
    category: "Convert to Markdown",
    description:
      "Paste your CSV data and instantly convert it to a Markdown table. Runs entirely in your browser — no data sent to server. Free to use. No sign up required.",
    toolType: TOOL_TYPES.CLIENT_CONVERTER,
    converterType: "csv",
    inputLabel: "Paste your CSV data here",
    inputPlaceholder: "Name,Age,City\nAlice,30,New York\nBob,25,London",
    actionLabel: "Convert to Markdown Table",
    icon: "📊",
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    slug: "convert-json-to-markdown",
    title: "Convert JSON to Markdown",
    category: "Convert to Markdown",
    description:
      "Paste your JSON data and convert it to a readable Markdown document. Arrays become tables, objects become definition lists. Free to use.",
    toolType: TOOL_TYPES.CLIENT_CONVERTER,
    converterType: "json",
    inputLabel: "Paste your JSON here",
    inputPlaceholder: '{\n  "name": "Alice",\n  "age": 30\n}',
    actionLabel: "Convert to Markdown",
    icon: "{ }",
    bgColor: "bg-yellow-50",
    iconBg: "bg-yellow-100",
  },
  {
    slug: "convert-rtf-to-markdown",
    title: "Convert RTF to Markdown",
    category: "Convert to Markdown",
    description:
      "Upload any RTF (Rich Text Format) file and convert it to clean Markdown. Free to use. No sign up required.",
    toolType: TOOL_TYPES.FILE_TO_MARKDOWN,
    apiEndpoint: "tools/convert/rtf-to-markdown",
    acceptedFileTypes: ".rtf",
    fileHint: ".rtf format supported, up to 5 MB.",
    actionLabel: "Convert to Markdown",
    icon: "📋",
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
  {
    slug: "convert-paste-to-markdown",
    title: "Convert Paste to Markdown",
    category: "Convert to Markdown",
    description:
      "Paste any text and instantly detect and convert formatting to clean Markdown. HTML paste is automatically handled. Free to use. No sign up required.",
    toolType: TOOL_TYPES.CLIENT_CONVERTER,
    converterType: "paste",
    inputLabel: "Paste your text here",
    inputPlaceholder: "Paste any text or HTML here...",
    actionLabel: "Convert to Markdown",
    icon: "📋",
    bgColor: "bg-teal-50",
    iconBg: "bg-teal-100",
  },
  {
    slug: "convert-webpage-to-markdown",
    title: "Convert Webpage to Markdown",
    category: "Convert to Markdown",
    description:
      "Enter any webpage URL and convert the main content to clean Markdown. Perfect for saving articles, blog posts, and documentation. Free to use.",
    toolType: TOOL_TYPES.URL_TO_MARKDOWN,
    apiEndpoint: "tools/convert/webpage-to-markdown",
    inputLabel: "Webpage URL",
    inputPlaceholder: "https:/example.com/article",
    inputHint: "The URL must be publicly accessible.",
    actionLabel: "Convert to Markdown",
    icon: "🔗",
    bgColor: "bg-cyan-50",
    iconBg: "bg-cyan-100",
  },

  // -------------------------------------------------------------------------
  // AI CHAT TOOLS
  // -------------------------------------------------------------------------
  {
    slug: "ai-chat-text-data",
    title: "AI Chat with Your Text Data",
    category: "AI Chat Tools",
    description:
      "Paste any text — articles, reports, notes — and ask AI questions about it. Get instant answers from your own content. No training required. Free to use.",
    toolType: TOOL_TYPES.AI_CHAT,
    chatMode: "text",
    apiEndpoint: "tools/chat/text",
    icon: "💬",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    slug: "ai-chat-website-data",
    title: "AI Chat with Your Website Data",
    category: "AI Chat Tools",
    description:
      "Enter a public website URL and instantly chat with AI about its content. Great for research, competitive analysis, and content extraction. Free to use.",
    toolType: TOOL_TYPES.AI_CHAT,
    chatMode: "website",
    apiEndpoint: "tools/chat/website",
    icon: "🌐",
    bgColor: "bg-indigo-50",
    iconBg: "bg-indigo-100",
  },
  {
    slug: "ai-chat-document-data",
    title: "AI Chat with Your Document & Data",
    category: "AI Chat Tools",
    description:
      "Upload a document (TXT, MD, CSV) and chat with AI about its content. Get instant answers without reading the entire file. Free to use.",
    toolType: TOOL_TYPES.AI_CHAT,
    chatMode: "document",
    apiEndpoint: "tools/chat/document",
    acceptedFileTypes: ".txt,.md,.csv",
    fileHint: ".txt, .md, .csv supported, up to 5 MB.",
    icon: "📁",
    bgColor: "bg-violet-50",
    iconBg: "bg-violet-100",
  },
  {
    slug: "ai-chat-pdf-data",
    title: "AI Chat with Your PDF Document & Data",
    category: "AI Chat Tools",
    description:
      "Upload any PDF and chat with AI about its content. Ask questions, get summaries, and extract information instantly. Free to use. No sign up required.",
    toolType: TOOL_TYPES.AI_CHAT,
    chatMode: "pdf",
    apiEndpoint: "tools/chat/pdf",
    acceptedFileTypes: ".pdf",
    fileHint: ".pdf format supported, up to 10 MB.",
    icon: "📄",
    bgColor: "bg-red-50",
    iconBg: "bg-red-100",
  },
  {
    slug: "ai-chat-word-data",
    title: "AI Chat with Your Word Document & Data",
    category: "AI Chat Tools",
    description:
      "Upload a Word document (.docx) and chat with AI about its content. Extract key information and insights instantly. Free to use.",
    toolType: TOOL_TYPES.AI_CHAT,
    chatMode: "word",
    apiEndpoint: "tools/chat/word",
    acceptedFileTypes: ".docx,.doc",
    fileHint: ".docx / .doc supported, up to 10 MB.",
    icon: "📝",
    bgColor: "bg-sky-50",
    iconBg: "bg-sky-100",
  },

  // -------------------------------------------------------------------------
  // AI GENERATORS
  // -------------------------------------------------------------------------
  {
    slug: "ai-reply-generator",
    title: "AI Reply Generator",
    category: "AI Generators",
    description:
      "Paste any message and instantly generate a professional, contextual reply with AI. Save time on email, chat, and social media responses. Free to use.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/reply",
    fields: [
      {
        name: "originalMessage",
        label: "Original Message",
        type: "textarea",
        placeholder: "Paste the message you want to reply to...",
        required: true,
        maxLength: 3000,
      },
      {
        name: "context",
        label: "Additional Context (optional)",
        type: "textarea",
        placeholder: "Any extra context that may help craft the reply...",
        maxLength: 1200,
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        options: ["professional", "friendly", "casual", "formal", "empathetic"],
        defaultValue: "professional",
      },
    ],
    actionLabel: "Generate Reply",
    outputLabel: "Generated Reply",
    icon: "↩️",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    slug: "ai-prompt-generator",
    title: "AI Prompt Generator",
    category: "AI Generators",
    description:
      "Describe what you need and AI will generate a perfect, optimized prompt for ChatGPT, Claude, or any AI tool. Free to use. No sign up required.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/prompt",
    fields: [
      {
        name: "topic",
        label: "Topic / Goal",
        type: "input",
        placeholder: "e.g. Write a product description for a SaaS tool",
        required: true,
        maxLength: 100,
      },
      {
        name: "purpose",
        label: "Purpose",
        type: "input",
        placeholder: "e.g. Marketing, content creation, code generation...",
        maxLength: 120,
      },
      {
        name: "details",
        label: "Extra Details (optional)",
        type: "textarea",
        placeholder: "Any specific requirements, tone, length, format...",
        maxLength: 1200,
      },
    ],
    actionLabel: "Generate Prompt",
    outputLabel: "Generated Prompt",
    icon: "✨",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    slug: "ai-prompt-optimizer",
    title: "AI Prompt Optimizer",
    category: "AI Generators",
    description:
      "Paste an existing AI prompt and get an optimized version with explanations of all improvements. Get better results from any AI tool. Free to use.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/optimize-prompt",
    fields: [
      {
        name: "prompt",
        label: "Your Existing Prompt",
        type: "textarea",
        placeholder: "Paste the prompt you want to optimize...",
        required: true,
        maxLength: 3000,
      },
    ],
    actionLabel: "Optimize Prompt",
    outputLabel: "Optimized Prompt + Improvements",
    icon: "⚡",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-100",
  },
  {
    slug: "ai-faq-generator",
    title: "AI FAQ Generator",
    category: "AI Generators",
    description:
      "Enter your topic and AI generates a complete FAQ with detailed answers. Perfect for websites, help centers, and product pages. Free to use.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/faq",
    fields: [
      {
        name: "topic",
        label: "Topic / Product / Service",
        type: "input",
        placeholder: "e.g. AI Chatbot for e-commerce",
        required: true,
        maxLength: 100,
      },
      {
        name: "businessType",
        label: "Business Type (optional)",
        type: "input",
        placeholder: "e.g. SaaS, E-commerce, Healthcare...",
        maxLength: 80,
      },
      {
        name: "count",
        label: "Number of FAQs",
        type: "select",
        options: ["5", "10", "15", "20"],
        defaultValue: "10",
      },
    ],
    actionLabel: "Generate FAQs",
    outputLabel: "Generated FAQs",
    icon: "❓",
    bgColor: "bg-teal-50",
    iconBg: "bg-teal-100",
  },
  {
    slug: "ai-answer-generator",
    title: "AI Answer Generator",
    category: "AI Generators",
    description:
      "Type any question and AI generates a comprehensive, accurate answer. Great for research, support documentation, and content creation. Free to use.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/answer",
    fields: [
      {
        name: "question",
        label: "Your Question",
        type: "textarea",
        placeholder: "Enter your question here...",
        required: true,
        maxLength: 600,
      },
      {
        name: "context",
        label: "Context (optional)",
        type: "textarea",
        placeholder: "Any background information...",
        maxLength: 1200,
      },
      {
        name: "audience",
        label: "Target Audience (optional)",
        type: "input",
        placeholder: "e.g. beginners, experts, executives...",
        maxLength: 80,
      },
    ],
    actionLabel: "Generate Answer",
    outputLabel: "Generated Answer",
    icon: "💡",
    bgColor: "bg-yellow-50",
    iconBg: "bg-yellow-100",
  },
  {
    slug: "ai-email-response-generator",
    title: "AI Email Response Generator",
    category: "AI Generators",
    description:
      "Paste any email and AI generates a professional, ready-to-send response. Save time and improve your email communication. Free to use.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/email-response",
    fields: [
      {
        name: "originalEmail",
        label: "Original Email",
        type: "textarea",
        placeholder: "Paste the email you want to respond to...",
        required: true,
        maxLength: 3000,
      },
      {
        name: "purpose",
        label: "Response Purpose (optional)",
        type: "input",
        placeholder: "e.g. Decline the meeting, Request more info...",
        maxLength: 120,
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        options: [
          "professional",
          "friendly",
          "formal",
          "concise",
          "empathetic",
        ],
        defaultValue: "professional",
      },
    ],
    actionLabel: "Generate Email Response",
    outputLabel: "Generated Email Response",
    icon: "📧",
    bgColor: "bg-sky-50",
    iconBg: "bg-sky-100",
  },
  {
    slug: "ai-letter-generator",
    title: "AI Letter Generator",
    category: "AI Generators",
    description:
      "Describe your letter's purpose and AI generates a properly formatted, professional letter. Works for business, personal, and official letters. Free to use.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/letter",
    fields: [
      {
        name: "letterType",
        label: "Letter Type",
        type: "select",
        options: [
          "formal",
          "informal",
          "business",
          "cover letter",
          "resignation",
          "recommendation",
          "complaint",
          "apology",
        ],
        defaultValue: "formal",
      },
      {
        name: "recipient",
        label: "Recipient",
        type: "input",
        placeholder: "e.g. Hiring Manager, Customer Service Team...",
        maxLength: 100,
      },
      {
        name: "purpose",
        label: "Purpose / Main Message",
        type: "textarea",
        placeholder: "Describe what this letter is about...",
        required: true,
        maxLength: 1200,
      },
      {
        name: "details",
        label: "Additional Details (optional)",
        type: "textarea",
        placeholder: "Any specific points to include...",
        maxLength: 1200,
      },
      {
        name: "tone",
        label: "Tone",
        type: "select",
        options: ["formal", "semi-formal", "friendly", "assertive"],
        defaultValue: "formal",
      },
    ],
    actionLabel: "Generate Letter",
    outputLabel: "Generated Letter",
    icon: "✉️",
    bgColor: "bg-indigo-50",
    iconBg: "bg-indigo-100",
  },
  {
    slug: "ai-blog-title-generator",
    title: "AI Blog Title Generator",
    category: "AI Generators",
    description:
      "Enter your blog topic and AI generates compelling, SEO-friendly titles that drive clicks. Get multiple options instantly. Free to use.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/blog-title",
    fields: [
      {
        name: "topic",
        label: "Blog Topic",
        type: "input",
        placeholder: "e.g. AI chatbots for customer support",
        required: true,
        maxLength: 100,
      },
      {
        name: "audience",
        label: "Target Audience (optional)",
        type: "input",
        placeholder: "e.g. small business owners, developers...",
        maxLength: 80,
      },
      {
        name: "count",
        label: "Number of Titles",
        type: "select",
        options: ["5", "10", "15", "20"],
        defaultValue: "10",
      },
    ],
    actionLabel: "Generate Blog Titles",
    outputLabel: "Generated Blog Titles",
    icon: "📰",
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
  {
    slug: "ai-chatbot-name-generator",
    title: "AI Chatbot Name Generator",
    category: "AI Generators",
    description:
      "Describe your business and AI generates creative, memorable chatbot names that match your brand personality. Free to use. No sign up required.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/chatbot-name",
    fields: [
      {
        name: "businessType",
        label: "Business Type",
        type: "input",
        placeholder: "e.g. E-commerce store, SaaS company, Healthcare clinic",
        required: true,
        maxLength: 80,
      },
      {
        name: "industry",
        label: "Industry",
        type: "input",
        placeholder: "e.g. Technology, Retail, Finance...",
        maxLength: 60,
      },
      {
        name: "personality",
        label: "Chatbot Personality (optional)",
        type: "input",
        placeholder: "e.g. friendly, professional, witty...",
        maxLength: 60,
      },
      {
        name: "count",
        label: "Number of Names",
        type: "select",
        options: ["5", "10", "15"],
        defaultValue: "10",
      },
    ],
    actionLabel: "Generate Chatbot Names",
    outputLabel: "Generated Chatbot Names",
    icon: "🤖",
    bgColor: "bg-cyan-50",
    iconBg: "bg-cyan-100",
  },
  {
    slug: "ai-saas-brand-name-generator",
    title: "AI SaaS Brand Name Generator",
    category: "AI Generators",
    description:
      "Describe your SaaS product and AI generates unique, memorable brand names with taglines. Find the perfect name for your startup. Free to use.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/ai/saas-brand-name",
    fields: [
      {
        name: "description",
        label: "Product Description",
        type: "textarea",
        placeholder: "Describe what your SaaS product does...",
        required: true,
        maxLength: 1200,
      },
      {
        name: "targetAudience",
        label: "Target Audience (optional)",
        type: "input",
        placeholder: "e.g. small businesses, enterprise teams...",
        maxLength: 80,
      },
      {
        name: "keywords",
        label: "Keywords to Include (optional)",
        type: "input",
        placeholder: "e.g. chat, AI, flow, hub...",
        maxLength: 100,
      },
      {
        name: "count",
        label: "Number of Names",
        type: "select",
        options: ["5", "10", "15"],
        defaultValue: "10",
      },
    ],
    actionLabel: "Generate Brand Names",
    outputLabel: "Generated Brand Names",
    icon: "🚀",
    bgColor: "bg-violet-50",
    iconBg: "bg-violet-100",
  },

  // -------------------------------------------------------------------------
  // OTHER TOOLS
  // -------------------------------------------------------------------------
  {
    slug: "ai-chatbot-conversation-analysis",
    title: "AI Chatbot Conversation Analysis",
    category: "Other Tools",
    description:
      "Paste a chatbot conversation and AI analyzes sentiment, key topics, customer satisfaction, and provides actionable improvement suggestions. Free to use.",
    toolType: TOOL_TYPES.AI_GENERATOR,
    apiEndpoint: "tools/analyze/conversation",
    fields: [
      {
        name: "conversation",
        label: "Chatbot Conversation",
        type: "textarea",
        placeholder: "Paste the chatbot conversation here (User/Bot format)...",
        required: true,
        rows: 12,
        maxLength: 5000,
      },
    ],
    actionLabel: "Analyze Conversation",
    outputLabel: "Conversation Analysis",
    icon: "📊",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    slug: "sitemap-finder-checker",
    title: "Sitemap Finder & Checker",
    category: "Other Tools",
    description:
      "Enter any website URL and instantly find all sitemap files. Checks common sitemap locations automatically. Free to use. No sign up required.",
    toolType: TOOL_TYPES.SITEMAP,
    sitemapMode: "find",
    apiEndpoint: "tools/sitemap/find",
    inputLabel: "Website URL",
    inputPlaceholder: "https:/example.com",
    actionLabel: "Find Sitemaps",
    icon: "🗺️",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100",
  },
  {
    slug: "sitemap-validator",
    title: "Sitemap Validator",
    category: "Other Tools",
    description:
      "Enter your sitemap URL and instantly validate its structure, format, and SEO best practices. Get detailed error reports and warnings. Free to use.",
    toolType: TOOL_TYPES.SITEMAP,
    sitemapMode: "validate",
    apiEndpoint: "tools/sitemap/validate",
    inputLabel: "Sitemap URL",
    inputPlaceholder: "https:/example.com/sitemap.xml",
    actionLabel: "Validate Sitemap",
    icon: "✅",
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    slug: "xml-sitemap-generator",
    title: "XML Sitemap Generator",
    category: "Other Tools",
    description:
      "Enter your website URL and generate a complete XML sitemap by crawling your pages. Download and submit to Google Search Console. Free to use.",
    toolType: TOOL_TYPES.SITEMAP,
    sitemapMode: "generate",
    apiEndpoint: "tools/sitemap/generate",
    inputLabel: "Website URL",
    inputPlaceholder: "https:/example.com",
    actionLabel: "Generate XML Sitemap",
    icon: "🗂️",
    bgColor: "bg-orange-50",
    iconBg: "bg-orange-100",
  },
  {
    slug: "sitemap-url-extractor",
    title: "Sitemap URL Extractor",
    category: "Other Tools",
    description:
      "Enter a sitemap.xml URL and extract all URLs from it. Fast, free, no sign up required. Perfect for SEO analysis and website auditing.",
    toolType: TOOL_TYPES.SITEMAP,
    sitemapMode: "extract-urls",
    apiEndpoint: "tools/sitemap/extract-urls",
    inputLabel: "Sitemap URL",
    inputPlaceholder: "https:/example.com/sitemap.xml",
    actionLabel: "Extract URLs",
    icon: "🔗",
    bgColor: "bg-teal-50",
    iconBg: "bg-teal-100",
  },
  {
    slug: "website-url-extractor",
    title: "Website URL Extractor",
    category: "Other Tools",
    description:
      "Crawl any website and extract all internal and external URLs from the page. Perfect for site mapping, content auditing, and SEO analysis. Free to use.",
    toolType: TOOL_TYPES.SITEMAP,
    sitemapMode: "website-urls",
    apiEndpoint: "tools/website/extract-urls",
    inputLabel: "Website URL",
    inputPlaceholder: "https:/example.com",
    actionLabel: "Extract URLs",
    icon: "🕸️",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    slug: "chatbot-roi-calculator",
    title: "Chatbot ROI Calculator",
    category: "Other Tools",
    description:
      "Calculate the return on investment of deploying an AI chatbot for your business. Enter your numbers and see potential savings and revenue gains. Free.",
    toolType: TOOL_TYPES.ROI_CALCULATOR,
    icon: "💰",
    bgColor: "bg-yellow-50",
    iconBg: "bg-yellow-100",
  },
  {
    slug: "email-signature-generator",
    title: "Email Signature Generator",
    category: "Other Tools",
    description:
      "Create a professional HTML email signature in seconds. Fill in your details, choose a style, and copy the HTML. Free to use. No sign up required.",
    toolType: TOOL_TYPES.EMAIL_SIGNATURE,
    icon: "✍️",
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
];

// ===========================================================================
// Helpers
// ===========================================================================
export const TOOL_CATEGORIES = [
  "Convert to Markdown",
  "AI Chat Tools",
  "AI Generators",
  "Other Tools",
];

export function getToolBySlug(slug) {
  return ALL_TOOLS.find((t) => t.slug === slug) || null;
}

export function getToolsByCategory(category) {
  return ALL_TOOLS.filter((t) => t.category === category);
}

export function getOtherTools(currentSlug, limit = 8) {
  return ALL_TOOLS.filter((t) => t.slug !== currentSlug).slice(0, limit);
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const toolsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Tools Hub -->
  <url><loc>${baseUrl}/tools</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  
  <!-- AI Tools -->
  <url><loc>${baseUrl}/tools/ai-tools/ai-prompt-optimizer</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/ai-tools/ai-reply-generator</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/ai-tools/ai-saas-brand-name-generator</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>

  <!-- Convert to Markdown Tools -->
  <url><loc>${baseUrl}/tools/convert-to-markdown</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-csv-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-docx-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-google-docs-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-html-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-json-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-notion-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-paste-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-pdf-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-rtf-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-webpage-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/convert-to-markdown/convert-xml-to-markdown</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>

  <!-- Other Tools -->
  <url><loc>${baseUrl}/tools/other-tools</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/other-tools/ai-chatbot-conversation-analysis</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/other-tools/chatbot-roi-calculator</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/other-tools/email-signature-generator</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/other-tools/sitemap-finder-checker</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/other-tools/sitemap-url-extractor</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/other-tools/sitemap-validator</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/other-tools/website-url-extractor</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/tools/other-tools/xml-sitemap-generator</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
</urlset>`;

  return new Response(toolsSitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const pagesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Public Pages -->
  <url><loc>${baseUrl}/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/aboutus</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/blog</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/contact</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/features</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/integration</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/landing</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/demo</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/lead-generation</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/partners</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/pricing</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/legal/privacy</loc><priority>0.5</priority><changefreq>yearly</changefreq></url>
  <url><loc>${baseUrl}/legal/refund</loc><priority>0.5</priority><changefreq>yearly</changefreq></url>
  <url><loc>${baseUrl}/legal/terms</loc><priority>0.5</priority><changefreq>yearly</changefreq></url>
  <url><loc>${baseUrl}/legal/subprocesses</loc><priority>0.5</priority><changefreq>yearly</changefreq></url>
  <url><loc>${baseUrl}/legal/dpa</loc><priority>0.5</priority><changefreq>yearly</changefreq></url>
</urlset>`;

  return new Response(pagesSitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

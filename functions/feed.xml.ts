export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const lookupKey = isLocal ? 'wisnu-baskoro-k6uh8' : hostname;
  const origin = `https://${hostname}`;

  let title = "Portal Artikel Kesehatan Orthopedi & Spine";
  let description = "Edukasi kesehatan tulang belakang, intervensi nyeri, dan pemulihan pasca-operasi.";
  let articles: any[] = [];

  try {
    const configRes = await fetch(
      `https://newsletter-api.eka-prasaja.workers.dev/v1/tenant/resolve?hostname=${lookupKey}`
    );
    if (configRes.ok) {
      const tenant = await configRes.json() as any;
      title = `Artikel & Edukasi Medis — ${tenant.name}`;
      description = tenant.seoDescription || tenant.bio || description;
      const tenantId = tenant.id;

      // Fetch dynamic articles
      const articlesRes = await fetch(
        `https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles?limit=25`
      );
      if (articlesRes.ok) {
        const data = await articlesRes.json() as any;
        if (data && Array.isArray(data.articles)) {
          articles = data.articles;
        }
      }
    }
  } catch (e) {
    console.error("Error generating dynamic RSS feed:", e);
  }

  // Construct RSS XML
  const itemsXml = articles.map(art => {
    const articleSlug = art.slug || art.id;
    const itemLink = `${origin}/articles/detail?id=${articleSlug}`;
    const pubDate = art.published_at ? new Date(art.published_at).toUTCString() : new Date().toUTCString();
    
    const cleanTitle = (art.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const cleanExcerpt = (art.excerpt || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return `    <item>
      <title>${cleanTitle}</title>
      <link>${itemLink}</link>
      <guid isPermaLink="true">${itemLink}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cleanExcerpt}</description>
    </item>`;
  }).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title.replace(/&/g, "&amp;")}</title>
    <link>${origin}</link>
    <description>${description.replace(/&/g, "&amp;")}</description>
    <language>id-id</language>
    <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const lookupKey = isLocal ? 'wisnu-baskoro-k6uh8' : hostname;
  const origin = `https://${hostname}`;

  let urls = [
    { loc: `${origin}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${origin}/articles`, changefreq: 'daily', priority: '0.8' },
    { loc: `${origin}/tools`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${origin}/tools/dermatome-tracker`, changefreq: 'weekly', priority: '0.6' },
    { loc: `${origin}/tools/dexterity`, changefreq: 'weekly', priority: '0.6' },
    { loc: `${origin}/tools/edema`, changefreq: 'weekly', priority: '0.6' },
    { loc: `${origin}/tools/recovery`, changefreq: 'weekly', priority: '0.6' },
    { loc: `${origin}/tools/sciatica-radiculopathy`, changefreq: 'weekly', priority: '0.6' },
    { loc: `${origin}/tools/spine`, changefreq: 'weekly', priority: '0.6' },
    { loc: `${origin}/tools/trauma`, changefreq: 'weekly', priority: '0.6' },
    { loc: `${origin}/dashboard`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${origin}/privacy`, changefreq: 'monthly', priority: '0.3' },
    { loc: `${origin}/terms`, changefreq: 'monthly', priority: '0.3' },
  ];

  try {
    const configRes = await fetch(
      `https://newsletter-api.eka-prasaja.workers.dev/v1/tenant/resolve?hostname=${lookupKey}`
    );
    if (configRes.ok) {
      const tenant = await configRes.json() as any;
      const tenantId = tenant.id;

      // Fetch dynamic articles
      const articlesRes = await fetch(
        `https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles?limit=100`
      );
      if (articlesRes.ok) {
        const data = await articlesRes.json() as any;
        if (data && Array.isArray(data.articles)) {
          data.articles.forEach((article: any) => {
            const id = article.slug || article.id;
            urls.push({
              loc: `${origin}/articles/detail?id=${id}`,
              changefreq: 'weekly',
              priority: '0.6'
            });
          });
        }
      }
    }
  } catch (e) {
    console.error("Error generating dynamic sitemap:", e);
  }

  // Construct XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};

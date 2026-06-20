export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;
  const origin = `https://${hostname}`;

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};

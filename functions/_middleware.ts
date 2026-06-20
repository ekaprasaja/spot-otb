export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // Only intercept HTML pages (exclude assets like images, js, css, next files)
  const isHtml = url.pathname === '/' || url.pathname.endsWith('.html') || !url.pathname.includes('.');
  if (!isHtml) {
    return next();
  }

  // Get the static response from Cloudflare Pages storage
  const response = await next();

  // Resolve tenant info based on the host domain
  const hostname = url.hostname;
  const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const lookupKey = isLocal ? 'wisnu-baskoro-k6uh8' : hostname;

  try {
    const configRes = await fetch(
      `https://newsletter-api.eka-prasaja.workers.dev/v1/tenant/resolve?hostname=${lookupKey}`
    );
    if (!configRes.ok) {
      return response;
    }
    const tenant = await configRes.json() as any;

    const title = tenant.seoTitle || `${tenant.name} — ${tenant.whitelabelSub || tenant.specialty}`;
    const description = tenant.seoDescription || tenant.bio || "Portal Digital Dokter Spesialis & Asisten AI Monitoring Mandiri";
    const image = tenant.image || "/images/doctor_profile.webp";

    // Rewrite the HTML using Cloudflare's edge HTMLRewriter
    return new HTMLRewriter()
      .on("title", {
        element(el) {
          el.setInnerContent(title);
        }
      })
      .on("meta[name='description']", {
        element(el) {
          el.setAttribute("content", description);
        }
      })
      .on("meta[property='og:title']", {
        element(el) {
          el.setAttribute("content", title);
        }
      })
      .on("meta[property='og:description']", {
        element(el) {
          el.setAttribute("content", description);
        }
      })
      .on("meta[property='og:image']", {
        element(el) {
          const imgUrl = image.startsWith('http') ? image : `https://${hostname}${image}`;
          el.setAttribute("content", imgUrl);
        }
      })
      .on("meta[name='twitter:title']", {
        element(el) {
          el.setAttribute("content", title);
        }
      })
      .on("meta[name='twitter:description']", {
        element(el) {
          el.setAttribute("content", description);
        }
      })
      .on("meta[name='twitter:image']", {
        element(el) {
          const imgUrl = image.startsWith('http') ? image : `https://${hostname}${image}`;
          el.setAttribute("content", imgUrl);
        }
      })
      .on("head", {
        element(el) {
          // Insert Google Site Verification Token
          if (tenant.googleVerificationToken) {
            el.append(`<meta name="google-site-verification" content="${tenant.googleVerificationToken}" />`, { html: true });
          }
          // Insert Google Analytics (Gtag)
          if (tenant.googleAnalyticsId) {
            el.append(`
              <script async src="https://www.googletagmanager.com/gtag/js?id=${tenant.googleAnalyticsId}"></script>
              <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${tenant.googleAnalyticsId}');
              </script>
            `, { html: true });
          }
          // Insert Facebook Pixel
          if (tenant.facebookPixelId) {
            el.append(`
              <script>
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${tenant.facebookPixelId}');
                fbq('track', 'PageView');
              </script>
            `, { html: true });
          }
        }
      })
      .transform(response);
  } catch (e) {
    return response;
  }
};

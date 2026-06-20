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
      .on("head", {
        element(el) {
          const imgUrl = image.startsWith('http') ? image : `https://${hostname}${image}`;

          // Append SEO Meta Tags
          el.append(`<meta name="description" content="${description}" />`, { html: true });
          el.append(`<meta property="og:title" content="${title}" />`, { html: true });
          el.append(`<meta property="og:description" content="${description}" />`, { html: true });
          el.append(`<meta property="og:image" content="${imgUrl}" />`, { html: true });
          el.append(`<meta property="og:url" content="https://${hostname}${url.pathname}" />`, { html: true });
          el.append(`<meta property="og:type" content="website" />`, { html: true });
          el.append(`<meta property="og:site_name" content="${tenant.name || 'Portal Dokter'}" />`, { html: true });
          
          el.append(`<meta name="twitter:card" content="summary_large_image" />`, { html: true });
          el.append(`<meta name="twitter:title" content="${title}" />`, { html: true });
          el.append(`<meta name="twitter:description" content="${description}" />`, { html: true });
          el.append(`<meta name="twitter:image" content="${imgUrl}" />`, { html: true });

          // Insert JSON-LD Physician Schema
          const physicianSchema = {
            "@context": "https://schema.org",
            "@type": "Physician",
            "@id": `https://${hostname}/#doctor`,
            "name": tenant.doctor_name || tenant.name || "dr. Prahesta Adi Wibowo, Sp.OT",
            "image": imgUrl,
            "url": `https://${hostname}`,
            "telephone": `+${tenant.doctor_whatsapp || tenant.reply_to || ""}`,
            "medicalSpecialty": "Orthopedic",
            "knowsAbout": [
              "Orthopaedic Surgery",
              "Spine Surgery",
              "Minimally Invasive Spine Surgery",
              "Spinal Decompression",
              "Pain Management"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "ID",
              "addressLocality": tenant.clinic_address || "Solo, Jawa Tengah"
            }
          };
          el.append(`<script type="application/ld+json">${JSON.stringify(physicianSchema)}</script>`, { html: true });

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

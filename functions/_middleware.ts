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

    const rawDoctorName = tenant.doctor_name || tenant.name || "";
    const cleanDoctorName = rawDoctorName
      .replace(/^(dr\.|dr|Dr\.|Dr)\s+/i, "")
      .split(",")[0]
      .trim() || "Portal Dokter";

    const isPrahesta = hostname.includes('prahesta.id') || lookupKey.includes('prahesta') || (tenant && (tenant.id === 'prahesta-id' || tenant.chatbotToken === 'spot-otb'));

    let title = tenant.seoTitle || `${tenant.name} — ${tenant.whitelabelSub || tenant.specialty}`;
    let description = tenant.seoDescription || tenant.bio || "Portal Digital Dokter Spesialis & Asisten AI Monitoring Mandiri";
    let image = tenant.image || "/images/doctor_profile.webp";

    if (isPrahesta) {
      if (!tenant.seoTitle) {
        title = "Dokter Tulang Belakang Klaten | dr. Prahesta Adi Wibowo, Sp.OT";
      }
      if (!tenant.seoDescription) {
        description = "Konsultasi dr. Prahesta Adi Wibowo, Sp.OT, spesialis ortopedi tulang belakang di RSUP Soeradji Tirtonegoro Klaten.";
      }
      image = "/images/prahesta.webp";
    }

    const pathname = url.pathname;
    const cleanPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
    
    // Dynamic metadata based on page paths
    if (cleanPath === '/tools') {
      title = isPrahesta 
        ? `Kalkulator Medis & Skrining Mandiri Tulang Belakang — dr. Prahesta Adi Wibowo, Sp.OT`
        : `Kalkulator Medis & Skrining Mandiri — ${cleanDoctorName}`;
      description = isPrahesta
        ? `Gunakan alat kesehatan digital dan kalkulator medis saraf & tulang belakang terpercaya dari dr. Prahesta Adi Wibowo, Sp.OT.`
        : `Gunakan alat kesehatan digital dan kalkulator medis terpercaya dari ${rawDoctorName} untuk pemantauan kesehatan mandiri.`;
    } else if (cleanPath === '/tools/sciatica-radiculopathy') {
      title = isPrahesta
        ? `Sciatica & Radiculopathy Mapper — dr. Prahesta Adi Wibowo, Sp.OT`
        : `Sciatica & Radiculopathy Mapper — ${cleanDoctorName}`;
      description = `Skrining mandiri gejala jepitan saraf pinggang menjalar (sciatica) atau saraf leher oleh ${rawDoctorName}.`;
    } else if (cleanPath === '/tools/dermatome-tracker') {
      title = isPrahesta
        ? `Dermatome Mapper — Peta Sensorik Saraf Tulang Belakang`
        : `Dermatome Pain Tracker — ${cleanDoctorName}`;
      description = `Pemetaan area kebas, kesemutan, atau hilangnya sensasi raba kulit sesuai dermatom saraf spinal oleh ${rawDoctorName}.`;
    } else if (cleanPath === '/tools/dexterity') {
      title = isPrahesta
        ? `Dexterity Test — Skrining Ketangkasan Motorik`
        : `Dexterity Pulse (Uji Motorik Jari) — ${cleanDoctorName}`;
      description = `Uji koordinasi motorik halus jari telunjuk untuk memantau derajat Cervical Myelopathy oleh ${rawDoctorName}.`;
    } else if (cleanPath === '/tools/spine') {
      title = isPrahesta
        ? `Spine ROM Checker — Skrining Mobilitas Tulang Belakang`
        : `Cervical & Lumbar ROM — ${cleanDoctorName}`;
      description = `Evaluasi batas aman leher & pinggang pasca-operasi fusi tulang belakang oleh ${rawDoctorName}.`;
    } else if (cleanPath === '/tools/trauma') {
      title = isPrahesta
        ? `Weight-Bear Guide (Panduan Pasca Trauma) — dr. Prahesta Adi Wibowo, Sp.OT`
        : `Weight-Bear Guide (Panduan Pasca Trauma) — ${cleanDoctorName}`;
      description = `Panduan pembebanan kaki aman bertahap pasca fiksasi internal cedera tulang belakang oleh ${rawDoctorName}.`;
    } else if (cleanPath === '/tools/edema') {
      title = isPrahesta
        ? `Wound & CSF Tracker (Evaluasi Luka Operasi) — dr. Prahesta Adi Wibowo, Sp.OT`
        : `Wound & CSF Tracker (Evaluasi Luka Operasi) — ${cleanDoctorName}`;
      description = `Evaluasi perban luka operasi tulang belakang dari rembesan cairan serebrospinal (CSF) oleh ${rawDoctorName}.`;
    } else if (cleanPath === '/tools/recovery') {
      title = isPrahesta
        ? `VAS & Neuro-Deficit Diary (Evaluasi Nyeri) — dr. Prahesta Adi Wibowo, Sp.OT`
        : `VAS & Neuro-Deficit Diary (Evaluasi Nyeri) — ${cleanDoctorName}`;
      description = `Evaluasi pemulihan harian skala nyeri (VAS) dan jarak berjalan pasca-tindakan injeksi blok saraf oleh ${rawDoctorName}.`;
    } else if (cleanPath === '/articles') {
      title = isPrahesta
        ? `Artikel & Edukasi Kesehatan Tulang Belakang Klaten — dr. Prahesta Adi Wibowo, Sp.OT`
        : `Artikel & Edukasi Kesehatan — ${cleanDoctorName}`;
      description = isPrahesta
        ? `Kumpulan informasi medis, tips kesehatan, dan edukasi tulang belakang terpercaya yang ditulis oleh dr. Prahesta Adi Wibowo, Sp.OT.`
        : `Kumpulan informasi medis, tips kesehatan, dan edukasi terpercaya yang ditulis oleh ${rawDoctorName}.`;
    } else if (cleanPath === '/dashboard') {
      title = `Dashboard Monitoring Pasien — ${cleanDoctorName}`;
      description = `Layanan asisten monitoring pemulihan pasca tindakan medis secara digital oleh ${rawDoctorName}.`;
    } else if (cleanPath === '/privacy') {
      title = isPrahesta
        ? `Kebijakan Privasi — Portal Dokter dr. Prahesta Adi Wibowo, Sp.OT`
        : `Kebijakan Privasi — Portal Dokter ${rawDoctorName}`;
      description = `Kebijakan privasi portal digital dan asisten monitoring kesehatan ${rawDoctorName}.`;
    } else if (cleanPath === '/terms') {
      title = isPrahesta
        ? `Syarat & Ketentuan — Portal Dokter dr. Prahesta Adi Wibowo, Sp.OT`
        : `Syarat & Ketentuan — Portal Dokter ${rawDoctorName}`;
      description = `Syarat dan ketentuan penggunaan layanan portal digital ${rawDoctorName}.`;
    } else if (cleanPath === '/articles/detail') {
      const articleId = url.searchParams.get('id');
      if (articleId) {
        try {
          const articleRes = await fetch(
            `https://newsletter-api.eka-prasaja.workers.dev/v1/${tenant.id || lookupKey}/articles/${articleId}`
          );
          if (articleRes.ok) {
            const article = await articleRes.json() as any;
            if (article && article.title) {
              title = `${article.title} — ${cleanDoctorName}`;
              description = article.excerpt || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 150).trim() + '...' : description);
              if (article.cover_image) {
                image = article.cover_image;
              }
            }
          }
        } catch (err) {
          // Fallback to default articles metadata
        }
      }
    }

    const isArticleDetail = cleanPath.startsWith('/articles/') && cleanPath !== '/articles';

    // Rewrite the HTML using Cloudflare's edge HTMLRewriter
    const transformedResponse = new HTMLRewriter()
      .on("h1", {
        element(el) {
          if (cleanPath === "/" && (tenant.seo_h1 || tenant.seoH1)) {
            el.setInnerContent(tenant.seo_h1 || tenant.seoH1);
          }
        }
      })
      .on("title", {
        element(el) {
          if (!isArticleDetail) el.setInnerContent(title);
        }
      })
      .on("meta[name='description']", {
        element(el) {
          if (!isArticleDetail) el.remove();
        }
      })
      .on("meta[property^='og:']", {
        element(el) {
          if (!isArticleDetail) el.remove();
        }
      })
      .on("meta[name^='twitter:']", {
        element(el) {
          if (!isArticleDetail) el.remove();
        }
      })
      .on("head", {
        element(el) {
          const imgUrl = image.startsWith('http') ? image : `https://${hostname}${image}`;
          const pageUrl = `https://${hostname}${url.pathname}${url.search ? url.search : ''}`;

          // Append Canonical Link
          el.append(`<link rel="canonical" href="${pageUrl}" />`, { html: true });
          // Append hreflang
          el.append(`<link rel="alternate" hreflang="id-ID" href="https://${hostname}${url.pathname}" />`, { html: true });
          
          if (!isArticleDetail) {
            // Append SEO Meta Tags
            el.append(`<meta name="description" content="${description}" />`, { html: true });
            el.append(`<meta name="thumbnail" content="${imgUrl}" />`, { html: true });
            el.append(`<meta property="og:title" content="${title}" />`, { html: true });
            el.append(`<meta property="og:description" content="${description}" />`, { html: true });
            el.append(`<meta property="og:image" content="${imgUrl}" />`, { html: true });
            el.append(`<meta property="og:url" content="${pageUrl}" />`, { html: true });
            el.append(`<meta property="og:type" content="website" />`, { html: true });
            el.append(`<meta property="og:locale" content="id_ID" />`, { html: true });
            el.append(`<meta property="og:site_name" content="${cleanDoctorName}" />`, { html: true });
            
            el.append(`<meta name="twitter:card" content="summary_large_image" />`, { html: true });
            el.append(`<meta name="twitter:title" content="${title}" />`, { html: true });
            el.append(`<meta name="twitter:description" content="${description}" />`, { html: true });
            el.append(`<meta name="twitter:image" content="${imgUrl}" />`, { html: true });
          }

          // BreadcrumbList Schema
          const breadcrumbs: any = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Beranda",
                "item": `https://${hostname}/`
              }
            ]
          };

          if (pathname === '/tools') {
            breadcrumbs.itemListElement.push({
              "@type": "ListItem",
              "position": 2,
              "name": "Kalkulator Medis",
              "item": `https://${hostname}/tools`
            });
          } else if (pathname === '/articles') {
            breadcrumbs.itemListElement.push({
              "@type": "ListItem",
              "position": 2,
              "name": "Artikel Kesehatan",
              "item": `https://${hostname}/articles`
            });
          } else if (pathname === '/articles/detail') {
            breadcrumbs.itemListElement.push({
              "@type": "ListItem",
              "position": 2,
              "name": "Artikel Kesehatan",
              "item": `https://${hostname}/articles`
            });
            breadcrumbs.itemListElement.push({
              "@type": "ListItem",
              "position": 3,
              "name": title.split(" — ")[0] || "Artikel",
              "item": pageUrl
            });
          } else if (pathname === '/dashboard') {
            breadcrumbs.itemListElement.push({
              "@type": "ListItem",
              "position": 2,
              "name": "Dashboard Monitoring",
              "item": `https://${hostname}/dashboard`
            });
          } else if (pathname === '/privacy') {
            breadcrumbs.itemListElement.push({
              "@type": "ListItem",
              "position": 2,
              "name": "Kebijakan Privasi",
              "item": `https://${hostname}/privacy`
            });
          } else if (pathname === '/terms') {
            breadcrumbs.itemListElement.push({
              "@type": "ListItem",
              "position": 2,
              "name": "Syarat & Ketentuan",
              "item": `https://${hostname}/terms`
            });
          }

          el.append(`<script type="application/ld+json">${JSON.stringify(breadcrumbs)}</script>`, { html: true });

          // Insert JSON-LD Physician Schema
          const physicianSchema: any = {
            "@context": "https://schema.org",
            "@type": "Physician",
            "@id": `https://${hostname}/#doctor`,
            "name": tenant.doctor_name || tenant.name || "dr. Prahesta Adi Wibowo, Sp.OT",
            "image": imgUrl,
            "url": `https://${hostname}`,
            "telephone": isPrahesta ? "(0272) 321020" : `+${tenant.doctor_whatsapp || tenant.reply_to || "62812345678"}`,
            "medicalSpecialty": tenant.medical_specialty || "Orthopedic",
            "description": tenant.doctor_description || (isPrahesta ? "Spesialis Orthopedi & Traumatologi, Konsultan Tulang Belakang (Spine Surgeon)" : (tenant.bio || "")),
            "knowsAbout": [
              "Orthopaedic Surgery",
              "Spine Surgery",
              "Minimally Invasive Spine Surgery",
              "Spinal Decompression",
              "Pain Management",
              "Scoliosis",
              "Herniated Disc (HNP)",
              "Low Back Pain",
              "Spinal Stenosis"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "ID",
              "addressLocality": isPrahesta ? "Klaten" : (tenant.clinic_address || "Solo"),
              "addressRegion": "Jawa Tengah",
              "streetAddress": isPrahesta 
                ? "RSUP dr. Soeradji Tirtonegoro, Jl. KRT Dr. Soeradji Tirtonegoro No.1, Klaten"
                : (tenant.clinic_address || "Solo, Jawa Tengah"),
              "postalCode": tenant.postal_code || (isPrahesta ? "57424" : "")
            }
          };

          // Price range & hospital affiliation
          const dbPriceRange = tenant.price_range || (isPrahesta ? "Rp 150.000 - Rp 500.000" : null);
          if (dbPriceRange) {
            physicianSchema.priceRange = dbPriceRange;
          }

          // Opening Hours
          if (tenant.schedules && Array.isArray(tenant.schedules) && tenant.schedules.length > 0) {
            // Mapping dynamic schedules from D1 if available
            const dayMap: { [key: string]: string } = {
              "Senin": "Monday", "Selasa": "Tuesday", "Rabu": "Wednesday", 
              "Kamis": "Thursday", "Jumat": "Friday", "Sabtu": "Saturday", "Minggu": "Sunday"
            };
            physicianSchema.openingHoursSpecification = tenant.schedules.map((sch: any) => ({
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [dayMap[sch.day] || sch.day],
              "opens": sch.timeStart,
              "closes": sch.timeEnd
            }));
          } else if (isPrahesta) {
            physicianSchema.openingHoursSpecification = [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Wednesday"],
                "opens": "08:00",
                "closes": "12:00"
              }
            ];
          }

          // Hospital Affiliation
          const dbHospitalName = tenant.hospital_name || (isPrahesta ? "RSUP dr. Soeradji Tirtonegoro Klaten" : null);
          if (dbHospitalName) {
            physicianSchema.hospitalAffiliation = [
              {
                "@type": "Hospital",
                "name": dbHospitalName,
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "ID",
                  "addressLocality": isPrahesta ? "Klaten" : "Indonesia",
                  "addressRegion": "Jawa Tengah"
                }
              }
            ];
          }

          el.append(`<script type="application/ld+json">${JSON.stringify(physicianSchema)}</script>`, { html: true });

          // Insert Google Site Verification Token
          if (tenant.googleVerificationToken) {
            el.append(`<meta name="google-site-verification" content="${tenant.googleVerificationToken}" />`, { html: true });
          }
          // Insert Google Analytics (GA4 / Gtag)
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

    const secureHeaders = new Headers(transformedResponse.headers);
    secureHeaders.set("X-Frame-Options", "DENY");
    secureHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    secureHeaders.set("X-Content-Type-Options", "nosniff");
    secureHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    secureHeaders.set("Content-Security-Policy", "upgrade-insecure-requests; block-all-mixed-content");

    return new Response(transformedResponse.body, {
      status: transformedResponse.status,
      statusText: transformedResponse.statusText,
      headers: secureHeaders
    });
  } catch (e) {
    return response;
  }
};

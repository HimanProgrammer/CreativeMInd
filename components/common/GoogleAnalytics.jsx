'use client';
import { Suspense, useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

// Fires a page_view on client-side route changes. The gtag `config` snippet
// only reports the first load, so App Router navigations would otherwise be
// invisible in GA.
function PageViews({ gaId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId || typeof window.gtag !== 'function') return;
    const qs = searchParams?.toString();
    window.gtag('event', 'page_view', {
      page_path: pathname + (qs ? `?${qs}` : ''),
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [gaId, pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics({ gaId, adsId }) {
  // Nothing configured (or still the placeholder) — render nothing at all.
  if (!gaId || gaId.includes('XXXX')) return null;

  return (
    <>
      <Script
        id="ga-lib"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
          ${adsId ? `gtag('config', '${adsId}');` : ''}
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViews gaId={gaId} />
      </Suspense>
    </>
  );
}

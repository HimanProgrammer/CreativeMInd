
import './globals.css';
import Script from 'next/script';
import GlobalScrollReveal from '@/components/common/GlobalScrollReveal';
import GoogleAnalytics from '@/components/common/GoogleAnalytics';
import { SITE } from '@/lib/siteConfig';

const SITE_URL = SITE.website.replace(/\/$/, '');

export const metadata = {
  // Resolves relative OG/canonical URLs against the real domain.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CreativeMind IT Solutions — Web, Apps, Branding & Digital Marketing',
    template: '%s | CreativeMind IT Solutions',
  },
  description:
    'CreativeMind IT Solutions builds high-performance websites, mobile apps, brand identities, SEO and social media marketing that grow your business.',
  keywords: [
    'web development', 'mobile app development', 'UI UX design', 'branding',
    'SEO services', 'social media marketing', 'digital agency', 'Pune',
    'CreativeMind IT Solutions',
  ],
  applicationName: 'CreativeMind IT Solutions',
  // Explicitly invite crawling and rich snippets.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'CreativeMind IT Solutions',
    title: 'CreativeMind IT Solutions — Digital Products That Grow Your Business',
    description:
      'Websites, mobile apps, branding, SEO and social media marketing — crafted by CreativeMind IT Solutions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreativeMind IT Solutions',
    description:
      'Websites, mobile apps, branding, SEO and social media marketing that grow your business.',
  },
};

export default function RootLayout({ children }) {
  // Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local (and in Vercel env vars).
  // Fallback = CreativeMind GA4 property 496868533.
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-SETKRT6N43';
  const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17350106214';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect + global fonts — loaded once, cached for all pages */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        />

        {/* Google Analytics 4 + Google Ads (also tracks client-side route changes) */}
        <GoogleAnalytics gaId={GA_ID} adsId={ADS_ID} />

        {/* Facebook Meta Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
              s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
            }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','1476825456779046');
            fbq('track','PageView');
          `}
        </Script>
      </head>
      <body>
        <GlobalScrollReveal />
        {children}
      </body>
    </html>
  );
}

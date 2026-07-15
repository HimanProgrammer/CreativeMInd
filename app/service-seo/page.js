import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import ServicePage from '@/components/service-generic/ServicePage';

export const metadata = {
  title: 'SEO Services - CreativeMind IT Solutions',
  description: 'Rank higher, get found, and grow organic traffic with data-driven SEO that delivers real results.',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

const config = {
  accent: '#16c784',
  accent2: '#2f6bff',
  eyebrow: 'SEARCH ENGINE OPTIMIZATION',
  title: 'Get Found On',
  titleAccent: 'Page One Of Google',
  sub: 'Data-driven SEO that grows your organic traffic month over month. We get you ranking for the keywords that actually bring customers.',
  tags: ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Link Building', 'Local SEO'],
  metrics: [
    { n: '218%', l: 'Avg. Traffic Growth' },
    { n: '#1', l: 'Rankings Achieved' },
    { n: '500+', l: 'Keywords Ranked' },
    { n: '3x', l: 'More Leads' },
  ],
  marquee: ['Google', 'Bing', 'Ahrefs', 'SEMrush', 'Search Console', 'Analytics', 'Schema', 'Core Web Vitals'],
  reasons: [
    { heading: 'Rank for what matters', body: 'We research the exact keywords your customers search — high-intent, low-competition terms that bring qualified traffic, not vanity clicks.', mock: 'search' },
    { heading: 'Traffic that compounds', body: 'SEO is the gift that keeps giving. We build organic growth that snowballs month after month — no ad spend required.', mock: 'chart' },
    { heading: 'Technically flawless', body: 'Site speed, crawlability, structured data, Core Web Vitals — we fix the technical foundation so Google can rank you with confidence.', mock: 'speed' },
    { heading: 'Everything, handled', body: 'On-page, off-page, content, and reporting. A complete SEO engine so you can focus on running your business.', mock: 'checklist' },
  ],
  process: [
    { step: '01', title: 'Audit', desc: 'Deep technical & content audit to find every opportunity.' },
    { step: '02', title: 'Strategy', desc: 'A keyword & content roadmap targeting real buyers.' },
    { step: '03', title: 'Optimize', desc: 'On-page, technical & link building executed monthly.' },
    { step: '04', title: 'Report', desc: 'Transparent rankings & traffic reports every month.' },
  ],
  capabilities: [
    { title: 'On-Page SEO', desc: 'Content, meta, and structure optimized to rank & convert.', icon: '📝' },
    { title: 'Technical SEO', desc: 'Speed, crawlability & Core Web Vitals done right.', icon: '🔧' },
    { title: 'Local SEO', desc: 'Dominate "near me" searches and Google Maps.', icon: '📍' },
  ],
  ctaHeading: 'Ready to rank higher?',
  ctaSub: "Let's get your business found by the customers already searching for you.",
};

export default function SeoPage() {
  return (
    <body className="redesign">
      <CustomCursor />
      <Navbar />
      <main>
        <ServicePage config={config} />
      </main>
      <Footer />
    </body>
  );
}

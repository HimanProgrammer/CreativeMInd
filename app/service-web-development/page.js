import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import ServicePage from '@/components/service-generic/ServicePage';

export const metadata = {
  title: 'Website Development - CreativeMind IT Solutions',
  description: 'Fast, responsive, SEO-ready websites that convert — custom-built with modern tech.',
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
  accent: '#2f6bff',
  accent2: '#6c63ff',
  eyebrow: 'WEBSITE DEVELOPMENT',
  title: 'Websites That',
  titleAccent: 'Convert Visitors',
  sub: 'Fast, responsive, and built to rank. We craft custom websites that look stunning, load instantly, and turn traffic into customers.',
  tags: ['Custom Design', 'Blazing-Fast Load', 'Mobile-First', 'SEO-Ready', 'Secure & Scalable'],
  metrics: [
    { n: '99+', l: 'Lighthouse Score' },
    { n: '1.2s', l: 'Avg. Load Time' },
    { n: '150+', l: 'Sites Shipped' },
    { n: '100%', l: 'Responsive' },
  ],
  marquee: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind', 'WordPress', 'Shopify', 'AWS'],
  reasons: [
    { heading: 'Clean, modern code that lasts', body: 'We build on battle-tested frameworks like React & Next.js — no bloated templates. Maintainable, scalable, and future-proof from day one.', mock: 'code' },
    { heading: 'Built for speed & SEO', body: 'Every site ships with perfect Lighthouse scores, semantic markup, and structured data — so Google loves it and users never bounce.', mock: 'speed' },
    { heading: 'Everything you need, included', body: 'Responsive layouts, secure hosting setup, analytics, and ongoing support. One partner, zero headaches.', mock: 'checklist' },
    { heading: 'A stack that scales with you', body: 'From landing pages to full web apps, we pick the right tools for the job and grow the platform as your business grows.', mock: 'stack' },
  ],
  process: [
    { step: '01', title: 'Discovery', desc: 'We map your goals, audience & content into a clear plan.' },
    { step: '02', title: 'Design', desc: 'Pixel-perfect UI mockups you approve before we build.' },
    { step: '03', title: 'Build', desc: 'Clean, responsive, fast code — tested on every device.' },
    { step: '04', title: 'Launch', desc: 'We deploy, optimize, and support you post-launch.' },
  ],
  capabilities: [
    { title: 'Business Websites', desc: 'Professional sites that establish trust and drive leads.', icon: '🌐' },
    { title: 'Web Applications', desc: 'Custom dashboards, portals & tools built to your workflow.', icon: '⚙️' },
    { title: 'E-Commerce', desc: 'Fast, secure online stores that turn browsers into buyers.', icon: '🛒' },
  ],
  ctaHeading: 'Ready to build your website?',
  ctaSub: "Let's create a site that's fast, beautiful, and built to grow your business.",
};

export default function WebDevelopmentPage() {
  return (
    <div className="redesign">
      <CustomCursor />
      <Navbar />
      <main>
        <ServicePage config={config} />
      </main>
      <Footer />
    </div>
  );
}

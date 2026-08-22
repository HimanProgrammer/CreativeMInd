import generateStylesheetObject from '@/common/generateStylesheetsObject';

import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Hero from '@/components/home-redesign/Hero';
import Brands from '@/components/home-redesign/Brands';
import Services from '@/components/home-redesign/Services';
import BestWork from '@/components/home-redesign/BestWork';
import WhyUs from '@/components/home-redesign/WhyUs';
import HowWeWork from '@/components/home-redesign/HowWeWork';
import Stats from '@/components/home-redesign/Stats';
import Testimonials from '@/components/home-redesign/Testimonials';
import CTABanner from '@/components/home-redesign/CTABanner';
import Footer from '@/components/home-redesign/Footer';

export const metadata = {
  title: 'CreativeMind IT Solutions',
  description: 'Transforming Ideas Into Digital Experiences',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
      'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap',
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
    ]),
  },
};

export default function Home() {
  // A page must never render its own body element — app/layout.js already does
  // one, and the nested tag makes React hoist these attributes onto the real
  // body, which throws a hydration error. This wrapper carries the styling.
  return (
    <div className="redesign" style={{ margin: 0, padding: 0, background: '#fff' }}>
      {/* Custom cursor & scroll animations */}
      <CustomCursor />
      <ScrollReveal />

      {/* Navigation */}
      <Navbar />

      <main>
        <Hero />
        <Brands />
        <Services />
        <BestWork />
        <WhyUs />
        <HowWeWork />
        <Stats />
        <Testimonials />
        <CTABanner />
      </main>

      <Footer />

      {/* Analytics (GA4 + Google Ads) is loaded once site-wide in app/layout.js */}
    </div>
  );
}

import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import Header from '@/components/page-FAQ/Header';
import FAQS from '@/components/page-FAQ/FAQS';
import Numbers from '@/components/page-FAQ/Numbers';
import Testimonials from '@/components/home-creative-agency/Testimonials';
import Clients from '@/components/common/Clients';

export const metadata = {
  title: 'FAQ - CreativeMind IT Solutions',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function FAQPage() {
  return (
    <div className="redesign">
      <CustomCursor />
      <ScrollReveal />
      <Navbar />
      <main>
        <Header />
        <FAQS />
        <Numbers />
        <Testimonials />
        <Clients />
      </main>
      <Footer />
    </div>
  );
}

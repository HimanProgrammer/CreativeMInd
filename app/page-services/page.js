import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import Header from '@/components/page-services/Header';
import Services from '@/components/home-digital-agency/Services';
import Intro2 from '@/components/home-digital-agency/Intro2';
import Numbers from '@/components/page-services/Numbers';
import Testimonials from '@/components/home-digital-agency/Testimonials';
import Blog from '@/components/home-digital-agency/Blog';

export const metadata = {
  title: 'Services - CreativeMind IT Solutions',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/style.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function ServicesPage() {
  return (
    <div className="redesign">
      <CustomCursor />
      <ScrollReveal />
      <Navbar />
      <main>
        <Header />
        <Services />
        <Intro2 />
        <Numbers />
        <Testimonials />
        <Blog />
      </main>
      <Footer />
    </div>
  );
}

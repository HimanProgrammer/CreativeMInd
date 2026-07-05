import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import Header from '@/components/page-about/Header';
import Intro from '@/components/page-about/Intro';
import Numbers from '@/components/page-about/Numbers';
import Services from '@/components/page-about/Services';
import Team from '@/components/home-modern-studio/Team';
import Testimonials from '@/components/home-modern-studio/Testimonials';
import Clients from '@/components/common/Clients';
import Blog from '@/components/home-main/Blog';

export const metadata = {
  title: 'About Us - CreativeMind IT Solutions',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function AboutPage() {
  return (
    <body className="redesign">
      <CustomCursor />
      <ScrollReveal />
      <Navbar />
      <main>
        <Header />
        <Intro />
        <Numbers />
        <Services />
        <Team />
        <Testimonials />
        <Clients />
        <Blog />
      </main>
      <Footer />
    </body>
  );
}

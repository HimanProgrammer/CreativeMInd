import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import Portfolio from '@/components/p-creative-carousel/Portfolio';

export const metadata = {
  title: 'Creative Carousel - CreativeMind IT Solutions',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function CreativeCarouselPage() {
  return (
    <div className="redesign">
      <CustomCursor />
      <ScrollReveal />
      <Navbar />
      <main>
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
}

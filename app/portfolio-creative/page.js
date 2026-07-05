import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import Portfolio from '@/components/p-creative/Portfolio';

export const metadata = {
  title: 'Portfolio Creative - CreativeMind IT Solutions',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function PortfolioCreativePage() {
  return (
    <body className="redesign">
      <CustomCursor />
      <ScrollReveal />
      <Navbar />
      <main>
        <Portfolio />
      </main>
      <Footer />
    </body>
  );
}

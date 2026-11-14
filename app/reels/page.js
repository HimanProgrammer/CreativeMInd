import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import Reels from '@/components/home-redesign/Reels';

export const metadata = {
  title: 'Reels - CreativeMind IT Solutions',
  description: 'Short videos from CreativeMind IT Solutions on websites, apps, SEO and digital growth.',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
    ]),
  },
};

export default function ReelsPage() {
  return (
    <div className="redesign" style={{ background: '#fff' }}>
      <CustomCursor />
      <ScrollReveal />
      <Navbar />
      <main style={{ paddingTop: 100 }}>
        <Reels />
      </main>
      <Footer />
    </div>
  );
}

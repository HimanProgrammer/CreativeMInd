import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import Header from '@/components/page-team/Header';
import Intro from '@/components/page-team/Intro';
import Numbers from '@/components/page-services/Numbers';
import Team from '@/components/home-modern-studio/Team';

export const metadata = {
  title: 'Our Team - CreativeMind IT Solutions',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function TeamPage() {
  return (
    <div className="redesign">
      <CustomCursor />
      <ScrollReveal />
      <Navbar />
      <main>
        <Header />
        <Intro />
        <Numbers />
        <Team />
      </main>
      <Footer />
    </div>
  );
}

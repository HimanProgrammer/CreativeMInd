import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import ContactUpgraded from '@/components/page-contact/ContactUpgraded';
import Map from '@/components/page-contact/Map';

export const metadata = {
  title: 'Contact Us - CreativeMind IT Solutions',
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

export default function ContactPage() {
  return (
    <div className="redesign">
      <CustomCursor />
      <ScrollReveal />
      <Navbar />
      <main>
        <ContactUpgraded />
        <Map />
      </main>
      <Footer />
    </div>
  );
}

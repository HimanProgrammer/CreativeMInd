import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import BrandingPage from '@/components/service-branding/BrandingPage';

export const metadata = {
  title: 'Branding & Identity - CreativeMind IT Solutions',
  description: 'Build a brand that stands out, earns trust, and turns customers into loyal fans.',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function BrandingServiceRoute() {
  return (
    <body className="redesign">
      <CustomCursor />
      <Navbar />
      <main>
        <BrandingPage />
      </main>
      <Footer />
    </body>
  );
}

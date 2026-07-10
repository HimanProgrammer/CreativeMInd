import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import SocialMediaPage from '@/components/service-social/SocialMediaPage';

export const metadata = {
  title: 'Social Media Marketing - CreativeMind IT Solutions',
  description: 'Grow your brand on social media with real, trackable results — views, followers, and content that converts.',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function SocialMediaMarketingPage() {
  return (
    <body className="redesign">
      <CustomCursor />
      <Navbar />
      <main>
        <SocialMediaPage />
      </main>
      <Footer />
    </body>
  );
}

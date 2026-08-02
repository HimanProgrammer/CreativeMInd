import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import AppDevPage from '@/components/service-appdev/AppDevPage';

export const metadata = {
  title: 'App Development - CreativeMind IT Solutions',
  description: 'Native and cross-platform mobile apps that users love — built for iOS and Android.',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function AppDevelopmentPage() {
  return (
    <div className="redesign">
      <CustomCursor />
      <Navbar />
      <main>
        <AppDevPage />
      </main>
      <Footer />
    </div>
  );
}

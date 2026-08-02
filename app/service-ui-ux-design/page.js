import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import UiUxPage from '@/components/service-uiux/UiUxPage';

export const metadata = {
  title: 'UI/UX Design - CreativeMind IT Solutions',
  description: 'Beautiful, intuitive, user-centered design that turns visitors into customers.',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/assets/css/redesign.css',
    ]),
  },
};

export default function UiUxServiceRoute() {
  return (
    <div className="redesign">
      <CustomCursor />
      <Navbar />
      <main>
        <UiUxPage />
      </main>
      <Footer />
    </div>
  );
}

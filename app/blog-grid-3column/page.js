import generateStylesheetObject from '@/common/generateStylesheetsObject';
import CustomCursor from '@/components/home-redesign/CustomCursor';
import ScrollReveal from '@/components/home-redesign/ScrollReveal';
import Navbar from '@/components/home-redesign/Navbar';
import Footer from '@/components/home-redesign/Footer';
import Header from '@/components/blog-grid-3column/Header';
import Blogs from '@/components/blog-grid-3column/Blogs';

export const metadata = {
  title: 'Blog - CreativeMind IT Solutions',
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

export default function BlogGridPage() {
  return (
    <div className="redesign">
      <CustomCursor />
      <ScrollReveal />
      <Navbar />
      <main>
        <Header />
        <Blogs />
      </main>
      <Footer />
    </div>
  );
}

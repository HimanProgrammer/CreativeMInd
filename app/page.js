import generateStylesheetObject from '@/common/generateStylesheetsObject';
import Lines from '@/components/common/Lines';
import ProgressScroll from '@/components/common/ProgressScroll';
import Cursor from '@/components/common/cusor';
import LoadingScreen from '@/components/common/loader';
import Footer from '@/components/common/Footer';
import Header from '@/components/home-creative-agency/Header';
import Navbar from '@/components/common/Navbar';
import Script from 'next/script';
import Services from '@/components/home-creative-agency/Services';
import Intro from '@/components/home-creative-agency/Intro';
import Numbers from '@/components/home-creative-agency/Numbers';
import Portfolio from '@/components/home-creative-agency/Portfolio';
import Intro2 from '@/components/home-creative-agency/Intro2';
import Testimonials from '@/components/home-creative-agency/Testimonials';
import Clients from '@/components/common/Clients';
import Blog from '@/components/home-creative-agency/Blog';
import Marq2 from '@/components/common/Marq2';

export const metadata = {
  title: 'CreativeMind',
  icons: {
    icon: '/assets/imgs/favicon.ico',
    shortcut: '/assets/imgs/favicon.ico',
    other: generateStylesheetObject([
      '/assets/css/plugins.css',
      '/home-creative-agency-preview/css/preview-style.css',
      '/assets/css/style.css',
      'https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap',
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700&display=swap',
    ]),
  },
};

export default function Home() {
  return (
    <body>
      {/* Preloader & Effects */}
      <LoadingScreen />
      <Cursor />
      <ProgressScroll />
      <Lines />

      {/* Navbar */}
      <Navbar />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Header />
            <Intro />
            <Services />
            <Numbers />
            <Portfolio />
            <Testimonials />
            <Clients />
            <Blog />
            <Marq2 />
          </main>
          <Footer />
        </div>
      </div>

      {/* Local Scripts */}
      <Script src="/assets/js/ScrollTrigger.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/ScrollSmoother.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/plugins.js" strategy="beforeInteractive" />
      <Script src="/assets/js/TweenMax.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/charming.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/countdown.js" strategy="beforeInteractive" />
      <Script src="/assets/js/gsap.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/splitting.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/isotope.pkgd.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/imgReveal/imagesloaded.pkgd.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/scripts.js" strategy="afterInteractive" />

      {/* ✅ Google Analytics 4 Tag */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `,
        }}
      />
    </body>
  );
}

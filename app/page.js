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
import Team from '@/components/home-creative-agency/Team';
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
      <LoadingScreen />
      <Cursor />
      <ProgressScroll />
      <Lines />
      <Navbar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Header />
            <Services />
            <Intro />
            <Numbers />
            <Portfolio />
            <Team />
            <Testimonials />
            <Clients />
            <Blog />
            <Marq2 />
          </main>
          <Footer />
        </div>
      </div>
      <Script
        src="/assets/js/ScrollTrigger.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/js/ScrollSmoother.min.js"
        strategy="beforeInteractive"
      />
      <Script strategy="beforeInteractive" src="/assets/js/plugins.js"></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/TweenMax.min.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/charming.min.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/countdown.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/gsap.min.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/splitting.min.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/isotope.pkgd.min.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/imgReveal/imagesloaded.pkgd.min.js"
      ></Script>
      {/* {/* <Script src="/assets/js/smoother-script.js" strategy="lazyOnload" /> */}{' '}
      <Script src="/assets/js/scripts.js"></Script>
    </body>
  );
}

import React from 'react';

const POSTS = [
  {
    img: '/assets/imgs/blog/blog1.jpg',
    date: '12 Jan 2025',
    tag: 'Web Development',
    title: 'Why Your Business Needs a High-Performance Website in 2025',
    excerpt:
      'A slow or outdated website costs you customers every day. We break down the key performance metrics — Core Web Vitals, load speed, and mobile responsiveness — that directly impact your sales and Google ranking.',
  },
  {
    img: '/assets/imgs/blog/blog2.jpg',
    date: '28 Feb 2025',
    tag: 'Mobile Apps',
    title: 'Flutter vs React Native: Which is Right for Your Mobile App?',
    excerpt:
      'Choosing the wrong tech stack for your mobile app can cost months of rework. We compare Flutter and React Native across performance, UI flexibility, and time-to-market so you can make the right call from day one.',
  },
  {
    img: '/assets/imgs/blog/blog4.jpg',
    date: '15 Mar 2025',
    tag: 'UI/UX Design',
    title: '5 UI/UX Mistakes That Are Killing Your App Conversions',
    excerpt:
      'Good-looking is not the same as good-working. From cluttered navigation to confusing CTAs, these five common design mistakes silently drive users away — and how CreativeMind fixes them for clients.',
  },
  {
    img: '/assets/imgs/blog/blog1.jpg',
    date: '02 Apr 2025',
    tag: 'Branding',
    title: 'How a Strong Brand Identity Turns Visitors Into Loyal Customers',
    excerpt:
      'Your brand is the first thing a potential client judges — often before they read a single word. We walk through logo design, colour psychology, and brand voice to show how cohesive identity drives trust and repeat business.',
  },
  {
    img: '/assets/imgs/blog/blog2.jpg',
    date: '20 Apr 2025',
    tag: 'Digital Marketing',
    title: 'SEO in 2025: What Actually Works and What to Stop Doing',
    excerpt:
      'Google\'s algorithm has changed more in the last 12 months than in the previous three years. Discover the content, technical, and link strategies that are driving real organic growth for our clients right now.',
  },
  {
    img: '/assets/imgs/blog/blog4.jpg',
    date: '10 May 2025',
    tag: 'Social Media',
    title: 'Social Media Marketing That Generates Real Leads, Not Just Likes',
    excerpt:
      'Vanity metrics are out. ROI is in. Learn how CreativeMind builds social media strategies that convert followers into enquiries — from paid Meta campaigns to organic LinkedIn content for B2B brands.',
  },
];

function Blogs() {
  return (
    <section className="blog-main section-padding">
      <div className="container">
        <div className="row lg-marg justify-content-around">
          <div className="col-lg-8">
            <div className="md-mb80">
              {POSTS.map((post, i) => (
                <div className={`item${i < POSTS.length - 1 ? ' mb-80' : ''}`} key={i}>
                  <div className="img">
                    <img src={post.img} alt={post.title} />
                  </div>
                  <div className="content">
                    <div className="d-flex align-items-center mb-15">
                      <div className="post-date">{post.date}</div>
                      <div className="commt opacity-7 fz-13 ml-30">
                        <span className="main-color mr-5">{post.tag}</span>
                      </div>
                    </div>
                    <h3 className="mb-15">
                      <a href="/blog-details">{post.title}</a>
                    </h3>
                    <p>{post.excerpt}</p>
                    <a
                      href="/blog-details"
                      className="d-flex align-items-center main-color mt-40"
                    >
                      <span className="text mr-15">Read More</span>
                      <span className="ti-arrow-top-right"></span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="sidebar">
              <div className="widget">
                <h6 className="title-widget">Search Here</h6>
                <div className="search-box">
                  <input type="text" name="search-post" placeholder="Search articles..." />
                  <span className="icon pe-7s-search"></span>
                </div>
              </div>

              <div className="widget catogry">
                <h6 className="title-widget">Categories</h6>
                <ul className="rest">
                  {[
                    ['Web Development', 8],
                    ['Mobile Apps', 5],
                    ['UI/UX Design', 7],
                    ['Branding', 6],
                    ['Digital Marketing', 9],
                    ['Social Media', 4],
                  ].map(([cat, count]) => (
                    <li key={cat}>
                      <span><a href="/blog-grid-sidebar">{cat}</a></span>
                      <span className="ml-auto">{String(count).padStart(2, '0')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget last-post-thum">
                <h6 className="title-widget">Latest Posts</h6>
                {[
                  { img: '/assets/imgs/blog/c1.jpg', tag: 'Web Dev', title: '10 ways to speed up your Next.js website', date: '12 / Jan' },
                  { img: '/assets/imgs/blog/c2.jpg', tag: 'UI/UX', title: 'Building better mobile experiences with Flutter', date: '28 / Feb' },
                  { img: '/assets/imgs/blog/c3.jpg', tag: 'Branding', title: 'How colour psychology shapes brand perception', date: '15 / Mar' },
                ].map((p, i) => (
                  <div className="item d-flex align-items-center" key={i}>
                    <div>
                      <div className="img">
                        <a href="/blog-details">
                          <img src={p.img} alt={p.title} />
                          <span className="date"><span>{p.date}</span></span>
                        </a>
                      </div>
                    </div>
                    <div className="cont">
                      <span className="tag"><a href="/blog-details">{p.tag}</a></span>
                      <h6><a href="/blog-details">{p.title}</a></h6>
                    </div>
                  </div>
                ))}
              </div>

              <div className="widget tags">
                <h6 className="title-widget">Tags</h6>
                <div>
                  {['Web Design', 'Mobile App', 'UI/UX', 'Branding', 'SEO', 'Flutter', 'Next.js', 'Marketing'].map(t => (
                    <a href="/blog-grid-sidebar" key={t}>{t}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Blogs;

import React from 'react';

const POSTS = [
  {
    img: '/assets/imgs/blog/1.jpg',
    date: 'January 12, 2025',
    tag: 'Web Development',
    title: 'Why Your Business Needs a High-Performance Website in 2025',
  },
  {
    img: '/assets/imgs/blog/2.jpg',
    date: 'February 28, 2025',
    tag: 'Mobile Apps',
    title: 'Flutter vs React Native: Which is Right for Your Mobile App?',
  },
  {
    img: '/assets/imgs/blog/3.jpg',
    date: 'March 15, 2025',
    tag: 'UI/UX Design',
    title: '5 UI/UX Mistakes That Are Killing Your App Conversions',
  },
  {
    img: '/assets/imgs/blog/1.jpg',
    date: 'April 02, 2025',
    tag: 'Branding',
    title: 'How a Strong Brand Identity Turns Visitors Into Loyal Customers',
  },
  {
    img: '/assets/imgs/blog/2.jpg',
    date: 'April 20, 2025',
    tag: 'Digital Marketing',
    title: 'SEO in 2025: What Actually Works and What to Stop Doing',
  },
  {
    img: '/assets/imgs/blog/3.jpg',
    date: 'May 10, 2025',
    tag: 'Social Media',
    title: 'Social Media Marketing That Generates Real Leads, Not Just Likes',
  },
];

function Blogs() {
  return (
    <section className="blog-main blog section-padding">
      <div className="container">
        <div className="row">
          {POSTS.map((post, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <div className={`item${i < 3 ? ' mb-50' : ''}`}>
                <div className="img fit-img">
                  <img src={post.img} alt={post.title} />
                </div>
                <div className="cont pt-40">
                  <div className="info sub-title p-color d-flex align-items-center mb-15">
                    <div>
                      <a href="/blog-classic">By : CreativeMind</a>
                    </div>
                    <div className="ml-30">
                      <a href="/blog-classic">{post.date}</a>
                    </div>
                  </div>
                  <span className="main-color fz-12 fw-600 text-uppercase mb-10 d-block"
                    style={{ letterSpacing: '0.1em' }}>
                    {post.tag}
                  </span>
                  <h4 className="fz-24">{post.title}</h4>
                  <a
                    href="/blog-details"
                    className="butn-crev d-flex align-items-center mt-40"
                  >
                    <span className="hover-this">
                      <span className="circle hover-anim">
                        <i className="ti-arrow-top-right"></i>
                      </span>
                    </span>
                    <span className="text">Read more</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blogs;

import React from 'react';

function Blog() {
  return (
    <section className="blog section-padding">
      <div className="container">
        <div className="row xlg-marg">
          <div className="col-lg-8">
            <div className="main-post">
              <div className="item pb-60">
                <article>
                  <div className="text">
                    <p>
                      <span className="spec-letter">Q</span> new report said
                      earlier this week that Apple is working on a brand new
                      laptop. Apple plans to release a 15-inch MacBook Air in
                      2023, a first for the Air series. A trusted Apple insider
                      with a proven track record confirmed that Apple is working
                      on the larger MacBook Air.
                    </p>
                  </div>
                  <div className="text">
                    <p>
                      However, Apple might not include it in the Air series when
                      it launches it. As for the notebook’s release date, the
                      15-inch MacBook isn’t coming soon. It’ll get a late 2023
                      release at best, according to the new claims.
                    </p>
                  </div>
                  <div className="title mt-30">
                    <h4>What sizes do MacBook Airs come in?</h4>
                  </div>
                  <div className="text mt-20">
                    <p>
                      Apple currently sells only one MacBook Air size. The
                      laptop comes in a 13-inch version that matches the
                      pre-2021 13-inch MacBook Pro size. Previously, Apple sold
                      an 11-inch MacBook Air, but the company discontinued that
                      model in 2017.
                    </p>
                  </div>
                </article>

                <div className="post-qoute mt-50">
                  <h6 className="fz-20">
                    <span className="l-block">
                      And the day came when the risk to remain tight in a bud
                      was more painful than the risk it took to blossom.
                    </span>
                    <span className="sub-title mt-20 mb-0"> - UiCamp</span>
                  </h6>
                </div>

                <div className="mb-50 mt-50">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="iner-img sm-mb30">
                        <img src="/assets/imgs/blog/blog1.jpg" alt="" />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="iner-img">
                        <img src="/assets/imgs/blog/blog2.jpg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="title mb-10">
                  <h4>Apple currently sells.</h4>
                </div>

                <div className="text mb-20">
                  <p>
                    A new report said earlier this week that Apple is working on
                    a brand new laptop. Apple plans to release a 15-inch MacBook
                    Air in 2023, a first for the Air series. A trusted Apple
                    insider with a proven track record confirmed that Apple is
                    working on the larger MacBook Air.
                  </p>
                </div>

                <div className="unorder-list mb-30">
                  <h6 className="mb-15">Ordered & Unordered Lists.</h6>
                  <ul className="rest">
                    <li>Yet this above sewed flirted opened ouch</li>
                    <li>Goldfinch realistic sporadic ingenuous</li>
                    <li>
                      Abominable this abidin far successfully then like piquan
                    </li>
                  </ul>
                </div>

                <div className="order-list mb-30">
                  <h6 className="mb-15">Ordered & Unordered Lists.</h6>
                  <ul className="rest">
                    <li>
                      <span>01 -</span> Yet this above sewed flirted opened ouch
                    </li>
                    <li>
                      <span>02 -</span> Goldfinch realistic sporadic ingenuous
                    </li>
                    <li>
                      <span>03 -</span> Abominable this abidin far successfully
                      then like piquan
                    </li>
                  </ul>
                </div>

                <div className="text">
                  <p>
                    However, Apple might not include it in the Air series when
                    it launches it. As for the notebook’s release date, the
                    15-inch MacBook isn’t coming soon. It’ll get a late 2023
                    release at best, according to the new claims.
                  </p>
                </div>
              </div>
              <div className="info-area flex pt-50 bord-thin-top">
                <div>
                  <div className="tags flex">
                    <div className="valign">
                      <span>Tags :</span>
                    </div>
                    <div>
                      <a href="/blog-classic">Tech</a>
                      <a href="/blog-classic">UiCamp</a>
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="share-icon flex">
                    <div className="valign">
                      <span>Share :</span>
                    </div>
                    <div>
                      <a href="https://www.facebook.com/">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="https://www.twitter.com/">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="https://www.youtube.com/">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="author-area mt-50 bord-thin-bottom">
                <div className="flex">
                  <div className="author-img mr-30">
                    <div className="img">
                      <img
                        src="/assets/imgs/blog/author.png"
                        alt=""
                        className="circle-img"
                      />
                    </div>
                  </div>
                  <div className="cont valign">
                    <div className="full-width">
                      <h6 className="fw-600 mb-10">Chris Smith</h6>
                      <p>
                        Nulla eleifend, lectus eu gravida facilisis, ipsum metus
                        faucibus eros, vitae vulputate nibh libero ac metus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="comments-from mt-80">
              <div className="mb-60">
                <h3>Leave a comment</h3>
              </div>
              <form id="contact-form" method="post" action="contact.php">
                <div className="messages"></div>

                <div className="controls row">
                  <div className="col-lg-6">
                    <div className="form-group mb-30">
                      <input
                        id="form_name"
                        type="text"
                        name="name"
                        placeholder="Name"
                        required="required"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group mb-30">
                      <input
                        id="form_email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        required="required"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <textarea
                        id="form_message"
                        name="message"
                        placeholder="Message"
                        rows="4"
                        required="required"
                      ></textarea>
                    </div>
                    <div className="text-center">
                      <div className="mt-30">
                        <button type="submit">
                          <span className="text">Post Comment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="sidebar">
              <div className="widget">
                <h6 className="title-widget">Search Here</h6>
                <div className="search-box">
                  <input type="text" name="search-post" placeholder="Search" />
                  <span className="icon pe-7s-search"></span>
                </div>
              </div>
              <div className="widget catogry">
                <h6 className="title-widget">Categories</h6>
                <ul className="rest">
                  <li>
                    <span>
                      <a href="/blog-grid-sidebar">Business</a>
                    </span>
                    <span className="ml-auto">33</span>
                  </li>
                  <li>
                    <span>
                      <a href="/blog-grid-sidebar">Lifestyle</a>
                    </span>
                    <span className="ml-auto">05</span>
                  </li>
                  <li>
                    <span>
                      <a href="/blog-grid-sidebar">Creative</a>
                    </span>
                    <span className="ml-auto">28</span>
                  </li>
                  <li>
                    <span>
                      <a href="/blog-grid-sidebar">WordPress</a>
                    </span>
                    <span className="ml-auto">17</span>
                  </li>
                  <li>
                    <span>
                      <a href="/blog-grid-sidebar">Design</a>
                    </span>
                    <span className="ml-auto">45</span>
                  </li>
                </ul>
              </div>
              <div className="widget last-post-thum">
                <h6 className="title-widget">latest Posts</h6>
                <div className="item d-flex align-items-center">
                  <div>
                    <div className="img">
                      <a href="/blog-grid-sidebar">
                        <img src="/assets/imgs/blog/c1.jpg" alt="" />
                        <span className="date">
                          <span>
                            14 / <br /> sep
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="cont">
                    <span className="tag">
                      <a href="/blog-grid-sidebar">Web Design</a>
                    </span>
                    <h6>
                      <a href="/blog-grid-sidebar">
                        ways to quickly increase traffic to your website
                      </a>
                    </h6>
                  </div>
                </div>
                <div className="item d-flex align-items-center">
                  <div>
                    <div className="img">
                      <a href="/blog-grid-sidebar">
                        <img src="/assets/imgs/blog/c2.jpg" alt="" />
                        <span className="date">
                          <span>
                            14 / <br /> sep
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="cont">
                    <span className="tag">
                      <a href="/blog-grid-sidebar">Web Design</a>
                    </span>
                    <h6>
                      <a href="/blog-grid-sidebar">
                        breaking the rules: using sqlite to demo web
                      </a>
                    </h6>
                  </div>
                </div>
                <div className="item d-flex align-items-center">
                  <div>
                    <div className="img">
                      <a href="/blog-grid-sidebar">
                        <img src="/assets/imgs/blog/c3.jpg" alt="" />
                        <span className="date">
                          <span>
                            14 / <br /> sep
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="cont">
                    <span className="tag">
                      <a href="/blog-grid-sidebar">Web Design</a>
                    </span>
                    <h6>
                      <a href="/blog-grid-sidebar">
                        building better ui designs with layout grids
                      </a>
                    </h6>
                  </div>
                </div>
              </div>
              <div className="widget tags">
                <h6 className="title-widget">Tags</h6>
                <div>
                  <a href="/blog-grid-sidebar">Creative</a>
                  <a href="/blog-grid-sidebar">Design</a>
                  <a href="/blog-grid-sidebar">Dark & Light</a>
                  <a href="/blog-grid-sidebar">Minimal</a>
                  <a href="/blog-grid-sidebar">Infolio</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Blog;

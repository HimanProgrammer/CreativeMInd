/*-----------------------------------------------------------------------------------

    Theme Name: Webfolio
    Theme URI: http://
    Description: Creative Agency & Portfolio
    Author: UiCamp
    Author URI: http://themeforest.net/user/UiCamp
    Version: 1.0

-----------------------------------------------------------------------------------*/

$(function () {
  'use strict';

  var wind = $(window);

  /* =============================================================================
    -----------------------------  Smooth Scroll nav   -----------------------------
    ============================================================================= */

  $.scrollIt({
    upKey: 38, // key code to navigate to the next section
    downKey: 40, // key code to navigate to the previous section
    easing: 'linear', // the easing function for animation
    scrollTime: 600, // how long (in ms) the animation takes
    activeClass: 'active', // class given to the active nav element
    onPageChange: null, // function(pageIndex) that is called when page is changed
    topOffset: -75, // offste (in px) for fixed top navigation
  });

  /* =============================================================================
    --------------------------------  Navbar Menu   --------------------------------
    ============================================================================= */

  $('.navbar .dropdown').hover(
    function () {
      $(this).find('.dropdown-menu').addClass('show');
    },
    function () {
      $(this).find('.dropdown-menu').removeClass('show');
    }
  );

  $('.navbar .dropdown-item').hover(
    function () {
      $(this).find('.dropdown-side').addClass('show');
    },
    function () {
      $(this).find('.dropdown-side').removeClass('show');
    }
  );

  $('.navbar .search-form').on('click', '.search-icon', function () {
    $('.navbar .search-form').toggleClass('open');

    if ($('.navbar .search-form').hasClass('open')) {
      $('.search-form .close-search').slideDown();
    } else {
      $('.search-form .close-search').slideUp();
    }
  });

  $('.navbar').on('click', '.navbar-toggler', function () {
    $('.navbar .navbar-collapse').toggleClass('show');
  });

  wind.on('scroll', function () {
    var bodyScroll = wind.scrollTop(),
      navbar = $('.navbar'),
      logo = $('.navbar.change .logo> img');

    if (bodyScroll > 300) {
      navbar.addClass('nav-scroll');
      logo.attr('src', 'assets/imgs/logo-dark.png');
    } else {
      navbar.removeClass('nav-scroll');
      logo.attr('src', 'assets/imgs/logo-light.png');
    }
  });

  function noScroll() {
    window.scrollTo(0, 0);
  }

  $('.navbar .menu-icon').on('click', function () {
    $('.hamenu').addClass('open');

    $('.hamenu').animate({ left: 0 });
  });

  $('.hamenu .close-menu, .one-scroll .menu-links .main-menu > li').on(
    'click',
    function () {
      $('.hamenu').removeClass('open').delay(300).animate({ left: '-100%' });
      $(
        '.hamenu .menu-links .main-menu .dmenu, .hamenu .menu-links .main-menu .sub-dmenu'
      ).removeClass('dopen');
      $(
        '.hamenu .menu-links .main-menu .sub-menu, .hamenu .menu-links .main-menu .sub-menu2'
      ).slideUp();
    }
  );

  $('.hamenu .menu-links .main-menu > li').on('mouseenter', function () {
    $(this).removeClass('hoverd').siblings().addClass('hoverd');
  });

  $('.hamenu .menu-links .main-menu > li').on('mouseleave', function () {
    $(this).removeClass('hoverd').siblings().removeClass('hoverd');
  });

  $('.main-menu > li .dmenu').on('click', function () {
    $(this)
      .parent()
      .parent()
      .find('.sub-menu')
      .toggleClass('sub-open')
      .slideToggle();
    $(this).toggleClass('dopen');
  });

  $('.sub-menu > ul > li .sub-dmenu').on('click', function () {
    $(this)
      .parent()
      .parent()
      .find('.sub-menu2')
      .toggleClass('sub-open')
      .slideToggle();
    $(this).toggleClass('dopen');
  });

  /* =============================================================================
    ------------------------------  Parallax Swiper   ------------------------------
    ============================================================================= */

  var parallaxSlider;
  var parallaxSliderOptions = {
    speed: 1500,
    autoplay: {
      delay: 5000,
    },
    parallax: true,
    loop: true,

    on: {
      init: function () {
        var swiper = this;
        for (var i = 0; i < swiper.slides.length; i++) {
          $(swiper.slides[i])
            .find('.bg-img')
            .attr({
              'data-swiper-parallax': 0.75 * swiper.width,
            });
        }
      },
      resize: function () {
        this.update();
      },
    },

    pagination: {
      el: '.slider-prlx .swiper-pagination',
      type: 'fraction',
      clickable: true,
    },

    navigation: {
      nextEl: '.slider-prlx .swiper-button-next',
      prevEl: '.slider-prlx .swiper-button-prev',
    },
  };
  parallaxSlider = new Swiper(
    '.slider-prlx .parallax-slider',
    parallaxSliderOptions
  );

  var parallaxShowCase;
  var parallaxShowCaseOptions = {
    speed: 1500,
    autoplay: {
      delay: 5000,
    },
    parallax: true,
    mousewheel: true,
    loop: true,

    on: {
      init: function () {
        var swiper = this;
        for (var i = 0; i < swiper.slides.length; i++) {
          $(swiper.slides[i])
            .find('.bg-img')
            .attr({
              'data-swiper-parallax': 0.75 * swiper.width,
            });
        }
      },
      resize: function () {
        this.update();
      },
    },

    pagination: {
      el: '.full-showcase .parallax-slider .swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        return (
          '<span class="' +
          className +
          '">' +
          '<svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">' +
          '<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"' +
          'stroke-opacity="1" stroke-width="1px"></circle>' +
          '<circle cx="8" cy="8" r="3" fill="#FFF"></circle>' +
          '</svg></span>'
        );
      },
    },

    navigation: {
      nextEl: '.full-showcase .parallax-slider .swiper-button-next',
      prevEl: '.full-showcase .parallax-slider .swiper-button-prev',
    },
  };
  parallaxShowCase = new Swiper(
    '.full-showcase .parallax-slider',
    parallaxShowCaseOptions
  );

  /* ===============================  Carousel slider  =============================== */

  var galleryText = new Swiper(
    '.carousel-slider .gallery-text .swiper-container',
    {
      spaceBetween: 30,
      slidesPerView: 1,
      direction: 'vertical',
      loop: true,
      loopedSlides: 4,
      touchRatio: 0.2,
      slideToClickedSlide: true,
      mousewheel: true,
      speed: 1500,
    }
  );

  var galleryImg = new Swiper(
    '.carousel-slider .gallery-img .swiper-container',
    {
      spaceBetween: 80,
      slidesPerView: 2,
      centeredSlides: true,
      loop: true,
      loopedSlides: 4,
      mousewheel: true,
      speed: 1500,
      navigation: {
        nextEl: '.carousel-slider .swiper-controls .swiper-button-next',
        prevEl: '.carousel-slider .swiper-controls .swiper-button-prev',
      },
      pagination: {
        el: '.carousel-slider .swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return (
            '<span class="' +
            className +
            '">' +
            '<svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">' +
            '<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"' +
            'stroke-opacity="1" stroke-width="1px"></circle>' +
            '<circle cx="8" cy="8" r="3" fill="#FFF"></circle>' +
            '</svg></span>'
          );
        },
      },
      keyboard: {
        enabled: true,
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 2,
        },
      },
    }
  );

  galleryImg.on('slideChangeTransitionStart', function () {
    galleryText.slideTo(galleryImg.activeIndex);
  });
  galleryText.on('transitionStart', function () {
    galleryImg.slideTo(galleryText.activeIndex);
  });

  /* ===============================  Modern slider  =============================== */

  var galleryTextModern = new Swiper(
    '.modern-slider .gallery-text .swiper-container',
    {
      spaceBetween: 30,
      slidesPerView: 1,
      direction: 'vertical',
      loop: true,
      loopedSlides: 4,
      touchRatio: 0.2,
      slideToClickedSlide: true,
      mousewheel: true,
      speed: 1500,
    }
  );

  var galleryImgModern = new Swiper(
    '.modern-slider .gallery-img .swiper-container',
    {
      spaceBetween: 0,
      slidesPerView: 1,
      effect: 'fade',
      loop: true,
      loopedSlides: 4,
      mousewheel: true,
      speed: 1500,
      navigation: {
        nextEl: '.modern-slider .swiper-controls .swiper-button-next',
        prevEl: '.modern-slider .swiper-controls .swiper-button-prev',
      },
      pagination: {
        el: '.modern-slider .swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return (
            '<span class="' +
            className +
            '">' +
            '<svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">' +
            '<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"' +
            'stroke-opacity="1" stroke-width="1px"></circle>' +
            '<circle cx="8" cy="8" r="3" fill="#FFF"></circle>' +
            '</svg></span>'
          );
        },
      },
      keyboard: {
        enabled: true,
      },
    }
  );

  galleryImgModern.on('slideChangeTransitionStart', function () {
    galleryTextModern.slideTo(galleryImgModern.activeIndex);
  });
  galleryTextModern.on('transitionStart', function () {
    galleryImgModern.slideTo(galleryTextModern.activeIndex);
  });

  /* =============================================================================
    ------------------------------  work fade   -----------------------------
    ============================================================================= */

  var workFade = new Swiper('.work-fade .swiper-container', {
    spaceBetween: 30,
    slidesPerView: 1,
    loop: true,
    touchRatio: 0.2,
    mousewheel: true,
    speed: 1500,
    effect: 'fade',

    pagination: {
      el: '.work-fade .swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        return (
          '<span class="' +
          className +
          '">' +
          '<svg class="fp-arc-loader" width="40" height="40" viewBox="0 0 16 16">' +
          '<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"' +
          'stroke-opacity="1" stroke-width="1px"></circle>' +
          '</svg></span>'
        );
      },
    },
  });

  /* =============================================================================
    ------------------------------  work fade   -----------------------------
    ============================================================================= */

  var workCrev = new Swiper('.work-crev .work-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 80,
    loop: true,
    touchRatio: 0.2,
    speed: 1500,

    pagination: {
      el: '.work-crev .swiper-pagination',
      type: 'progressbar',
    },

    navigation: {
      nextEl: '.work-crev .swiper-button-next',
      prevEl: '.work-crev .swiper-button-prev',
    },
  });

  /* =============================================================================
    ------------------------------  work Card   -----------------------------
    ============================================================================= */

  $(function () {
    let cards = gsap.utils.toArray('.cards .card-item');

    let stickDistance = 0;

    let firstCardST = ScrollTrigger.create({
      trigger: cards[0],
      start: 'center center',
    });

    let lastCardST = ScrollTrigger.create({
      trigger: cards[cards.length - 1],
      start: 'bottom bottom',
    });

    cards.forEach((card, index) => {
      var scale = 1 - (cards.length - index) * 0.025;
      let scaleDown = gsap.to(card, {
        scale: scale,
        'transform-origin': '"50% ' + (lastCardST.start + stickDistance) + '"',
      });

      ScrollTrigger.create({
        trigger: card,
        start: 'center center',
        end: () => lastCardST.start + stickDistance,
        pin: true,
        pinSpacing: false,
        ease: 'none',
        animation: scaleDown,
        toggleActions: 'restart none none reverse',
      });
    });
  });

  /* =============================================================================
    ------------------------------  Data Background   ------------------------------
    ============================================================================= */

  var pageSection = $('.bg-img, section');
  pageSection.each(function (indx) {
    if ($(this).attr('data-background')) {
      $(this).css(
        'background-image',
        'url(' + $(this).data('background') + ')'
      );
    }
  });

  var pageSectionColor = $('.bg-solid-color, section');
  pageSectionColor.each(function (indx) {
    var color = $(this).attr('data-solid-color');

    if ($(this).attr('data-solid-color')) {
      $(this).css('background-color', color);
    }
  });

  /* =============================================================================
    ------------------------------  Interactive work   -----------------------------
    ============================================================================= */

  $('.inter-fixed-text .links-img .img').on('mouseenter', function () {
    var tab_id = $(this).attr('data-tab');
    $('.links-img .img').removeClass('current');
    $(this).addClass('current');

    $('.links-text li').removeClass('current');
    $('#' + tab_id).addClass('current');

    if ($(this).hasClass('current')) {
      return false;
    }
  });

  $('.inter-fixed-text .links-img .img').on('mouseleave', function () {
    $('.links-text li').removeClass('current');
    $('.links-img .img').removeClass('current');
  });

  /* =============================================================================
    -----------------------------------  Tabs  -------------------------------------
    ============================================================================= */

  $('#tabs .tab-links').on('click', '.item-link', function () {
    var tab_id = $(this).attr('data-tab');

    $('#tabs .tab-links .item-link').removeClass('current');
    $(this).addClass('current');

    $('.tab-content').hide();
    $('#' + tab_id).show();
  });

  $('#tabs-fade .tab-links').on('click', '.item-link', function () {
    var tab2_id = $(this).attr('data-tab');

    $('#tabs-fade .tab-links .item-link').removeClass('current');
    $(this).addClass('current');

    $('.tab-content').fadeOut();
    $('#' + tab2_id).fadeIn();
  });

  /* ===============================  Work Tabs  =============================== */

  $('.portfolio-tab .cluom').on('mouseenter', function () {
    var tab_id = $(this).attr('data-tab');
    $('.portfolio-tab .cluom').removeClass('current');
    $(this).addClass('current');

    $('.portfolio-tab .glry-img .tab-img ').removeClass('current');
    $('#' + tab_id).addClass('current');

    if ($(this).hasClass('current')) {
      return false;
    }
  });

  /* =============================================================================
    --------------------------------  Accordion Side  -----------------------------------
    ============================================================================= */

  $('.services-modern, .portfolio-crev').on('click', '.item', function () {
    $(this).addClass('active').siblings().removeClass('active');
  });

  /* =============================================================================
    --------------------------------  Accordion  -----------------------------------
    ============================================================================= */

  $('.accordion').on('click', '.title', function () {
    $(this).next().slideDown();

    $('.accordion-info').not($(this).next()).slideUp();
  });

  $('.accordion').on('click', '.item', function () {
    $(this).addClass('active').siblings().removeClass('active');
  });

  /* =============================================================================
    ---------------------------------  Tolltip  ------------------------------------
    ============================================================================= */

  $('[data-tooltip-tit]')
    .hover(
      function () {
        $('<div class="div-tooltip-tit"></div>')
          .text($(this).attr('data-tooltip-tit'))
          .appendTo('body')
          .fadeIn();
      },
      function () {
        $('.div-tooltip-tit').remove();
      }
    )
    .mousemove(function (e) {
      $('.div-tooltip-tit').css({ top: e.pageY + 10, left: e.pageX + 20 });
    });

  $('[data-tooltip-sub]')
    .hover(
      function () {
        $('<div class="div-tooltip-sub"></div>')
          .text($(this).attr('data-tooltip-sub'))
          .appendTo('body')
          .fadeIn();
      },
      function () {
        $('.div-tooltip-sub').remove();
      }
    )
    .mousemove(function (e) {
      $('.div-tooltip-sub').css({ top: e.pageY + -20, left: e.pageX + 30 });
    });

  /* =============================================================================
    -------------------------------  Progress Bar  ---------------------------------
    ============================================================================= */

  wind.on('scroll', function () {
    $('.skill-progress .progres').each(function () {
      var bottom_of_object = $(this).offset().top + $(this).outerHeight();
      var bottom_of_window = $(window).scrollTop() + $(window).height();
      var myVal = $(this).attr('data-value');
      if (bottom_of_window > bottom_of_object) {
        $(this).css({
          width: myVal,
        });
      }
    });
  });

  /* =============================================================================
    ------------------------------  Parallax Items   -----------------------------
    ============================================================================= */

  // Get the target elements
  const parallaxTargets = document.querySelectorAll('.parallax');

  // Get the mouse position
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  // Update the target elements' position on each animation frame
  let rafId = null;
  function updateParallax() {
    // Loop through each target element
    parallaxTargets.forEach((target) => {
      // Get the target's speed
      let speed = target.dataset.speed;

      // Calculate the new position based on the mouse position and speed
      let x = (window.innerWidth / 2 - mouseX) * speed;
      let y = (window.innerHeight / 2 - mouseY) * speed;
      target.style.transform = `translate3d(${x / 10}rem, ${y / 10}rem, 0)`;
    });

    // Schedule the next animation frame
    rafId = requestAnimationFrame(updateParallax);
  }

  // Start the parallax animation
  updateParallax();

  /* =============================================================================
    -----------------------------  Trigger Plugins  --------------------------------
    ============================================================================= */

  /* ========== Sticky ========== */

  $('.sticky-item').stick_in_parent();

  /* ========== YouTubePopUp ========== */

  $('a.vid').YouTubePopUp();
});

/* =============================================================================
-----------------------------  cursor Animation  -----------------------------
============================================================================= */

(function () {
  const link = document.querySelectorAll('.hover-this');
  const cursor = document.querySelector('.cursor');
  const animateit = function (e) {
    const hoverAnim = this.querySelector('.hover-anim');
    const { offsetX: x, offsetY: y } = e,
      { offsetWidth: width, offsetHeight: height } = this,
      move = 25,
      xMove = (x / width) * (move * 2) - move,
      yMove = (y / height) * (move * 2) - move;
    hoverAnim.style.transform = `translate(${xMove}px, ${yMove}px)`;
    if (e.type === 'mouseleave') hoverAnim.style.transform = '';
  };
  const editCursor = (e) => {
    const { clientX: x, clientY: y } = e;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  };
  link.forEach((b) => b.addEventListener('mousemove', animateit));
  link.forEach((b) => b.addEventListener('mouseleave', animateit));
  window.addEventListener('mousemove', editCursor);

  $('a, .cursor-pointer').hover(
    function () {
      $('.cursor').addClass('cursor-active');
    },
    function () {
      $('.cursor').removeClass('cursor-active');
    }
  );

  /* =============================================================================
    -----------------------------  Text Animation  -----------------------------
    ============================================================================= */

  let elements = document.querySelectorAll('.rolling-text');

  elements.forEach((element) => {
    let innerText = element.innerText;
    element.innerHTML = '';

    let textContainer = document.createElement('div');
    textContainer.classList.add('block');

    for (let letter of innerText) {
      let span = document.createElement('span');
      span.innerText = letter.trim() === '' ? '\xa0' : letter;
      span.classList.add('letter');
      textContainer.appendChild(span);
    }

    element.appendChild(textContainer);
    element.appendChild(textContainer.cloneNode(true));
  });

  elements.forEach((element) => {
    element.addEventListener('mouseover', () => {
      element.classList.remove('play');
    });
  });
})();

/* =============================================================================
////////////////////////////////////////////////////////////////////////////////
============================================================================= */

$(window).on('load', function () {
  /* =============================================================================
    ------------------------------  Parallax image  --------------------------------
    ============================================================================= */

  var imageUp = document.getElementsByClassName('thumparallax');
  new simpleParallax(imageUp, {
    delay: 1,
    scale: 1.2,
  });

  var imageDown = document.getElementsByClassName('thumparallax-down');
  new simpleParallax(imageDown, {
    orientation: 'down',
    delay: 1,
    scale: 1.2,
  });

  /* =============================================================================
    -----------------------------  isotope Masonery   ------------------------------
    ============================================================================= */

  $('.gallery').isotope({
    itemSelector: '.items',
  });

  // isotope
  $('.gallery2').isotope({
    // options
    itemSelector: '.items',
    masonry: {
      // use element for option
      columnWidth: '.width2',
    },
  });

  var $gallery = $('.gallery , .gallery2').isotope();

  $('.filtering').on('click', 'span', function () {
    var filterValue = $(this).attr('dataFilter');
    $gallery.isotope({ filter: filterValue });
  });

  $('.filtering').on('click', 'span', function () {
    $(this).addClass('active').siblings().removeClass('active');
  });

  /* =============================================================================
    -----------------------------  Contact Valdition   -----------------------------
    ============================================================================= */

  $('#contact-form').validator();

  $('#contact-form').on('submit', function (e) {
    if (!e.isDefaultPrevented()) {
      var url = 'contact.php';

      $.ajax({
        type: 'POST',
        url: url,
        data: $(this).serialize(),
        success: function (data) {
          var messageAlert = 'alert-' + data.type;
          var messageText = data.message;

          var alertBox =
            '<div class="alert ' +
            messageAlert +
            ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
            messageText +
            '</div>';
          if (messageAlert && messageText) {
            $('#contact-form').find('.messages').html(alertBox);
            $('#contact-form')[0].reset();
          }
        },
      });
      return false;
    }
  });
});

/* =============================================================================
-----------------------------  Button scroll up   ------------------------------
============================================================================= */

$(document).ready(function () {
  'use strict';

  var progressPath = document.querySelector('.progress-wrap path');
  var pathLength = progressPath.getTotalLength();
  progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
  progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
  progressPath.style.strokeDashoffset = pathLength;
  progressPath.getBoundingClientRect();
  progressPath.style.transition = progressPath.style.WebkitTransition =
    'stroke-dashoffset 10ms linear';
  var updateProgress = function () {
    var scroll = $(window).scrollTop();
    var height = $(document).height() - $(window).height();
    var progress = pathLength - (scroll * pathLength) / height;
    progressPath.style.strokeDashoffset = progress;
  };
  updateProgress();
  $(window).scroll(updateProgress);
  var offset = 150;
  var duration = 550;
  jQuery(window).on('scroll', function () {
    if (jQuery(this).scrollTop() > offset) {
      jQuery('.progress-wrap').addClass('active-progress');
    } else {
      jQuery('.progress-wrap').removeClass('active-progress');
    }
  });
  jQuery('.progress-wrap').on('click', function (event) {
    event.preventDefault();
    jQuery('html, body').animate({ scrollTop: 0 }, duration);
    return false;
  });
});

/* =============================================================================
-------------------------------  Wow Animation   -------------------------------
============================================================================= */

wow = new WOW({
  animateClass: 'animated',
  offset: 100,
});
wow.init();

/* =============================================================================
////////////////////////////////////////////////////////////////////////////////
============================================================================= */

$(function () {
  'use strict';

  /* ===============================  fixed-slider  =============================== */

  var slidHeight = $('.fixed-slider').outerHeight();

  $('.main-content').css({
    marginTop: slidHeight,
  });

  /* =============================================================================
    ----------------------------  Swiper Data Controls   ---------------------------
    ============================================================================= */

  $('[data-carousel="swiper"]').each(function () {
    var containe = $(this).find('[data-swiper="container"]').attr('id');
    var pagination = $(this).find('[data-swiper="pagination"]').attr('id');
    var prev = $(this).find('[data-swiper="prev"]').attr('id');
    var next = $(this).find('[data-swiper="next"]').attr('id');
    var items = $(this).data('items');
    var autoplay = $(this).data('autoplay');
    var iSlide = $(this).data('initial');
    var loop = $(this).data('loop');
    var parallax = $(this).data('parallax');
    var space = $(this).data('space');
    var speed = $(this).data('swiper-speed');
    var center = $(this).data('center');
    var effect = $(this).data('effect');
    var direction = $(this).data('direction');
    var mousewheel = $(this).data('mousewheel');

    // Configuration
    var conf = {};

    // Responsive
    if ($(this).hasClass('swiper5')) {
      var conf = {
        breakpoints: {
          0: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          },
        },
      };
    }

    if ($(this).hasClass('swiper4')) {
      var conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        },
      };
    }

    if ($(this).hasClass('serv-swiper')) {
      var conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },

        navigation: {
          nextEl: '.services .swiper-button-next',
          prevEl: '.services .swiper-button-prev',
        },
      };
    }

    if ($(this).hasClass('testim-swiper3')) {
      var conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 'auto',
          },
        },

        navigation: {
          nextEl: '.testim-modern .swiper-button-next',
          prevEl: '.testim-modern .swiper-button-prev',
        },
      };
    }

    if ($(this).hasClass('work-swiper-auto')) {
      var conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 'auto',
          },
        },

        navigation: {
          nextEl: '.portfolio-carsouel .swiper-button-next',
          prevEl: '.portfolio-carsouel .swiper-button-prev',
        },
      };
    }

    if ($(this).hasClass('work-swiper-center')) {
      var conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 50,
          },
          1024: {
            slidesPerView: 2,
          },
        },

        pagination: {
          el: '.portfolio-carsouel .swiper-pagination',
          clickable: true,
        },

        navigation: {
          nextEl: '.portfolio-carsouel .swiper-button-next',
          prevEl: '.portfolio-carsouel .swiper-button-prev',
        },
      };
    }

    if ($(this).hasClass('testim-swiper')) {
      var conf = {
        pagination: {
          el: '.testimonials-minim .swiper-pagination',
          clickable: true,
        },

        navigation: {
          nextEl: '.testimonials-minim .swiper-button-next',
          prevEl: '.testimonials-minim .swiper-button-prev',
        },
      };
    }

    if ($(this).hasClass('testim1')) {
      var conf = {
        pagination: {
          el: '.testimonials-crev .swiper-pagination',
          clickable: true,
        },

        navigation: {
          nextEl: '.testimonials-crev .swiper-button-next',
          prevEl: '.testimonials-crev .swiper-button-prev',
        },
      };
    }

    if ($(this).hasClass('testim-swiper2')) {
      var conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 2,
          },
        },

        pagination: {
          el: '.testim-swiper2 .swiper-pagination',
          clickable: true,
        },

        navigation: {
          nextEl: '.testim-controls .swiper-button-next',
          prevEl: '.testim-controls .swiper-button-prev',
        },
      };
    }

    if ($(this).hasClass('testim2')) {
      var conf = {
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 2,
          },
        },

        pagination: {
          el: '.testim-crev .swiper-pagination',
          clickable: true,
        },

        navigation: {
          nextEl: '.testim-crev .swiper-button-next',
          prevEl: '.testim-crev .swiper-button-prev',
        },
      };
    }

    if (items) {
      conf.slidesPerView = items;
    }
    if (autoplay) {
      conf.autoplay = autoplay;
    }
    if (iSlide) {
      conf.initialSlide = iSlide;
    }
    if (center) {
      conf.centeredSlides = center;
    }
    if (loop) {
      conf.loop = loop;
    }
    if (parallax) {
      conf.parallax = parallax;
    }
    if (space) {
      conf.spaceBetween = space;
    }
    if (speed) {
      conf.speed = speed;
    }
    if (mousewheel) {
      conf.mousewheel = mousewheel;
    }
    if (effect) {
      conf.effect = effect;
    }
    if (direction) {
      conf.direction = direction;
    }
    if (prev) {
      conf.prevButton = '#' + prev;
    }
    if (next) {
      conf.nextButton = '#' + next;
    }
    if (pagination) {
      (conf.pagination = '#' + pagination), (conf.paginationClickable = true);
    }

    // Initialization
    if (containe) {
      var initID = '#' + containe;
      var init = new Swiper(initID, conf);
    }
  });

  /* =============================================================================
    -------------------------------  Preloader svg   -------------------------------
    ============================================================================= */

  const svg = document.getElementById('svg');
  const tl = gsap.timeline();
  const curve = 'M0 502S175 272 500 272s500 230 500 230V0H0Z';
  const flat = 'M0 2S175 1 500 1s500 1 500 1V0H0Z';

  tl.to('.loader-wrap-heading .load-text , .loader-wrap-heading .cont', {
    delay: 1.5,
    y: -100,
    opacity: 0,
  });
  tl.to(svg, {
    duration: 0.5,
    attr: { d: curve },
    ease: 'power2.easeIn',
  }).to(svg, {
    duration: 0.5,
    attr: { d: flat },
    ease: 'power2.easeOut',
  });
  tl.to('.loader-wrap', {
    y: -1500,
  });
  tl.to('.loader-wrap', {
    zIndex: -1,
    display: 'none',
  });
  tl.from(
    'main',
    {
      y: 100,
      opacity: 0,
      delay: 0.3,
    },
    '-=1.5'
  );
});

$(function () {
  var width = $(window).width();
  if (width < 991) {
    ('use strict');

    $('.navbar .navbar-nav').on('click', '.nav-link', function () {
      $('.navbar .navbar-nav .dropdown .dropdown-menu').removeClass('show');

      $(this).parent().find('.dropdown-menu').addClass('show');
    });
  }
});

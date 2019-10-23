const headerModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    initScroll();

    if ($(window).width() <= BREAKPOINT_MD) {
      bindMobileEvents();
    }
    window.addEventListener("resize", onResize);
  }

  return {
    init
  }

  function cacheDom() {
    DOM.$navbar = $(".navbar_container");
  }

  function initScroll() {
    let prev_position = 0;
    $(document).scroll(function () {
      const current_position = $(this).scrollTop();
      if (current_position < prev_position) {
        DOM.$navbar.addClass("sticky");
      } else {
        DOM.$navbar.removeClass("sticky");
      }
      prev_position = current_position;
    });
  }

  function onResize(e) {
    const width = e.target.outerWidth;
    if (width <= BREAKPOINT_MD) {
      bindMobileEvents();
    } else {
      unbindMobileEvents();
    }
  }

  function bindMobileEvents() {
    $(".mobile_nav_container").on("click", ".hamburger_icon", function (e) {
      e.stopPropagation();
      openMobileNav();
    });

    $('body').on("click", ".overlay, .mobile_nav .go_back_button", () => {
      closeMobileNav();
      disableOverlay();
    });
  }

  function unbindMobileEvents() {
    $(".mobile_nav_container").off("click", ".hamburger_icon");
    $('body').off("click", ".mobile_nav .go_back_button");
  }

  function openMobileNav() {
    enableOverlay();
    $(".mobile_nav").addClass("open");
  }

  function closeMobileNav() {
    $(".mobile_nav").removeClass("open");
    disableOverlay();
  }
}());

headerModule.init();

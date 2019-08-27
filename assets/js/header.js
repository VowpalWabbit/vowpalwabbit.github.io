const headerModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    initScroll();
  }

  return {
    init
  }

  function cacheDom() {
    DOM.$navbar = $(".navbar_container");
  }

  function initScroll() {
    let prev_scroll_top = 0;
    $(document).scroll(function () {
      const scroll_top = $(this).scrollTop();
      if (scroll_top < prev_scroll_top) {
        DOM.$navbar.addClass("sticky");
      } else {
        DOM.$navbar.removeClass("sticky");
      }
      prev_scroll_top = scroll_top;
    });
  }
}());

headerModule.init();

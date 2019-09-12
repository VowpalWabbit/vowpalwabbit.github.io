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
}());

headerModule.init();

const bannerModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    bindEvents();
  }

  return {
    init
  }

  function cacheDom() {
    DOM.$banner = $(".home .banner_container");
  }

  function bindEvents() {
    DOM.$banner.on('click', '.close_icon', handleClose);
  }

  function handleClose() {
    DOM.$banner.addClass("hidden");
  }
}());

bannerModule.init();

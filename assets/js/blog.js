const blogModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    bindButtonEvent();
  }

  return {
    init
  }

  function cacheDom() {
    DOM.$button = $(".blog_container button");
  }

  function bindButtonEvent() {
    DOM.$button.on('click', handleShowMoreContent);
  }

  function handleShowMoreContent() {
    const $current_button = $(this);
    const $content = $current_button.parent().next("div");
    $content.toggle();
  }
}());

blogModule.init();

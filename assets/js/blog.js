const blogModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    addLinkToHeader();
    bindButtonEvent();
  }

  return {
    init
  }

  function cacheDom() {
    DOM.$button = $(".blog_container button");
    DOM.$h2s = $(".blog_container h2");
  }

  function addLinkToHeader() {
    DOM.$h2s.each(function(_, h2) {
      const $h2 = $(h2);
      const id = $h2.attr('id');
      const icon = '<i class="fa fa-link"></i>';

      if (id) {
        return $h2.append($("<a />").attr("href", "#" + id).html(icon));
      }
    });
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

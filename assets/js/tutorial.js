const tutorialModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    insertLinkToHeader();
  }

  return {
    init
  }

  function cacheDom() {
    DOM.$h2s = $(".tutorial_container h2");
  }

  function insertLinkToHeader() {
    DOM.$h2s.each(function(_, h2) {
      const $h2 = $(h2);
      const id = $h2.attr('id');
      const icon = '<i class="fa fa-link"></i>';

      if (id) {
        return $h2.append($("<a />").attr("href", "#" + id).html(icon));
      }
    });
  }
}());

tutorialModule.init();

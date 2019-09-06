const tutorialModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    addTutorialNav();
    addLinkToHeader();
    highlightSectionLink();
    $(document).scroll(function () {
      highlightSectionLink();
    });
  }

  return {
    init
  }

  function cacheDom() {
    DOM.$tutorial_nav = $(".tutorial_container .tutorial_nav");
    DOM.$h3s = $(".tutorial_container h3");
  }

  function addTutorialNav() {
    const tutorial_nav = Array.from(DOM.$h3s.map(function(_, h3) {
      const $h3 = $(h3);
      const id = $(h3).attr('id');

      return (
        "<li>" +
          "<span>" +
            "<a href=#" + id + ">" +
              $h3.contents().get(0).nodeValue +
            "</a>" +
          "</span>" +
        "</li>");
    })).join('');

    DOM.$tutorial_nav.append(tutorial_nav);
  }

  function addLinkToHeader() {
    DOM.$h3s.each(function(_, h3) {
      const $h3 = $(h3);
      const id = $h3.attr('id');
      const icon = '<i class="fa fa-link"></i>';

      if (id) {
        return $h3.append($("<a />").attr("href", "#" + id).html(icon));
      }
    });
  }

  function highlightSectionLink() {
    const current_position = $(window).scrollTop();
    const nav_height = DOM.$tutorial_nav.outerHeight() + 1;

    DOM.$tutorial_nav.find('a').each(function() {
      const $section_link = $(this);
      const $section = $($section_link.attr('href'));

      if ($section.position().top - nav_height <= current_position &&
        $section_link.offset().top + $section.height() > current_position) {
        DOM.$tutorial_nav.children('li').removeClass('active');
        $section_link.closest('li').addClass('active');
      }
    });
  }
}());

tutorialModule.init();

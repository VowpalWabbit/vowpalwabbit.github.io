const blogModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    addTutorialNav();
    addLinkToHeader();
    highlightSectionLink();
    bindButtonEvent();

    $(document).scroll(function () {
      highlightSectionLink();
    });
  }

  return {
    init
  }

  function cacheDom() {
    DOM.$tutorial_nav = $(".tutorial_container .tutorial_nav .tutorial_content_nav");
    DOM.$h2s = $(".tutorial_container h2");
    DOM.$button = $(".blog_container button");
  }

  function addTutorialNav() {
    const tutorial_nav = Array.from(DOM.$h2s.map(function(_, h2) {
      const $h2 = $(h2);
      const id = $(h2).attr('id');

      return (
        "<li>" +
          "<span>" +
            "<a href=#" + id + ">" +
              $h2.contents().get(0).nodeValue +
            "</a>" +
          "</span>" +
        "</li>");
    })).join('');

    DOM.$tutorial_nav.append(tutorial_nav);
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

  function highlightSectionLink() {
    const current_position = $(window).scrollTop();

    DOM.$tutorial_nav.find('a').each(function() {
      const $section_link = $(this);
      const $section = $($section_link.attr('href'));

      if ($section.position().top <= current_position &&
        $section_link.offset().top + $section.height() > current_position) {
        DOM.$tutorial_nav.children('li').removeClass('active');
        $section_link.closest('li').addClass('active');
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

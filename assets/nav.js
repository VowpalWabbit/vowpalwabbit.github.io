$(document).ready(function() {
  const $nav = $(".nav_bar_container");
  const modules = [
    'reinforcement',
    'online',
    'efficiency',
    'flexibility'
  ];

  let popper;

  $(document).scroll(function () {
    const scroll_top = $(this).scrollTop();
    const nav_height = $nav.height();

    $nav.toggleClass('scrolled', scroll_top > 0);

    if (scroll_top === 0) {
      $nav.css('background-color', 'transparent');
    } else if (nav_height - scroll_top >= 0) {
      const opacity = scroll_top / nav_height;
      const bg_color = 'rgba(255, 255, 255,' + opacity + ')';
      $nav.css('background-color', bg_color);
    } else {
      $nav.css('background-color', 'white');
    }

  });

  $(".language-sh pre.highlight").append(
    '<button class="copy">' +
      '<i class="fa fa-clone" aria-hidden="true"></i>' +
    '</button>'
  );

  $('[data-ref]').each((index, superscript) => {
    const $superscript = $(superscript);
    const citation_id = $superscript.data("ref");

    $superscript.append(
      '<a href="#'+ citation_id +'">' +
        '<sup>[' + (index + 1) + ']</sup>' +
      '</a>'
    );

    const citation_content = $("#" + $.escapeSelector(citation_id)).html();

    $superscript.append(
      '<div class="bibliography_tooltip hidden" role="tooltip">' +
        citation_content +
        '<div x-arrow></div>' +
      '</div>'
    );
  });

  $('sup').on('click mouseenter', function (e) {
    e.stopPropagation();
    const $this = $(this);
    const $tooltip = $this.parent().next(".bibliography_tooltip");
    popper = new Popper($this, $tooltip, {
      placement: 'top',
      modifiers: {
        flip: {
          behavior: ['right', 'left', 'top','bottom']
        },
        offset: {
          enabled: true,
          offset: '300, 10'
        },
        trigger: 'hover'
      },
    });
    $(this).parent().next(".bibliography_tooltip").removeClass("hidden");
  });

  $('span[data-ref]').on("mouseleave", function() {
    $(".bibliography_tooltip").addClass("hidden");
  });

  $(document).on("click", function() {
    $(".bibliography_tooltip").addClass("hidden");
  });

  $(".hero_container").on("click", ".get_started_button", function() {
    scrollTo('get_started');
  });

  $(".tabs_container .nav, .tabs_container .sub_nav, .use_cases_container .nav")
    .on("click", " .nav_item", function() {
      $(this).siblings().removeClass('active');
      const module_id = $(this).data('module_id');
      showModule(module_id);
    });

  $(".tabs_container").on("click", "button.arrow", function() {
    const $this = $(this);
    const class_names = $this.attr("class");
    let index = modules.findIndex((module) => {
      return module === $this.attr('data-current-module')
    });

    index = class_names.includes('previous')
      ? ((index - 1) + modules.length) % modules.length
      : (index + 1) % modules.length;

    $(".tabs_container .arrow").attr("data-current-module", modules[index]);

    $this.siblings('.nav_item').removeClass('active');
    $(".nav_item[data-module_id=" + modules[index] +"]").addClass('active');

    showModule(modules[index]);
  });

  $(document).on("click", ".language-sh .copy", function() {
    if (document.selection) {
      const range = document.body.createTextRange();
      range.moveToElementText($(this).prev()[0]);
      range.select().createTextRange();
      document.execCommand("copy");
    } else if (window.getSelection) {
      const range = document.createRange();
      range.selectNode($(this).prev()[0]);
      const selection = window.getSelection();
      selection.removeAllRanges()
      selection.addRange(range);
      document.execCommand("copy");
    }
  });
});

function showModule(module_id) {
  $(".nav_item[data-module_id='" + module_id +"']").addClass('active');
  const $module = $("div[data-module_id=" + module_id +"]");
  $module.siblings().addClass('hidden');
  $module.removeClass('hidden');
}

function scrollTo(id){
  $('html,body').animate({
    scrollTop: $("#"+id).offset().top
  },'slow');
}

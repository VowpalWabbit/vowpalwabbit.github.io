$(document).ready(function() {
  const $nav = $(".nav_bar_container");
  const modules = [
    'reinforcement',
    'supervised',
    'online',
    'efficiency',
    'flexibility'
  ];

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

  let citation_index_map = {};
  let citation_index_so_far = 0;
  $('[data-ref]').each((_, term) => {
    const $term = $(term);

    const citations = $term.data("ref").split(" ").map((citation_id) => {
      let superscript;
      if (Object.keys(citation_index_map).includes(citation_id)) {
        superscript = citation_index_map[citation_id];
      } else {
        citation_index_so_far += 1;
        superscript = citation_index_so_far;
        citation_index_map[citation_id] = citation_index_so_far;
      }
      return {
        superscript,
        citation_id
      }
    });

    const superscript_link = citations.map((citation) => {
      return (
        '<a href=#'+ citation.citation_id +'>' +
          citation.superscript +
        '</a>'
      )
    }).join(', ');

    $term.append(
      '<sup class="superscript_links">' +
        superscript_link +
      '</sup>'
    );
  });

  $('.superscript_links').on('mouseenter', function (e) {
    e.stopPropagation();
    $(".bibliography_tooltip").remove();
    const $this = $(this);
    generateTooltip($this);

    const $tooltip = $(".bibliography_tooltip");
    popper_config = {
      placement: 'top',
      modifiers: {
        flip: {
          behavior: ['right', 'left', 'top','bottom']
        },
        offset: {
          enabled: true,
          offset: '250, 20'
        },
        trigger: 'hover'
      }
    };

    if ($(window).width() <= 768) {
      $('span[data-ref]').off("mouseleave");

      popper_config = {
        modifiers: {
          trigger: 'click',
          computeStyle: {
            enabled: true,
            fn(data) {
              data.styles = {
                ...data.styles,
                position: 'fixed',
                left: `${(window.innerWidth - data.popper.width) / 2}px`,
                right: `${(window.innerWidth - data.popper.width) / 2}px`,
                margin: '0 auto',
                top: '50%',
                transform: 'translateY(-50%)'
              };
              return data;
            }
          }
        }
      };

      $(".overlay").show();
      $("html").addClass("overlay_on");
      $(".bibliography_tooltip").addClass("mobile");
    } else {
      $(".overlay").hide();
      $("html").removeClass("overlay_on");
      $(".bibliography_tooltip").removeClass("mobile");
      $('span[data-ref]').on("mouseleave");
    }

    new Popper($this, $tooltip, popper_config);

    $tooltip.mouseenter(() => {
      $tooltip.show();
    }).mouseleave(() => {
      $tooltip.fadeOut(150, () => {
        $tooltip.remove();
      });
    });
  });

  $('span[data-ref]').on("mouseleave", function() {
    setTimeout(function() {
      if (!$(".bibliography_tooltip:hover").length) {
        $(".bibliography_tooltip").remove();
      }
    }, 300);
  });

  $(".overlay").on("click", () => {
    $(".overlay").hide();
    $("html").removeClass("overlay_on");
    $(".bibliography_tooltip").remove();
  });

  $(document).on("click", ".close_button", function(){
    $(".overlay").hide();
    $("html").removeClass("overlay_on");
    $(".bibliography_tooltip").remove();
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

  $(".download_container").on("click", ".download_bib_button", (e) => {
    const $this = $(e.target);
    const bib_key = $this.data("bib_key");
    const content = $this.prev(".bibliography").find("pre").text();
    download(bib_key, content);
  });
});

function showModule(module_id) {
  $(".nav_item[data-module_id='" + module_id +"']").addClass('active');
  const $module = $("div[data-module_id=" + module_id +"]");
  $module.siblings().addClass('hidden');
  $module.removeClass('hidden');
}

function scrollTo(id) {
  $('html,body').animate({
    scrollTop: $("#"+id).offset().top
  },'slow');
}

function generateTooltip($this) {
  const citations = [].slice.call($this.children("a").map((_, citation_link) => {
    return {
      citation_id: $(citation_link).attr("href").substring(1),
      superscript: $(citation_link).text()
    }
  }));

  let citation_list;
  if (citations.length === 1) {
    citation_list =
      '<div class="row">' +
        '<div class="col">' +
          $("#" + $.escapeSelector(citations[0].citation_id)).html() +
        '</div>' +
      '</div>';
  } else {
    citation_list = citations.map((citation) => {
      return (
        '<div class="row citation">' +
          '<div class="col-1 superscript">' +
            '<a href="#'+ citation.citation_id +'">' +
              citation.superscript +
            '</a>' +
          '</div>' +
          '<div class="col">' +
            $("#" + $.escapeSelector(citation.citation_id)).html() +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  $("body").append(
    '<div class="bibliography_tooltip" role="tooltip">' +
      '<div class="container">' +
        '<button type="button" class="close_button"/>' +
        citation_list +
      '</div>' +
      '<div x-arrow></div>' +
    '</div>'
  );
}

function download(bib_key, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', bib_key + '.bib');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const citationModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    updateSupFormat();

    if ($(window).width() <= BREAKPOINT_LG) {
      bindMobileEvents();
    } else {
      bindDesktopEvents();
    }
  }

  return {
    init
  }

  function updateSupFormat() {
    DOM.$sup.children('.cite_sup').each((_, cite_sup) => {
      $(cite_sup).text($(cite_sup).text().slice(1, -1))
    })
  }

  function cacheDom() {
    DOM.$sup = $('sup');
  }

  function bindDesktopEvents() {
    DOM.$sup.on('mouseenter', handleSupMouseEnter);
    DOM.$sup.on('mouseleave', handleSupMouseLeave);
  }

  function bindMobileEvents() {
    DOM.$sup.on('click', handleSupMobileOnClick);

    $('body').on("click", ".overlay, .citation_tooltip .close_button", () => {
      removeTooltip();
      disableOverlay();
    });
  }

  function handleSupMouseEnter() {
    const $sup = $(this);
    addTooltip($sup);

    const $tooltip = $(".citation_tooltip");
    const popper_config = {
      placement: 'top',
      modifiers: {
        flip: {
          behavior: ['right', 'left', 'top','bottom']
        },
        offset: {
          enabled: true,
          offset: '250, 10'
        },
        trigger: 'hover'
      }
    };

    new Popper($sup, $tooltip, popper_config);

    $tooltip.mouseenter(() => {
      $tooltip.show();
    }).mouseleave(() => {
      $tooltip.fadeOut(300, () => {
        $tooltip.remove();
      });
    });
  };

  function handleSupMouseLeave() {
    setTimeout(function() {
      if (!$(".citation_tooltip:hover").length) {
        $(".citation_tooltip").remove();
      }
    }, 300);
  }

  function handleSupMobileOnClick(e) {
    e.preventDefault();

    const $sup = $(this);
    addTooltip($sup);

    enableOverlay();
    const $tooltip = $(".citation_tooltip");
    const popper_config = {
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

    new Popper($sup, $tooltip, popper_config);
  }

  function removeTooltip() {
    $(".citation_tooltip").remove();
  }

  function addTooltip($sup) {
    const citations = [].slice.call($sup.children("a").map((_, citation) => {
      const citation_id = $(citation).attr("href").substring(1);
      const superscript = $(citation).text();

      return (
        '<div class="row citation">' +
          '<div class="col-1 superscript">' +
            '<a href="#'+ citation_id +'">' +
              superscript +
            '</a>' +
          '</div>' +
          '<div class="col">' +
            $("#" + $.escapeSelector(citation_id)).html() +
          '</div>' +
        '</div>'
      )
    })).join('');

    $("body").append(
      '<div class="citation_tooltip" role="tooltip">' +
        '<div class="container">' +
          '<button type="button" class="close_button"/>' +
          citations +
        '</div>' +
        '<div x-arrow></div>' +
      '</div>'
    );
  }
}());

citationModule.init();

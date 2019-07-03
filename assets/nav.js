$(document).ready(function() {
  const $nav = $(".nav_bar_container");
  const modules = [
    'reinforcement',
    'versatility',
    'online',
    'speed',
    'input_format'
  ]

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
});

function showModule(module_id) {
  $(".nav_item[data-module_id='" + module_id +"']").addClass('active');
  const $module = $("div[data-module_id=" + module_id +"]");
  $module.siblings().hide();
  $module.show();
}

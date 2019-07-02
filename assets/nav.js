function myFunction() {
  var x = document.getElementById("nav");
  if (x.className === "nav") {
    x.className += " responsive";
  } else {
    x.className = "nav";
  }
}

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

  $(".tabs_container").on("click", ".nav .nav_item", function() {
    const $this = $(this);
    showModule($this);
  });

  $(".use_cases_container").on("click", ".nav button", function() {
    const $this = $(this);
    showModule($this);
  });

  $(".tabs_container").on("click", ".sub_nav button", function() {
    const $this = $(this);
    showModule($this);
  });

  $(".tabs_container").on("click", "button.arrow", function() {
    const $this = $(this);
    const class_names = $this.attr("class");
    let module_id = $this.attr('data-current-module');

    let index = modules.findIndex((module) => {
      return module === module_id
    });

    index = class_names.includes('previous')
      ? ((index - 1) + modules.length) % modules.length
      : index = (index + 1) % modules.length;

    $(".tabs_container .arrow").attr("data-current-module", modules[index]);

    const $module = $("div[data-module_id=" + modules[index] +"]");
    $module.siblings().hide();
    $module.show();

    let $nav_item = $(".tabs_container .active");
    $nav_item.removeClass('active');
    $(".nav_item[data-module_id=" + modules[index] +"]").addClass('active');
  });
});

function showModule($nav_button) {
  $nav_button.siblings('.nav_item').removeClass('active');
  $nav_button.addClass('active');

  const module_id = $nav_button.data("module_id");
  const $module = $("div[data-module_id=" + module_id +"]");
  $module.siblings().hide();
  $module.show();
}

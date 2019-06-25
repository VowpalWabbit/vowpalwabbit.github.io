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

  $(document).scroll(function () {
    const scroll_top = $(this).scrollTop();
    const nav_height = $nav.height();

    const opacity = nav_height - scroll_top >= 0
      ? 1 - (nav_height - scroll_top) / nav_height
      : 1;

    $nav.toggleClass('scrolled', scroll_top > 0);
    const $scrolled_nav = $('.scrolled');
    const bg_color = 'rgba(255, 255, 255,' + opacity + ')';
    $scrolled_nav.css('background-color', bg_color);
  });

  $(".tabs_container").on("click", ".nav button", function() {
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
});

function showModule($nav_button) {
  $nav_button.siblings().removeClass('active');
  $nav_button.addClass('active');

  const module_id = $nav_button.data("module_id");
  const $module = $("div[data-module_id=" + module_id +"]");
  $module.siblings().hide();
  $module.show();
}

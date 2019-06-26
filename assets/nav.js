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

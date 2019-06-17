function myFunction() {
  var x = document.getElementById("nav");
  if (x.className === "nav") {
    x.className += " responsive";
  } else {
    x.className = "nav";
  }
}

$(document).ready(function() {
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

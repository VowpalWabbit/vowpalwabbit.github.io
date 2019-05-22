function myFunction() {
  var x = document.getElementById("nav");
  if (x.className === "nav") {
    x.className += " responsive";
  } else {
    x.className = "nav";
  }
}

$(document).ready(function() {
  $(".technical_details_container").on("click", ".nav button", function() {
    const $this = $(this);
    showModule($this);
  });

  $(".demo_container").on("click", ".nav button", function() {
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

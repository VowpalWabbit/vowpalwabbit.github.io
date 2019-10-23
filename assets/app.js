const BREAKPOINT_LG = 1024;
const BREAKPOINT_MD = 768;

$(document).ready(function() {
  $(".language-sh pre.highlight").append(
    '<button class="copy">' +
      '<i class="fa fa-clone" aria-hidden="true"></i>' +
    '</button>'
  );

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

function scrollTo(id) {
  $('html, body').animate({
    scrollTop: $("#" + id).offset().top
  }, 'slow');
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

function enableOverlay() {
  $('html').addClass('overlay_on');
  $('.overlay').show();
}

function disableOverlay() {
  $('.overlay').hide();
  $('html').removeClass('overlay_on');
}

const tabsModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    bindEvents();
  }

  function cacheDom() {
    DOM.$nav = $(".tabs_container .nav");
  }

  function bindEvents() {
    DOM.$nav.on('click', 'button', handleClick);
  }

  return {
    init
  }

  function handleClick() {
    $(this).siblings().removeClass('active');
    const module_id = $(this).data('module_id');
    showModule(module_id);
  };

  function showModule(module_id) {
    $("button[data-module_id='" + module_id +"']").addClass('active');
    const $module = $("div[data-module_id=" + module_id +"]");
    $module.siblings().addClass('hidden');
    $module.removeClass('hidden');
  }
}());

tabsModule.init();

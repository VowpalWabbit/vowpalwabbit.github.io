const getStartedModule = (function() {
  'use strict';
  let DOM = {};

  function init() {
    cacheDom();
    bindEvents();
    selectDefaultSettings();
  }

  function cacheDom() {
    DOM.$settings = $(".settings_container");
  }

  function bindEvents() {
    DOM.$settings.on('click', '.option', handleClick);
  }

  return {
    init
  }

  function handleClick() {
    if (getOptionText($(this)) === 'linux' ||
      getOptionText($(this)) === 'mac') {
      $(".language button:contains('C#')").attr("disabled", true);
    } else if (getOptionText($(this)) === 'windows') {
      $(".language button:contains('C#')").attr("disabled", false);
    } else if (getOptionText($(this)) === 'c#') {
      $(".os button:contains('Ubuntu')").attr("disabled", true);
      $(".os button:contains('Mac')").attr("disabled", true);
    } else if (getOptionText($(this)) === 'python3' ||
      getOptionText($(this)) === 'c++') {
      $(".os button:contains('Ubuntu')").attr("disabled", false);
      $(".os button:contains('Mac')").attr("disabled", false);
    }

    const $selected_btn = $(this);
    $selected_btn.siblings().removeClass('selected');
    $selected_btn.addClass('selected');
    showCommand();
  };

  function selectDefaultSettings() {
    const default_os = getDefaultOS() || 'linux';
    const default_language = 'python';

    selectOption('os', default_os);
    selectOption('language', default_language);
    showCommand();
  }

  function selectOption(type, value) {
    const $options = DOM.$settings.find(`.${type} .option`);
    $options.each((_, option) => {
      const $option = $(option);
      if (getOptionText($option).includes(value)) {
        $option.addClass('selected');
      }
    });
  }

  function getDefaultOS() {
    const platform = window.navigator.platform.toLowerCase();
    const os_list = ['linux', 'mac', 'win'];

    return os_list.find((os) => {
      if (platform.includes(os)) {
        return os;
      }
    })
  }

  function showCommand() {
    const command_list = {
      "linux,python3": "pip install vowpalwabbit",
      "linux,c++": "Build from <a href='https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Dependencies#ubuntu' target='_blank'>source</a>",
      "linux,java": "Build from source",
      "linux,c#": "Build from <a href='https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Dependencies#ubuntu' target='_blank'>source</a>",
      "mac,python3": "pip install vowpalwabbit",
      "mac,c++": "brew install vowpal-wabbit",
      "mac,java": "Build from source",
      "mac,c#": "Build from <a href='https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Dependencies#macos' target='_blank'>source</a>",
      "windows,python3": "pip install vowpalwabbit",
      "windows,c++": "Build from <a href='https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Dependencies#windows' target='_blank'>source</a>",
      "windows,java": "Build from source",
      "windows,c#": "Install-Package VowpalWabbit -Version 8.7.0",
    }

    let selected_options = [];
    $(".settings_container .row").each((_, row) => {
      const selected_option = getOptionText($(row).find(".selected"));
      if(selected_option) {
        selected_options.push(selected_option);
      }
    });

    const command = command_list[selected_options.join(',')];
    const $command_box = $('.install_vw_config .installation_step .command_box');

    if (!command.toLowerCase().includes("<a ")) {
      if ($command_box.has('.copy').length === 0) {
        $command_box.addClass("language-sh");
        $command_box.append(
          '<button class="copy">' +
            '<i class="fa fa-clone" aria-hidden="true"></i>' +
          '</button>'
        );
      }
    } else {
      $command_box.removeClass("language-sh");
      $command_box.find('.copy').remove();
    }

    $command_box.find('code').html(command);
  }

  function getOptionText($button) {
    return $button.attr("value");
  }
}());

getStartedModule.init();

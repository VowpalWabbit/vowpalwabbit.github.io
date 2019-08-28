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
      $(".os button:contains('Linux')").attr("disabled", true);
      $(".os button:contains('Mac')").attr("disabled", true);
    } else if (getOptionText($(this)) === 'python3' ||
      getOptionText($(this)) === 'c++') {
      $(".os button:contains('Linux')").attr("disabled", false);
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
      "linux,python3": "sudo apt update" +
                       "<br><br>" +
                       "sudo apt install libboost-dev libboost-program-options-dev libboost-system-dev libboost-thread-dev libboost-math-dev libboost-test-dev libboost-python-dev zlib1g-dev cmake python3 python3-pip" +
                       "<br><br>" +
                       "pip3 install vowpalwabbit",
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
      "windows,c#": "<a href='https://www.nuget.org/packages/VowpalWabbit/' target='_blank'>https://www.nuget.org/packages/VowpalWabbit/</a>",
    }

    let selected_options = [];
    $(".settings_container .row").each((_, row) => {
      const selected_option = getOptionText($(row).find(".selected"));
      if(selected_option) {
        selected_options.push(selected_option);
      }
    });

    const command = command_list[selected_options.join(',')];
    const $command_box = $('.start_container .installation_step .command_box');

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
    return $button.text().replace(/\s/g, '').toLowerCase();
  }
}());

getStartedModule.init();

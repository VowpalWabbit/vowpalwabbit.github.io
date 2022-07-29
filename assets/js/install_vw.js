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
    showTutorial();
  };

  function selectDefaultSettings() {
    const default_os = getDefaultOS() || 'linux';
    const default_language = 'python';

    selectOption('os', default_os);
    selectOption('language', default_language);
    showCommand();
    showTutorial();
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

  function showTutorial() {
    const command_list = {
      "linux,python3": "Ready to use Vowpal Wabbit? Follow <a href='/tutorials/python_first_steps.html'>this tutorial</a> to get started with the Python bindings.",
      "linux,c++": "Ready to use Vowpal Wabbit? Follow this <a href='/tutorials/cmd_first_steps.html'> getting started tutorial</a>. You will learn how to perform Linear Regression with VW—including how to interact with VW by structuring input and learning how to interpret VW output.",
      "linux,java": "We don't currently have a tutorial for the Java bindings. The <a href='/tutorials/cmd_first_steps.html'>command line tutorial</a> will get you acquainted with some helpful concepts though.",
      "linux,c#": "Not currently available on Linux",
      "mac,python3": "Ready to use Vowpal Wabbit? Follow <a href='/tutorials/python_first_steps.html'>this tutorial</a> to get started with the Python bindings.",
      "mac,c++": "Ready to use Vowpal Wabbit? Follow this <a href='/tutorials/cmd_first_steps.html'> getting started tutorial</a>. You will learn how to perform Linear Regression with VW—including how to interact with VW by structuring input and learning how to interpret VW output.",
      "mac,java": "We don't currently have a tutorial for the Java bindings. The <a href='/tutorials/cmd_first_steps.html'>command line tutorial</a> will get you acquainted with some helpful concepts though.",
      "mac,c#": "Not currently available on MacOS",
      "windows,python3": "Ready to use Vowpal Wabbit? Follow <a href='/tutorials/python_first_steps.html'>this tutorial</a> to get started with the Python bindings.",
      "windows,c++": "Ready to use Vowpal Wabbit? Follow this <a href='/tutorials/cmd_first_steps.html'> getting started tutorial</a>. You will learn how to perform Linear Regression with VW—including how to interact with VW by structuring input and learning how to interpret VW output.",
      "windows,java": "We don't currently have a tutorial for the Java bindings. The <a href='/tutorials/cmd_first_steps.html'>command line tutorial</a> will get you acquainted with some helpful concepts though.",
      "windows,c#": "We don't currently have a tutorial for the C# bindings. The <a href='/tutorials/cmd_first_steps.html'>command line tutorial</a> will get you acquainted with some helpful concepts though.",
    }

    let selected_options = [];
    $(".settings_container .row").each((_, row) => {
      const selected_option = getOptionText($(row).find(".selected"));
      if(selected_option) {
        selected_options.push(selected_option);
      }
    });

    const command = command_list[selected_options.join(',')];
    const $tutorial_info = $('#tutorial_info');
    $tutorial_info.html(command);
  }

  function showCommand() {
    const command_list = {
      "linux,python3": "pip install vowpalwabbit",
      "linux,c++": "Build from <a href='https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Building' target='_blank'>source</a>",
      "linux,java": "Build from source",
      "linux,c#": "Not currently available on Linux",
      "mac,python3": "pip install vowpalwabbit",
      "mac,c++": "brew install vowpal-wabbit",
      "mac,java": "Build from source",
      "mac,c#": "Not currently available on MacOS",
      "windows,python3": "pip install vowpalwabbit",
      "windows,c++": "Build from <a href='https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Building' target='_blank'>source</a>",
      "windows,java": "Build from source",
      "windows,c#": "Install-Package VowpalWabbit -Version 8.9.0",
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

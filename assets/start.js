$(document).ready(function() {
  selectDefaultSettings();

  $(".settings_container .row .row").on("click", ".option", function() {
    const $selected_btn = $(this).parent();
    $selected_btn.siblings().removeClass('selected');
    $selected_btn.addClass('selected');
    showCommand();
  });
});

function selectDefaultSettings() {
  default_os = getDefaultOS() || 'linux';
  default_language = 'python';

  selectOption('os', default_os);
  selectOption('language', default_language);
  showCommand();
}

function selectOption(type, default_value) {
  const $options = $(".settings_container .row").find("." + type).find('.option');

  $options.each((_, element) => {
    $option = $(element);

    if ($option.text().trim().toLowerCase().includes(default_value)) {
      $option.parent().addClass('selected');
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
  command_list = {
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

  selected_options = [];
  $(".settings_container .settings .row").each((_, row) => {
    selected_option = $(row).children(".selected").text().replace(/\s/g, '').toLowerCase();
    if(selected_option) {
      selected_options.push(selected_option);
    }
  });

  command = command_list[selected_options.join(',')];
  $command_box = $('.command_container .command_box');
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
    $('.command_box .copy').remove();
  }

  $command_box.find('.command').html(command);
}

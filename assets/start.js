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
  default_build = 'stable';
  default_language = 'python';

  selectOption('build', default_build);
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
    "linux,python3": "pip install vowpalwabbit",
    "linux,c++": "apt-get install vowpalwabbit",
    "linux,java": "Build from source",
    "linux,c#": "Build from source",
    "mac,python3": "pip install vowpalwabbit",
    "mac,c++": "brew install vowpal-wabbit",
    "mac,java": "Build from source",
    "mac,c#": "Build from source",
    "windows,python3": "pip install vowpalwabbit",
    "windows,c++": "Build from source",
    "windows,java": "Build from source",
    "windows,c#": "Install-Package VowpalWabbit",
  }

  selected_options = [];
  $(".settings_container .settings .row").each((_, row) => {
    selected_option = $(row).children(".selected").text().replace(/\s/g, '').toLowerCase();
    if(selected_option) {
      selected_options.push(selected_option);
    }
  });

  command = command_list[selected_options.join(',')];
  $command_box = $('.command_container .command');
  $command_box.text(command);
}

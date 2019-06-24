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
    "stable,linux,python3": "pip install vowpalwabbit",
    "stable,linux,c++": "placeholder",
    "stable,linux,java": "placeholder",
    "stable,linux,c#": "placeholder",
    "stable,mac,python3": "pip install vowpalwabbit",
    "stable,mac,c++": "placeholder",
    "stable,mac,java": "placeholder",
    "stable,mac,c#": "placeholder",
    "stable,windows,python3": "pip install vowpalwabbit",
    "stable,windows,c++": "placeholder",
    "stable,windows,java": "placeholder",
    "stable,windows,c#": "Install-Package VowpalWabbit",

    "nightly,linux,python3": "placeholder",
    "nightly,linux,c++": "placeholder",
    "nightly,linux,java": "placeholder",
    "nightly,linux,c#": "placeholder",
    "nightly,mac,python3": "pip install vowpalwabbit",
    "nightly,mac,c++": "placeholder",
    "stable,mac,java": "placeholder",
    "nightly,mac,c#": "placeholder",
    "nightly,windows,python3": "pip install vowpalwabbit",
    "nightly,windows,c++": "placeholder",
    "nightly,windows,java": "placeholder",
    "nightly,windows,c#": "https://www.nuget.org/packages/VowpalWabbit/",
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

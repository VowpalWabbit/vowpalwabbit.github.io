---
title: "VowpalWabbit 9.1.0 Release Notes"
layout: blog
tags: Release&nbsp;notes
description: Boost Program Options removal, JSON invert hash output, and a new loss function
author: Jack Gerrits
avatar_link: https://avatars1.githubusercontent.com/u/7558482?s=400&u=21e4cca683799d65a20a4cf3d11d0c17853ef9cb&v=4
---

<div class="blog_highlight" markdown="1">
- [GitHub release](https://github.com/VowpalWabbit/vowpal_wabbit/releases/tag/9.1.0)
- [PyPi](https://pypi.org/project/vowpalwabbit/)
</div>

It's only been a couple of months since version 9, but this release includes some exciting improvements to Vowpal Wabbit. Some highlights are the removal of the Boost Program Options dependency, a new experimental way to output feature names and weights and a new loss function.

### Checked in Visual Studio project files removal

To be very clear - we are **not** removing support for Windows. Ever since we introduced the CMake build system in [version 8.7.0](https://github.com/VowpalWabbit/vowpal_wabbit/releases/tag/8.7.0) there have been two parallel build systems for Windows: the CMake based one and a checked in solution and projects. We're confident now that the CMake based build system is in a place to fully replace the old Visual Studio project file based one. In fact, the CMake based Windows build has been significantly more flexible, robust, easier to use and faster to build for quite some time now.

Therefore, version 9.1.0 will be the last release that contains the old checked in Visual Studio solution and project files. We strongly recommend anyone who was using this to migrate over to using the CMake based build system. If that is not possible in the short term we have [created `v141` and `v142` nugets](#v141-and-v142-native-nugets) as a migration path.

Looking forward, being able to depend on solely the CMake build system is going to greatly improve our ability to improve the modularity of VW and ease of consumption of VW as a library.

## Highlights

### Removal of Boost Program Options dependency

For a long time we have depended on Boost Program Options for command line options parsing. In this release, we have replaced this dependency with our own implementation of command line parsing. Apart from one place where we depend on Boost Math in standalone mode, this means that VW core and the command line tool are free of Boost dependencies hopefully making the code a bit easier to build and package.

### [Experimental](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Experimental): Expectile loss

Expectile is a new loss function, which is currently asymmetric squared loss. It is being experimented with and being used for risk averse contextual bandits. It has been added to the [loss functions wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Loss-functions).

### [Experimental](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Experimental): Export model weights and readable feature names as JSON

The `--invert_hash` output is often used to understand what features correspond to different weights in the trained model. This output was never designed for machine reading but it has seen considerable use in this regard.

We've added a new experimental option to export information similar to the weights section of `--invert_hash` but in JSON format. This is subject to change as we better understand what information is helpful. It is also only currently supported for the default gradient descent base learner. Early usage shows this is much easier to use and provides more stable and rich output.

[Find out more information such as options and format here.](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/JSON-export-of-model-weights)


### v141 and v142 native Nugets

As a measure to assist anyone who is unable to consume the CMake based build system we have implemented CI to generate native nugets for the core VW library and command line executable. These Nugets are 64 bit and come bundled with the necessary compiled dependencies to build VW. They can be found as artifacts in the [CI jobs](https://github.com/VowpalWabbit/vowpal_wabbit/actions/workflows/build_nugets.yml) and are available on Nuget.org:

- [VowpalWabbitNative-v141-x64](https://www.nuget.org/packages/VowpalWabbitNative-v141-x64/)
- [VowpalWabbitNative-v142-x64](https://www.nuget.org/packages/VowpalWabbitNative-v142-x64/)

These are a temporary measure to help migration to CMake based consumption of the package and will be removed eventually.

## Thank you

A huge thank you and welcome to all of the new contributors since the last release:

- [@MoniFarsang](https://github.com/MoniFarsang)
- [@HollowMan6](https://github.com/HollowMan6)
- [@ngam](https://github.com/ngam)

And of course thank you to existing contributors:

- [@cheng-tan](https://github.com/cheng-tan)
- [@bassmang](https://github.com/bassmang)
- [@zwd-ms](https://github.com/zwd-ms)
- [@ataymano](https://github.com/ataymano)
- [@lokitoth](https://github.com/lokitoth)
- [@lalo](https://github.com/lalo)

<div>
  <i class="fa fa-caret-right"></i>
  <button class="changelist_button">
    Click here to expand and see the full changelist.
  </button>
</div>
<div class="changelist hidden" markdown="1">

## Features
- [feat: add cookie-free analytics for docs pages (#3837)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3837)
- [feat: expectile loss function (#3760)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3760)
- [feat: support online state and excluding feature names in dump json model (#3796)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3796)
- [feat: support model weight export as json (#3786)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3786)
- [feat: support unique_ptr based init and logger redirection (#3754)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3754)
- [feat: enable standalone consumption of boost-math by default and remove remaining boost pieces (#3694)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3694)
- [feat: add pred/lbl types to cb algos (#3748)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3748)
- [feat: add lbl/pred types cb_adf, cb_algs, cb_dro (#3744)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3744)
- [feat: replace boost::string_view with string-view-lite (#3717)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3717)
- [feat: Implement standalone command line options parsing (#3699)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3699)
- [feat: remove extra allocations, add pred/lbl types to cb_explore (#3730)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3730)
- [feat: support vendored builds of zlib (#3695)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3695)
- [feat: add a couple of learner label/pred types (#3706)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3706)
- [feat: implement command line split function (#3700)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3700)
- [feat: add noise and unused features to cb_sim (#3698)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3698)
- [feat: add text wrap function (#3689)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3689)
- [feat: Support visitor pattern for handling typed options (#3686)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3686)

## Fixes

- [fix: revert accidental change to output format (#3844)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3844)
- [fix: invalid pointer value when readto returns rest of buffer (#3838)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3838)
- [fix: resolve warnings (#3828)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3828)
- [fix: Json parser does not assign weight to example (#3817)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3817)
- [fix: fix warnings and deprecation warnings (#3798)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3798)
- [fix: ldf cleanup and 'l' namespace manipulations removal (#3771)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3771)
- [fix: path filter requires checkout v2 for push (#3789)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3789)
- [fix: ensure dftovw values are valid (#3781)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3781)
- [fix: use are_same instead of are_same_rel (#3775)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3775)
- [fix: more robust table formatting (#3741)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3741)
- [fix: make epsilon_features more robust (#3751)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3751)
- [fix: incorrect accidental usage of initializer list instead of specific constructor (#3747)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3747)
- [fix: fix splitting on double spaces in pyvw __init__ (#3745)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3745)
- [fix: split apart newlines in log lines forwarded to python (#3746)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3746)
- [fix: several bug fixes for options_cli (#3735)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3735)
- [fix: [python] support args with spaces in them in Workspace constructor (#3725)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3725)
- [fix: [automl] throw for too many configs (#3731)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3731)
- [fix: fix segfault when using --dont_output_best_constant (#3722)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3722)
- [fix: fix header installation (#3716)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3716)
- [fix: no static fields in vw workspace (#3715)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3715)
- [fix: Move automl between cb_explore_adf and cb_adf on reduction stack (#3709)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3709)
- [fix: attempt to fix flaky daemon test (#3707)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3707)
- [fix: use different syntax for opening namespace for custom formatters (#3685)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3685)
- [fix: fix some incorrect type definitions in run_tests.py (#3677)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3677)
- [fix: squarecb learn should not update prediction (#3683)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3683)
- [fix: dftovw address post PR feedback (#3671)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3671)
- [fix: Remove content from image directives in README.rst (#3676)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3676)
- [fix: add long_description_content_type (#3673)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3673)
- [fix: fix compile issues when consuming fmt 8.1.1 (#3669)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3669)

## Other changes

- [refactor: complete migration of setup functions to reductions namespace (#3841)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3841)
- [ci: separate test runs on windows due to the fact powershell only fai… (#3842)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3842)
- [refactor: fix warnings caused by using deprecated types (#3840)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3840)
- [build: turn off warnings as error for windows project files (#3839)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3839)
- [docs: add message for invert hash save_resume (#3776)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3776)
- [docs: move python build docs to wiki (#3679)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3679)
- [refactor: namespacing of uniform_hash (#3827)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3827)
- [refactor: learner use details namespace (#3829)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3829)
- [refactor: move more reductions into reductions NS (#3831)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3831)
- [refactor: move more reductions into reductions namespace (#3826)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3826)
- [refactor: fix style and namespace of loss functions (#3824)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3824)
- [refactor: enforce readability-braces-around-statements clang-tidy check conformance (#3821)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3821)
- [refactor: Begin reduction ns cleanup and migrate to vw_fwd (#3814)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3814)
- [refactor: upgrade to python3 for tools under utl (#3815)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3815)
- [refactor: add cb_type to output message (#3805)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3805)
- [refactor: update header sort priority (#3812)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3812)
- [refactor: deprecate using of audit_strings in global namespace (#3797)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3797)
- [refactor: move more things into VW namespace (#3793)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3793)
- [refactor: move v_array into VW namespace (#3792)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3792)
- [refactor: enable sorting includes format check (#3780)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3780)
- [refactor: cleanup prediction formatting (#3753)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3753)
- [refactor: replace use with typed option handled and remove type list (#3772)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3772)
- [refactor: don't install vw by default (#3764)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3764)
- [refactor: cleanup consts for loss function and shared_data and simplify finish (#3756)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3756)
- [refactor: replace used options impl with options_cli (#3743)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3743)
- [refactor: remove logger dependency in options (#3733)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3733)
- [refactor: dont parse options header using boost (#3739)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3739)
- [refactor: Ensure input/output label/prediction types match (#3734)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3734)
- [refactor: remove usage of qsort and cmp (#3727)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3727)
- [refactor: remove repeated pragma (#3724)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3724)
- [refactor: move reductions to reductions directory (#3711)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3711)
- [refactor: add prediction and label types to automl (#3714)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3714)
- [refactor: Remove unused code in vw_exception (#3703)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3703)
- [refactor: Move options into `config/`, split files and move impls to cc (#3697)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3697)
- [refactor: migrate functionality to base options object (#3693)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3693)
- [refactor: remove usage of boost is_aligned (#3684)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3684)
- [refactor: rewrite dump_options as a help formatter (#3692)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3692)
- [refactor: decouple help message generation from option parsing implementation (#3690)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3690)
- [refactor: options updates (#3688)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3688)
- [refactor: remove dead code in options (#3652)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3652)
- [refactor: cleanup allowed option types (#3651)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3651)
- [test: added expectile loss function unit tests (#3832)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3832)
- [test: disable flaky test (#3825)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3825)
- [test: Add a unit test for loss functions. (#3799)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3799)
- [test: compare json key-wise as opposed to as text in run_tests.py (#3778)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3778)
- [test: support test ranges in run_tests.py (#3766)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3766)
- [build: use centralized forward declaration header to reduce dependencies (#3804)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3804)
- [build: reduce header includes to improve buildtime (#3803)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3803)
- [build: remove c_test as it is already covered in unit_tests (#3784)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3784)
- [build: migrate cs nuget generation to use cmake infra (#3788)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3788)
- [build: exclude dependencies from all target (#3761)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3761)
- [build: specify binary dir for out of source zlib build (#3755)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3755)
- [build: update warning (#3705)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3705)
- [build: use standard BUILD_TESTING flag in build and warn on install for vendored deps (#3696)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3696)
- [build: use correct platform suffix for Python native shared library (#3678)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3678)
- [build: update fmt and spdlog submodules (#3667)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3667)
- [build: fixing run_tests.py with custom paths (#3665)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3665)
- [ci: change win python caching and fix mirror no longer available (#3835)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3835)
- [ci: remove expired windows-2016 environment (#3836)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3836)
- [ci: install sys deps to avoid clang-tidy checking them (#3820)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3820)
- [ci: consolidate .clang-tidy config file (#3819)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3819)
- [ci: adapt Windows CMake workflow to windows 2022 (#3816)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3816)
- [ci: show correct OS name for python windows ci (#3813)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3813)
- [ci: parallelize valgrind CI (#3807)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3807)
- [ci: try adding 3.10 to macos (#3809)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3809)
- [ci: fix wrong name in python CI (#3810)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3810)
- [ci: fix names in python windows build (#3808)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3808)
- [ci: expand python lint and formatting (#3800)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3800)
- [ci: test splitting apart benchmark and reducing time (#3802)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3802)
- [ci: fix windows python vcpkg caching (#3801)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3801)
- [ci: Change Fix NuGet version tag for sortability (#3752)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3752)
- [ci: only run valgrind CI if code changes are detected (#3783)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3783)
- [ci: generate v141, v142 native nugets (#3762)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3762)
- [ci: x86 windows canary build (#3770)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3770)
- [ci: test standalone build on win and macos too (#3758)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3758)
- [ci: lock ci to windows-2019 (#3749)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3749)
- [ci: consolidate lint CIs (#3720)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3720)
- [ci: retire azure devops macos pipeline (#3723)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3723)
- [ci: consolidate python wheel building into 1 workflow (#3721)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3721)
- [ci: pin benchmarks version (#3719)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3719)
- [ci: create MacOS github action (#3701)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3701)
- [ci: run twine check in ci (#3675)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3675)
- [chore: add release blog post template (#3823)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3823)
- [chore: make issue template a form (#3791)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3791)
- [Remove getRevertingWeight. (#3740)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3740)

</div>

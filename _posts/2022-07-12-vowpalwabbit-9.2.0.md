---
title: "VowpalWabbit 9.2.0 Release Notes"
layout: blog
tags: Release&nbsp;notes
description: Refactoring of library structure, Java string predict/learn, model weights in Python, colored logs
author: Griffin Bassman
avatar_link: https://avatars.githubusercontent.com/bassmang
---

<div class="blog_highlight" markdown="1">
- [GitHub release](https://github.com/VowpalWabbit/vowpal_wabbit/releases/tag/9.2.0)
- [PyPi](https://pypi.org/project/vowpalwabbit/)
</div>

As part of our goal of providing more frequent releases, we are excited to announce VW 9.2.0! Some highlights include a large restructuring of VW's library structure which better organizes related source and header files, the ability to call learn and predict directly from a string in java, access to model weights in Python, and colored output logs for errors, warnings, and general info.

## Highlights

### Refactoring of library structure

Historically VW has clumped together most of the source and headers files for its reductions into one directory. As more features and targets were added, it seemed necessary to better organize this structure so that new and current users could compartmentalize different parts of VW. Check out [this PR](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3876) for more details.

### Support predict and learn directly from string in Java

You can now predict and learn directly from a string in Java with the `predictFromString` and `learnFromString` methods.

### Access model weights in Python

Model weights can now be accessed directly in Python in JSON format using the `json_weights` function.

### [Experimental](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Experimental): Hardening of Automl and Non-Stationary Exploration Algorithms

Both reductions have gone through major revamps to improve their statistical accuracy.

### Mean field implementation for logistic regression

Logistic regression can now take non-binary costs via mean field implementation. E.g. for loss `p` in `[0,1]` the update is `p*update(1) + (1-p)*update(-1)`.

### Colored logs

Logs from VW's command line interface will now display errors in red, warnings in yellow, and info in green.

## Thank you

A huge thank you and welcome to all of the new contributors since the last release:

- [Byron Xu](https://github.com/byronxu99)
- [Bhavya Saraf](https://github.com/0110G)
- [Shaokun Zhang](https://github.com/skzhang1)
- [Oren Michaely](https://github.com/ormichae)
- [Akshay Krishnamurthy](https://github.com/akshaykr)
- [Scott Inglis](https://github.com/singlis)

And of course thank you to existing contributors:

- [Ariel Faigon](https://github.com/arielf)
- [Griffin Bassman](https://github.com/bassmang)
- [Olga Vrousgos](https://github.com/olgavrou)
- [Jack Gerrits](https://github.com/jackgerrits)
- [Eduardo Salinas](https://github.com/lalo)
- [Wangda Zhang](https://github.com/zwd-ms)
- [Markus Cozowicz](https://github.com/eisber)
- [Mark Rucker](https://github.com/mrucker)
- [Rajan Chari](https://github.com/rajan-chari)
- [Peter Chang](https://github.com/peterychang)
- [Alexey Taymanov](https://github.com/ataymano)

<div>
  <i class="fa fa-caret-right"></i>
  <button class="changelist_button">
    Click here to expand and see the full changelist.
  </button>
</div>
<div class="changelist hidden" markdown="1">

## Features
-[feat: [epsilon_decay] add option for minimum examples for champ (#4037)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4037)
-[feat: [C] C Wrapper API support for CATS mode (#4021)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4021)
-[feat: [automl/ep_decay] update design and features review 2 (#4009)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4009)
-[feat: [java] add CATS prediction type support for Java/Spark (#4024)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4024)
-[feat: Enable colored logs to terminal (#4011)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4011)
-[feat: use std::make_unique when using C++14 or newer (#4017)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4017)
-[feat: [Java] Support predict or learn directly from string (#4019)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4019)
-[feat: Port over updated clang-format script from the reinforcement_learning repo (#3992)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3992)
-[feat: [automl/ep_decay] lb_trick option to use 1-lower_bound for upper_bound (#4002)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4002)
-[feat: [automl] algo optimizations (#4001)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4001)
-[feat: [parameters_dense] add more operators to reduce repetition (#4003)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4003)
-[feat: [automl] debug flag to learn challengers in different order (#3996)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3996)
-[feat: use cresseread upper_bound in automl and epsilon_decay (#3991)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3991)
-[feat: support cubic for AutoML (#3971)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3971)
-[feat: [automl] apples to apples score comparison (#3977)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3977)
-[feat: add support function for spark-based multi-class classification (and most label types) (#3961)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3961)
-[feat: add support for dict features in pylibvw (#3959)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3959)
-[feat: feed spanner results into other reductions (#3964)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3964)
-[feat: [automl] store exclusions as flat set (#3960)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3960)
-[feat: include generated interactions during svd step (#3963)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3963)
-[feat: Apply shrink factor (#3955)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3955)
-[feat: Implement barycentric spanner. (#3948)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3948)
-[feat: [automl] adds prog validation to automl when used without cb_explore_adf (#3942)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3942)
-[feat: large action spaces truncated randomized SVD (#3899)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3899)
-[feat: add inline image support to demo (#3933)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3933)
-[feat: add experimental field for custom parser (#3930)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3930)
-[feat: support generic metric hooks to replace specific external parser one (#3929)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3929)
-[feat: mean field implementation for logistic regression (#3522)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3522)
-[feat: Added --ignore_feature flag (#3916)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3916)
-[feat: Add reduction_features to continuous label parser (#3909)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3909)
-[feat: [Epsilon Decay] Add logging for champ changes and add experimental (#3903)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3903)
-[feat: [Epsilon Decay] Use multiple models for each config (#3896)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3896)
-[feat: Decay of Exploration (#3520)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3520)
-[feat: Large actions as exploration base (#3895)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3895)
-[feat: large action spaces initial commit (#3892)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3892)
-[feat: add from_column_names to replace from_colnames which allows for optional labels (#3875)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3875)
-[feat: [py] add api to get model weights in json string (#3858)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3858)

## Fixes
-[fix: Update clang-format script with docker/podman version from rlclientlib (#4028)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4028)
-[fix: [automl] new defaults (#4035)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4035)
-[fix: keep --noconstant flag (#4027)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4027)
-[fix: build/vowpalwabbit/vw -&gt; build/vowpalwabbit/cli/vw (#4033)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4033)
-[fix: default executable path save_resume_test.py (#4032)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4032)
-[fix: [largecb] Add more comments in code. (#4030)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4030)
-[fix: [automl/ep_decay] lb_trick reward (#4029)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4029)
-[fix: [automl] save_load and related bugs (#4025)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4025)
-[fix: fix predictions and output for multline csoaa ldf (#4015)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4015)
-[fix: [automl] dont update dupe score (#4008)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4008)
-[fix: [automl] patch state (gd/cb_adf) being shared by multiple configs (#3998)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3998)
-[fix: [debug] allow unit tests to assert on gd/cb_adf state (#3995)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3995)
-[fix: [automl] remove reserved namespaces and add ccb_slot_namespace (#3993)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3993)
-[fix: use CHECK_SMALL instead of CHECK_CLOSE for large action space tests (#3990)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3990)
-[fix: match cpp cressieread with python (#3985)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3985)
-[fix: add vscode settings to gitignore (#3983)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3983)
-[fix: default tau=1 for automl and epsilon decay (#3978)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3978)
-[fix: [Epsilon Decay] Keep weights consistent across models (#3920)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3920)
-[fix: [automl] hard-coded ppw (#3976)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3976)
-[fix: remove unused array in options_cli (#3975)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3975)
-[fix: maintain order of indexed probabilities in oaa and csoaa (#3965)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3965)
-[fix: epsilon greedy to call update on predictions only during predict (#3967)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3967)
-[fix: [automl] fix initialization of lower and upper bounds (#3958)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3958)
-[fix: Add c parameter for spanner. (#3957)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3957)
-[fix: valgrind to fail when there are leaks (#3953)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3953)
-[fix: [automl] improve debug/introspection (#3950)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3950)
-[fix: remove counter from prediction path in lrq and lrqfa (#3945)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3945)
-[fix: demo/random-noise: minor fixes: (#3951)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3951)
-[fix: large action space optimization check and use correct index (#3947)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3947)
-[fix: Add an expectile_q parameter. (#3932)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3932)
-[fix: saving model to pathlib.Path (#3927)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3927)
-[fix: fix warnings and enable warning as fail for at least 1 CI (#3914)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3914)
-[fix: [Epsilon Decay] Log total champ update count (#3912)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3912)
-[fix: Add reduction features for simple label (#3905)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3905)
-[fix: ignore positional arg tests in c# (#3898)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3898)
-[fix: fix build issue in std latest for consteval fmt constructors (#3862)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3862)
-[fix: fix warning for ambiguous-reversed-operator (#3867)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3867)
-[fix: [python] do not mark list of preparsed examples as new_examples in learn or predict (#3854)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3854)

## Other changes
-[docs: fix notebook picture rendering (#3922)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3922)
-[docs: rename rle to varint to clarify what the function is doing (#3906)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3906)
-[docs: add experimental info to cli docs (#3902)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3902)
-[docs: implement automatic CLI doc generation for website (#3901)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3901)
-[docs: update readme with eigen dep (#3894)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3894)
-[docs: add descriptions for each component and add to readme (#3887)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3887)
-[style: removed explicit tuple creation (#3937)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3937)
-[style: format notebooks (#3917)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3917)
-[refactor: [gd] move normalized_sum_norm_x outside of all/vw object (#4020)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4020)
-[refactor: disable indexing for cb, move option to oaa and csoaa (#4018)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4018)
-[refactor: update vcpkg in github ci (#4016)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4016)
-[refactor: remove unused vars from fb test (#4010)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4010)
-[refactor: [automl] seperate automl reduction vs automl impl (#4006)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4006)
-[refactor: [automl] split io model to seperate dir (#4004)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4004)
-[refactor: update naming automl and ep_decay (#3997)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3997)
-[refactor: resolve requirement to always use {}, update clang tidy check (#3988)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3988)
-[refactor: organize cressiread estimator in cpp (#3982)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3982)
-[refactor: pass in all.wpp to epsilon_decay (#3979)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3979)
-[refactor: [automl] Don't allow inactive configs as champ, clean up lower/upper bound (#3974)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3974)
-[refactor: Convert parser usage of v_array&lt;example*&gt; to multi_ex (#3931)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3931)
-[refactor: update audit string for ccb slot id for clarity (#3928)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3928)
-[refactor: remove redundant sorted_cache variable (#3907)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3907)
-[refactor: cleanup cache functions, add some tests (#3904)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3904)
-[refactor: replace deprecated c headers with c++ equivalent (#3888)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3888)
-[refactor: address follow up comment for from_column_names (#3889)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3889)
-[refactor: refactor cli, core and vwdll targets (#3876)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3876)
-[refactor: consolidate flags and simplify cmake (#3871)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3871)
-[refactor: move spanning tree and bin to components  (#3870)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3870)
-[refactor: migrate explore to library component (#3868)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3868)
-[refactor: refactor flatbuffer parser into a lib (#3864)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3864)
-[refactor: move more components into libs (#3856)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3856)
-[refactor: change slim to conform (mostly) to lib structure (#3853)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3853)
-[refactor: move string view and exception into common lib (#3851)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3851)
-[test: organize cressieread python testing, add upper_bound (#3986)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3986)
-[test: [automl] add failing test comparing q:: with automl champ (#4000)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4000)
-[test: [automl] add dummy config oracle champdupe (#3994)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3994)
-[test: Add test to verify model concat behavior for save load and fix help string (#3968)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3968)
-[test: [ccb] add test for insert_ccb_interactions (#3952)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3952)
-[test: verbose build (#3941)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3941)
-[test: [automl] ignore 411 test on c# (#3946)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3946)
-[test: status quo test of automl with cb_adf (#3944)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3944)
-[test: minor boost test fixes (#3939)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3939)
-[test: don't run test fb conversion in shell (#3924)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3924)
-[test: fix bug and add interesting tests for multi -d support (#3897)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3897)
-[test: ctest is for unit tests and integration tests must be run standalone (#3866)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3866)
-[build: large action spaces and eigen dep behind compile time flag (#4038)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4038)
-[build: remove BUILD_EXTERNAL_PARSER concept (#4036)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4036)
-[build: let cmake handle visibility flags (#4022)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4022)
-[build: Removed x86 CI (#3940)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3940)
-[build: update min cmake version required to 3.10 to reflect dependency changes (#3936)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3936)
-[build: fix FORCE_COLORED_OUTPUT on AppleClang (#3873)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3873)
-[build: allow package_ROOT for search paths and dont guess zlib dir (#3880)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3880)
-[build: ignore BUILD_TESTS option (#3881)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3881)
-[build: support c++20 for USE_LATEST_STD cmake option (#3865)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3865)
-[build: exclude large dirs from python source distribution (#3855)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3855)
-[build: fix installed cmake config (#3859)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3859)
-[build: remove windows visual studion build system (#3849)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3849)
-[build: fix build failure in conda build env (#3848)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3848)
-[build: add library cmake infra and create common lib (#3850)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3850)
-[ci: remove wheel generation for python 3.6 for arm architecture (#3956)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3956)
-[ci: enable clang tidy ci checking headers (#3883)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3883)
-[ci: Enable code scanning for security issues (#3885)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3885)
-[ci: use 2022 in standalone and use latest std (#3872)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3872)
-[ci: update coverage ignore paths (#3874)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3874)
-[ci: allow workflow dispatch for docs (#3847)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3847)
-[chore: update version to 9.2.0 (#4039)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4039)
-[chore: remove privacy preservation code and compile time flag (#4040)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4040)
-[chore: Delete .lgtm.yml (#3938)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3938)
-[chore: add uninit warnings to clang-tidy (#3908)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3908)
-[chore: fix formatting errors (#3893)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3893)
-[chore: fix natvis file after v_array moved into VW:: namespace (#3877)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3877)
-[chore: cleanup two unused windows files (#3882)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3882)
-[chore: remove incorrectly cased duplicate file (#3869)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3869)
-[revert: revert addition of common namespace (#3878)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3878)
-[Change CMAKE_BINARY_DIR to CMAKE_CURRENT_BINARY_DIR (#4005)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4005)
-[fix(demo): random-noise, '-d' before dataset args (#3857)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3857)

</div>

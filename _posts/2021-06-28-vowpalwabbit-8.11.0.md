# VowpalWabbit 8.11.0 Release Notes

---
title: "VowpalWabbit 8.11.0 Release Notes"
layout: blog
tags: Release&nbsp;notes
description: Documentation improvments, python api improvements, cb_to_cb_adf reduction, deprecations and more in VW 8.11.0!
author: Olga Vrousgou
avatar_link: https://avatars.githubusercontent.com/u/10447059?s=400&u=2c0b0e7fdac245b94a8e1ac7c983052d90b9232b&v=4
---

<div class="blog_highlight" markdown="1">
- [GitHub release](https://github.com/VowpalWabbit/vowpal_wabbit/releases/tag/8.11.0)
- [PyPi](https://pypi.org/project/vowpalwabbit/)
</div>

## Release highlights

### Documentation improvments

All python related notebook examples have been made interactive via [jupyter binder](https://jupyter.org/binder) and can now be found [here](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/)

### Track upcoming deprecations

Upcoming deprecations can now be tracked [here](https://github.com/VowpalWabbit/vowpal_wabbit/issues?q=is%3Aissue+is%3Aopen+label%3ADeprecation)

### pyVW related updates and improvments

- VW for Python 3.9 added to windows python build [(#2939)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2939)

The python DataFrame-to-VW effort has been growing, the latest available changes beeing:
- A new tutorial showcasing the latest DataFrame to VW improvments [here](https://github.com/VowpalWabbit/vowpal_wabbit/blob/master/python/examples/DFtoVW_tutorial.ipynb)
- [Get weight from name (#3042)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3042)
- [Add weight attribute to SimpleLabel (#3033)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3033)
- [Add contextual bandit label to DFtoVW (#2713)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2713)

### cb_to_cb_adf reduction

`cb` and `cb_adf` code paths have been consolidated into using the cb_adf path, without however issuing any breaking changes [(#2680)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2680). cb examples are internally translated to cb_adf examples. This behaviour can be turned off by supplying the `--cb_force_legacy` flag when `--cb N` is used. The motivation behind this change is so that the cb reduction can benefit from the work done on cb_adf which has gotten more attention over the years

### `--cubic :::` and `--interactions [:]*` speedup

Using the wildcard (`:`) when doing cubic (`--cubic :::`) and higher order (`--interactions ::::`) interactions has been significantly sped up [(#2993)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2993). This optimization now affects cubics and higher order interactions

### Logging line limiting now available

A new flag has been added that allows the limiting of the log output of VW [(#3021)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3021). By using `--limit_output <N>` a hard limit `N` can be set to the total printed lines. This does not include vw progressive validation loss output which will remain unaffected

### Experimental: Metrics for debugging purposes

Experimental support for getting internal VW metrics has been added [(#2959)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2959) and can be enabled using the `--extra_metrics <output_file>` argument. Currently richer information exists for reductions that use `cb_explore` (see example output for ccb_explore_adf [here](https://github.com/VowpalWabbit/vowpal_wabbit/blob/master/test/test-sets/ref/metrics_ccb.json)). The resulting json schema is still very fluid and is expected to change. Users that build and use VW from source can add their own metrics if they wish to do so. The metrics are also made available via the python api (see [here](https://github.com/VowpalWabbit/vowpal_wabbit/blob/master/python/tests/test_pyvw.py#L447) for a usage example) where they can be accessed via a python dictionary

### Multi-line example data files no longer need to have an extra newline for the last multi-line example at the end of the file

[(#2890)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2890)

### Breaking changes

- BREAKING CHANGE [fix!: cs_active now returns active_multiclass prediction (#2930)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2930)
- BREAKING CHANGE [fix!: Propagate cache reading failure (#2931)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2931)
- BREAKING CHANGE [feat: [dsjson] Malformed lines are now skipped instead of being fatal (#3007)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3007)
  - this can be turned off with the usage of `--strict-parse`

### Internal improvements

Learners can now be built using templated builders [(#2918)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2918) and reductions builders are slowly being transitioned to use the new builders

## Thank you

A huge thank you and welcome to all of the new contributors since the last release:

- [@seznam](https://github.com/AdamStepan)
- [@bassmang](https://github.com/bassmang)

And of course thank you to existing contributors:

- [@cirvine-MSFT](https://github.com/cirvine-MSFT)
- [@ataymano](https://github.com/ataymano)
- [@cheng-tan](https://github.com/cheng-tan)
- [@etiennekintzler](https://github.com/etiennekintzler)
- [@jackgerrits](https://github.com/jackgerrits)
- [@kumpera](https://github.com/kumpera)
- [@lalo](https://github.com/lalo)
- [@olgavrou](https://github.com/olgavrou)
- [@peterychang](https://github.com/peterychang)
- [@pmineiro](https://github.com/pmineiro)
- [@rajan-chari](https://github.com/rajan-chari)
- [@Sharad24](https://github.com/Sharad24)
- [@zwd-ms](https://github.com/zwd-ms)

## Full changelist

<div>
  <i class="fa fa-caret-right"></i>
  <button class="changelist_button">
    Click here to expand and see the full changelist.
  </button>
</div>

<div class="changelist hidden" markdown="1">

## Features
- [feat: [Tutorial] Using DFtoVW and exploring VW output (#3068)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3068)
- [feat: add chained_proxy_iterator to make it easier to iterate entire namespace index groups (#3076)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3076)
- [feat: [pyvw] Get weight from name (#3042)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3042)
- [feat: add cb benchmark with more features (#3080)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3080)
- [feat: add cache helper for reading and writing types directly (#3057)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3057)
- [feat: add several functions to namespaced_features (#3040)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3040)
- [feat: [metrics] cb_explore_adf additional metrics (#3032)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3032)
- [feat: [py] DFtoVW -&gt; Add weight attribute to SimpleLabel (#3033)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3033)
- [feat: Create class to manage dual indexing of feature_groups (#3029)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3029)
- [feat: add flag to limit log output (#3021)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3021)
- [feat: [py] Add contextual bandit label to DFtoVW (#2713)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2713)
- [feat: add generic_range adapter class (#3025)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3025)
- [feat: [py] add api for learner metrics (#3022)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3022)
- BREAKING CHANGE [feat: [dsjson] Malformed lines are now skipped instead of being fatal (#3007)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3007)
- [feat: support cached interaction expansion as a reduction (#2993)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2993)
- [feat: [metrics] add optional metrics for --dsjson (#2992)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2992)
- [feat: [metrics] add support for float (#2991)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2991)
- [feat: add optional extra metrics (#2959)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2959)
- [feat: [cb_adf_explore] prog val print known label (#2961)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2961)
- [feat: consolidate math functions and add combinatorial related funcs (#2965)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2965)
- [feat: [cb cb_adf] prog val print known label (#2957)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2957)
- [feat: Add cb_to_cb_adf reduction (#2680)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2680)
- [feat: Add active multiclass to C# API (#2958)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2958)
- [feat: cross-release benchmarks (#2948)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2948)
- [feat: Enable reduction_features to be accessed from label_parser functions (#2916)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2916)

## Fixes
- [fix: fix gdb pretty printer (#3079)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3079)
- [fix: do not change spdlog global settings (#3077)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3077)
- [fix: cmake build (#3071)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3071)
- [fix: Baseline should signal its enablement through an index and not a feature (#3069)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3069)
- [fix: Fix model corruption on reading model (#3063)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3063)
- [fix: avoid printing extra things when using --help (#3060)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3060)
- [fix: Fix of learning on data with pdrop (#3055)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3055)
- [fix: natvis definition had incorrect member variable name (#3044)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3044)
- [fix: [metrics] set to zero (#3035)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3035)
- [fix: set default learn_returns_prediction to false, refactor cover (#3017)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3017)
- [fix: refactor cb_explore_adf_first (#3012)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3012)
- [fix: Refactor regcb with make_reduction_learner (#3010)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3010)
- [fix: Refactor squarecb with make_reduction_learner (#3009)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3009)
- [fix: warning for const qualifier on reference type (#3008)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3008)
- [fix: regcb save_load and keep mellowness (#3006)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3006)
- [fix: remove non printable ascii char from tests (#3005)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3005)
- [fix: [metrics] account for label action not predicted (#3004)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3004)
- [fix: cb_explore_adf_first.cc save_load (#2997)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2997)
- [fix: keep gamm_exponent in squarecb (#2999)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2999)
- [fix: [metrics] add missing ccb tests (#2996)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2996)
- [fix: bfgs preconditioner, Resolves #2745 (#2995)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2995)
- [fix: Added save_load to squarcb (#2988)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2988)
- [fix: Add read_line_json_s function taking line length (#2968)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2968)
- [fix: Unify duplicated error code headers (#2978)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2978)
- [fix: use nullptr instead of NULL (#2980)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2980)
- [fix: Avoid float to double promotion by using C++ version of math functions (#2979)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2979)
- [fix: fixes for headers not including things they need (#2974)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2974)
- [fix: attempt to fix windows failures (#2956)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2956)
- BREAKING CHANGE [fix!: cs_active now returns active_multiclass prediction (#2930)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2930)
- [fix: fix cost assignment in cats tree (#2900)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2900)
- [fix: cb_adf learn_returns_prediction (#2953)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2953)
- BREAKING CHANGE [fix!: Propagate cache reading failure (#2931)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2931)
- [fix: Stash benchmark scripts (#2950)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2950)
- [fix: set json reader correctly when source is reset (#2947)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2947)
- [fix: assert in custom_streambuf.h (#2946)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2946)
- [fix: invert hash with --save_resume does not include feature name (#2940)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2940)
- [fix: [Version update to 8.10.1] make example_is_newline check depend on bool instead of internal example characteristics (#2890)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2890)

## Other changes
- [style: Use float instead of float ref (#2986)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2986)
- [style: Give template types more descriptive names (#2984)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2984)
- [refactor: remove cast in slim tests (#3098)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3098)
- [refactor: Fix unnecessary usages of char*  (#3085)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3085)
- [refactor: add label and use builder to set learner features in cb_dro.cc (#3059)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3059)
- [refactor: Organize cache usage behind two functions for testing (#3058)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3058)
- [refactor: Refactor cats_tree.cc to use builder to set features of learner (#3053)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3053)
- [refactor: remove unnecessary delete_v_array call (#3050)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3050)
- [refactor: Refactor cb_sample.cc to use builder to set features of learner (#3039)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3039)
- [refactor: Use default copy constructor for `features` (#3038)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3038)
- [refactor: avoid v_array copy in cats_tree (#3037)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3037)
- [refactor: cb_adf learner (#3036)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3036)
- [refactor: Avoid v_array copies (#3030)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3030)
- [refactor: cb_explore_pdf (#3026)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3026)
- [refactor: cb_explore_adf_synthcover (#3024)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3024)
- [refactor: cb_explore_adf_greedy (#3023)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3023)
- [refactor: Non printable namespaces should not be wildcard expanded (#3020)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3020)
- [refactor: CCB participates in interaction reduction expansion (#3013)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3013)
- [refactor: cb_explore_adf_bag.cc make_reduction_learner (#3016)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3016)
- [refactor: refactor cb_explore_adf_rnd.cc with make_reduction_learner (#3014)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3014)
- [refactor: cb_explore_adf_softmax.cc with make_reduction_learner (#3015)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3015)
- [refactor: eval_count_of_generated_ft PR follow up (#3011)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3011)
- [refactor: [metrics] cb_explore_adf optional metrics (#2998)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2998)
- [refactor: Integrate count and sum feat sq into the interaction generation routine (#2987)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2987)
- [refactor: Support const iterators to feature groups (#2972)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2972)
- [refactor: Do not use cstyle casts (guideline 16) (#2981)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2981)
- [refactor: Remove unused foreach_feature func (#2973)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2973)
- [refactor: migrate active_cover learner init (#2960)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2960)
- [refactor: move shared_data to its own header  (#2928)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2928)
- [refactor: update slates setup to new way (#2935)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2935)
- [refactor: Migrate ccb to new make learner structure (#2923)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2923)
- [refactor: migrate bfgs to new style learner creation (#2926)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2926)
- [refactor: Remove delete_label (#2925)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2925)
- [refactor: remove delete_unions (#2924)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2924)
- [refactor: Simple label uses reduction features for initial (#2920)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2920)
- [refactor: Remove copy label (#2921)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2921)
- [refactor: Refactor learner construction (#2918)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2918)
- [refactor: [DFtoVW] Use more generic numpy types, add attribute name to Feature (#2909)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2909)
- [refactor: Reduce number of raw pointers (#2915)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2915)
- [test: add tests for namespaces with same first letter (#3096)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3096)
- [test: [py] fix random failure by lowering value (#3089)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3089)
- [test: Add test for self interaction with multiple feature_groups (#3074)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3074)
- [test: add cb simulation tutorial as test (#3072)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3072)
- [test: add baseline test (#3070)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3070)
- [test: ensure python3 is used for test scripts (#3041)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3041)
- [test: Add tests for vw_math and fix one function (#2966)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2966)
- [build: Enable building Python library using VS2019 (#3078)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3078)
- [build: [WIP] Enable building C# projects on Windows with CMake (#2929)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2929)
- [build: add 3.9 to windows python build (#2939)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2939)
- [build: Update build_python_wheels_macos.yml (#2937)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2937)
- [ci: Reduce CI burden (#3048)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3048)
- [ci: Add codecov token to help codecov identify uploaded coverage reports (#3045)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3045)
- [ci: Make LGTM ignore ext_libs directory (#2967)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2967)
- [ci: Use the base ref of a PR to compare against for benchmarks (#2955)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2955)
- [ci: fix invalid job name (#2954)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2954)
- [ci: standardize ci names (#2952)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2952)
- [ci: run CI on release branches (#2942)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2942)
- [ci: update brew to mitigate bintray brownout (#2941)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2941)
- [ci: Update check_pr_title.yml (#2922)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2922)
- [ci: Enable CI for VW Slim (#2914)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2914)
- [chore: add deprecation notice for #3084 feature_self_interactions (#3099)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3099)
- [chore: fix deprecation issue template (#3092)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3092)
- [chore: add requirements file to be used by binder (#3087)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3087)
- [chore: Add deprecation template (#3028)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3028)
- [chore: Make it clear that gitter and stack overflow are &quot;conversational&quot; issue options (#3047)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3047)
- [chore: Delete new_version (#2932)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2932)
- [revert: Revert path include changes (#3049)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3049)
- [Update dev environment to use new image (#3001)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3001)
- [Fixing json parse issue when pdrop is 0 (#2977)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2977)
- [fix newline when building standalone benchmarks (#2951)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2951)
- [fix typo (#2949)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2949)
- [Fix python manifest for ext_libs (#2938)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2938)
- [Update .clang-format (#2917)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2917)
- [Create check_pr_title.yml (#2919)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2919)
- [Remove caching of Windows CI build targets (#2913)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2913)

</div>
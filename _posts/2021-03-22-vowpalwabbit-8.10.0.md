---
title: "VowpalWabbit 8.10.0 Release Notes"
layout: blog
tags: Release&nbsp;notes
description:
author: Jack Gerrits
avatar_link: https://avatars1.githubusercontent.com/u/7558482?s=400&u=21e4cca683799d65a20a4cf3d11d0c17853ef9cb&v=4
---

<div class="blog_highlight" markdown="1">
- [GitHub release](https://github.com/VowpalWabbit/vowpal_wabbit/releases/tag/8.10.0)
- [PyPi](https://pypi.org/project/vowpalwabbit/)
</div>

## `-q ::` speedup
Using the wildcard (`:`) when doing quadratic interactions (`-q ::`) has been significantly sped up [(#2807)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2807). This optimization only affects quadratics interactions for now, and not cubics or higher order interactions.

We saw a 35% speedup for [one of the benchmarks which tests quadratic interactions](https://github.com/VowpalWabbit/vowpal_wabbit/blob/68cedd7a35230eeb604a8f954b2bdc67f1cdec14/test/benchmarks/rcv1_benchmarks.cc#L4857). Additionally, we saw that the runtime for a CCB ADF run with a file of 347k examples and 3 interactions (Action,Slot,User) from ~11m41s to ~1m50s.

## Initial ARM Support
We've added initial ARM support with this release. VW should now be able to build on ARM platforms, we are not yet supporting binary Python wheels on ARM yet though. The command line tool is now supported natively on Apple Silicon, and will be available once the Homebrew package is updated to 8.10.

## Logging changes
We've made some steps to improve logging in VW, starting with unifying what we have on one system and adding log levels. This is still a bit of a work in progress, and so not all output quite follows it yet.

### Goals of the logging work
- Easier to understand warnings, info, errors, etc
- Ability to filter by level
- Machine readable log format
- More sensible output when VW is used as a library

### Changes

- Progressive validation remains the same
- Other logging messages have a log level prepended to the line

#### Comparison
##### Old
```
Num weight bits = 18
learning rate = 0.5
initial_t = 0
power_t = 0.5
using no cache
Reading datafile = train-sets/malformed.dat
num sources = 1
Enabled reductions: gd, scorer
average  since         example        example  current  current  current
loss     last          counter         weight    label  predict features
malformed example! '|',space, or EOL expected after : "| x:0.7"in Example #0: "| x:0.7"
malformed example! '|' or EOL expected after : "| x:0.7"in Example #0: "| x:0.7"
```

##### New
```
Num weight bits = 18
learning rate = 0.5
initial_t = 0
power_t = 0.5
using no cache
Reading datafile = train-sets/malformed.dat
num sources = 1
Enabled reductions: gd, scorer
average  since         example        example  current  current  current
loss     last          counter         weight    label  predict features
[warning] malformed example! '|',space, or EOL expected after : "| x:0.7"in Example #0: "| x:0.7"
[warning] malformed example! '|' or EOL expected after : "| x:0.7"in Example #0: "| x:0.7"
```

## Experimental: Flatbuffers
Experimental support for Flatbuffer schematized examples as an input format has been added. Flatbuffers are a schematized binary format and should provide efficiency and portability when used. This is still experimental as we want to ensure the schema is complete for real world use, documentation is currently limited, not all binary released support it and tooling to make it easier to work with is not there yet. The schema for the example objects can be found [here](https://github.com/VowpalWabbit/vowpal_wabbit/blob/3e4996533abac3d00c4174007705c94cdbd80759/vowpalwabbit/parser/flatbuffer/schema/example.fbs), but the file itself contains a sequence of size prefixed such objects to allow streamed input.

When building from source support is disabled by default but can be enabled by passing `-BUILD_FLATBUFFERS=ON` to the CMake congigure step.

## Contextual Bandit Zeroth Order Optimization
Contextual Bandit Zeroth Order Optimization (CBZO) is a new reduction (contributed by [@ajay0](https://github.com/ajay0)). CBZO is a contextual bandit-style algorithm meant for a multi-dimensional, continuous action space. It can learn different policies based on Zeroth-Order Optimization -- continuous optimization techniques which make use of gradient estimators that only require values of the function to make an estimate. The variant of CBZO currently implemented in VW works in the 1-dimensional action space setting and can learn either constant or linear policies. The algorithm has optimal bounded regret when the cost function is smooth and convex.

[Learn more at the wiki page.](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Contextual-Bandit-Zeroth-Order-Optimization)

## Internal improvments
- Progress towards label information not being required in predict calls and reducing the number of redundant predict calls done before a learn call takes place
- New Python test runner script which supports parallelized tests
- Overhaul `v_array` to be an RAII type
- Enable prediction and label structures to be RAII types

## Thank you

A huge thank you and welcome to all of the new contributors since the last release:

- [@ajay0](https://github.com/ajay0)
- [@orktes](https://github.com/orktes)
- [@zhxiaogg](https://github.com/zhxiaogg)

And of course thank you to existing contributors:

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


- [Add missing {} in fmt strings (#2910)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2910)
- [Migrate example copying to `clone` function and deprecate old methods (#2906)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2906)
- [Fix learn semantics (#2207)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2207)
- [coin weights fix (#2844)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2844)
- [Fix memory tree demo (#2908)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2908)
- [Deprecate v_array::resize (#2905)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2905)
- [Deprecate v_array incr and decr (#2904)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2904)
- [Deprecate explicit copy functions and use std::copy as implementation (#2903)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2903)
- [cb model 2 ccb trainer  (#2884)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2884)
- [[test] draw reduction graph (#2896)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2896)
- [Create a CMake based Windows CI (#2894)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2894)
- [v_array: rename end_array -> _end_array (#2901)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2901)
- [v_array: rename actual_resize -> resize_but_with_stl_behavior (#2902)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2902)
- [Only add sse flags on x86 systems (#2899)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2899)
- [label initialization (#2879)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2879)
- [add ability to use system installs for fmt, spdlog (#2898)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2898)
- [Make v_array internals private, don't allow begin/end to be modified (#2874)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2874)
- [Use trace_message for shared_data output (#2883)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2883)
- [Replace strncpy wit memcpy as the former is flagged as unsafe by linters. (#2869)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2869)
- [[ci] cache nuget (#2887)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2887)
- [Create benchmark workflow that can be manually run for two refs (#2889)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2889)
- [Fix incorrect {VW} substitution (#2892)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2892)
- [move fmt-dependent definitions into its own header to avoid exposing … (#2895)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2895)
- [Support Loading the VW JNI library from JAR. (#2886)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2886)
- [Support valgrind in the Python runtests (#2893)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2893)
- [Use newer resize in plt (#2878)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2878)
- [[Flatbuffers] actually skip tests that flatbuffers don't convert in flatbuffers run_test (#2882)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2882)
- [ftrl learners invert_hash fix (#2853)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2853)
- [[Flatbuffers] add initial field to simple label (and enable --nn test) (#2885)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2885)
- [[py] add enabled_reductions api (#2877)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2877)
- [Update format_check.yml (#2881)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2881)
- [Use erase for ignore some (#2875)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2875)
- [Fix calloc_reserve and push_many (#2873)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2873)
- [Logger libs (#2876)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2876)
- [v_array insert range (#2872)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2872)
- [Move rapidjson to ext_libs folder. Fix fmt/spdlog install (#2870)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2870)
- [[test] RunTests VW options coverage script (#2868)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2868)
- [Report completion for skipped tests (#2857)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2857)
- [Add json parsing for dedup-ed examples (#2848)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2848)
- [Remove unneeded deletes from tests (#2845)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2845)
- [Do a fuzzy float compare instead of exact (#2855)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2855)
- [Use insert and erase in interact (#2846)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2846)
- [Add test for interact reduction (#2850)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2850)
- [Refactoring VW logging (#2813)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2813)
- [[test] add missing diff files (#2865)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2865)
- [fix (#2864)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2864)
- [add vw empty version (#2863)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2863)
- [[cb, cb_explore] small refactor for reuse (#2862)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2862)
- [[cbify] cbify_adf_data refactor (#2861)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2861)
- [[test] check for missing test ids (#2860)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2860)
- [re-enable fb tests (#2858)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2858)
- [fb off by default in linux build (#2856)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2856)
- [Use insert for search push_at (#2847)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2847)
- [Let external parser link libraries to vw (#2854)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2854)
- [Add bounds check for explicit test number running (#2849)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2849)
- [Inject artificial dependencies for bash script based tests (#2851)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2851)
- [Implement v_array::insert for single elements (#2843)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2843)
- [Remove the inner v_array from io_buf (#2837)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2837)
- [Don't use implementation details of v_array in helper functions (#2842)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2842)
- [Explicit delete_v is no longer needed (#2841)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2841)
- [Remove search v_array misuse (#2840)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2840)
- [Implement v_array::erase (#2838)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2838)
- [add scaffolding for adding an external (binary) parser (#2829)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2829)
- [[CATS ] report average loss instead of label cost (#2791)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2791)
- [fix --help's help message (#2836)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2836)
- [Fix a case where VW would wait for more input on stdin rather than returning the already complete line (#2835)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2835)
- [Enforce that v_array only contains TriviallyCopyable types (#2831)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2831)
- [v_array unit tests (#2830)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2830)
- [Ataymano/python safe constructor (#2826)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2826)
- [Fix confusing API - dealloc_example (#2828)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2828)
- [add quiet check before outputting to trace_message (#2833)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2833)
- [v_array cleanup (#2824)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2824)
- [Add reserve, resize_actual, make erase_count private (#2823)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2823)
- [Remove manual prediction deletion now that it is automatic (#2827)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2827)
- [Fix make_config PreBuildEvent for windows build (#2825)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2825)
- [Remove code that can now be default (#2821)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2821)
- [Add capacity function to v_array and migrate usage (#2822)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2822)
- [Deprecate v_array pop and last in favor of standardized pop_back and back (#2819)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2819)
- [Fix string too long compile error (#2817)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2817)
- [[v_array] Make v_array an RAII type (#2771)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2771)
- [[Prediction] Modernize polypred a little by introducing ctor. (#2775)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2775)
- [Make -q :: faster by calculating interactions on the fly instead of pre calculating them (#2807)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2807)
- [Add predictions to test comparisons (#2816)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2816)
- [[CATS] bandwidth as a property of continuous action range (#2788)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2788)
- [Fix fallback fuzzy compare (#2815)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2815)
- [Fix parse_neighbor_features function (#2811)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2811)
- [Add name field to learner and add learner callstack print statements (#2624)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2624)
- [Consolidate ostream inner sink to using VW::io::writer framework (#2801)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2801)
- [Consolidate get_observed_cost implementations (#2792)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2792)
- [Add more tests for interactions (#2806)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2806)
- [[nn] fix double free (#2802)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2802)
- [Refactor trace_message and vw_ostream to allow for arbitrary streambuf objects (#2800)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2800)
- [don't fail in vcpkg auto link check if vcpkg is not configured (#2797)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2797)
- [Make flatbuffers optional (#2696)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2696)
- [check for newline when ccb in parser (#2796)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2796)
- [enable audit info in flatbuffers (#2794)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2794)
- [[py] fix test (#2756)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2756)
- [Don't export lib symbols from vw_jni binary when static linking (#2789)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2789)
- [Make label_type a property of label_parser (#2784)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2784)
- [[help] fix inconsistencies (#2783)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2783)
- [Full RunTests for flatbuffers (#2741)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2741)
- [Filtered --help output by enabled reductions (#2718)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2718)
- [share example (namespace) objects inside object collections (#2729)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2729)
- [[py] add native python vw config (#2629)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2629)
- [[py] fix log issue (#2778)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2778)
- [refactor header print to sd (#2776)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2776)
- [[py] convenience api to get cerr/cout vw output (#2749)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2749)
- [[test] add vw version test (#2774)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2774)
- [[test] fix exception message of test (#2770)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2770)
- [Make prediction a struct. (#2761)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2761)
- [Fix cbzo test dependency mention (#2769)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2769)
- [Change Polylabel to a struct of objects instead of union (#2275)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2275)
- [fix invert hash (#2768)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2768)
- [printable slot interactions (#2767)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2767)
- [Fail instead of returning default (#2765)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2765)
- [Typed option update (#2753)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2753)
- [Fix some warnings (#2762)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2762)
- [Add flatbuffer label for continuous actions (#2743)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2743)
- [Add Python 3.9 wheel for Linux (#2752)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2752)
- [Decouple concrete option type from the building interface (#2759)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2759)
- [[cbify] Fix another dangling pointer in example to a cached v_array. (#2758)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2758)
- [ccb test can have outcomes and explicit included actions (#2742)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2742)
- [[py] with syntax for vw (#2751)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2751)
- [Duplicated interactions issue mitigation (#2746)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2746)
- [Revert &quot;redirect cerr and cout (#2710)&quot; (#2757)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2757)
- [Fix fallthrough warning (#2754)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2754)
- [Implement 1-slot continuous CB (#2410)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2410)
- [Add python bindings for pdf prediction type (#2744)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2744)
- [Fix missing progressive validation header (#2750)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2750)
- [Update types used as option input (#2734)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2734)
- [redirect cerr and cout (#2710)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2710)
- [Add required new option type for constrained option input types (#2738)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2738)
- [Adding a new line at the end of 2 multiline tests (#2740)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2740)
- [Fix some flatbuffer bugs (#2739)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2739)
- [Cats pdf hint in text (#2728)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2728)
- [[cbify] Fix dangling pointer in example due prediction array caching. (#2730)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2730)
- [Runtests driver in Python (#2715)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2715)
- [Pass reduction features to label parsers (#2727)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2727)
- [Remove unused label_size from label_parser struct (#2716)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2716)
- [Benchmark fixes (#2726)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2726)
- [Increase benchmarks to 10 reps, 2s min time (#2725)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2725)
- [Rcv1 benchmarks (#2722)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2722)
- [Vcpkg do not link everything (#2720)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2720)
- [Update run-benchmarks.sh (#2723)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2723)
- [Fix MacCI: uninstall openssl not needed anymore](https://github.com/VowpalWabbit/vowpal_wabbit/pull/anymore)
- [Flatbuffers multi_ex (#2717)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2717)
- [[test] runtest parser feature mask fix (#2714)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2714)
- [[test] add --help test (#2712)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2712)
- [Use ProjectDir for fb schema location (#2711)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2711)
- [make options a unique_ptr (#2705)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2705)
- [Fix issue with index in DFtoVW.empty_col (#2703)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2703)
- [Turn CCB sanity checks into reported errors (#2698)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2698)
- [Make a copy when doing text based parsing (#2706)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2706)
- [[py] Run parser automatically based on str (#2702)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2702)
- [Run doctest in Python CI (#2708)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2708)
- [Fix examples in python lib docs (#2707)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2707)
- [renaming (#2704)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2704)
- [Add test to check regression of dsjson in python (#2699)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2699)
- [Update vw.h (#2700)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2700)
- [CCB don't ignore slot namespace in interactions when slots have default namespace (#2684)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2684)
- [Use variable for port (#2701)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2701)
- [Fix missing test ref files (#2697)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2697)
- [Use unique ports in each test (#2695)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2695)
- [CB-as-CCB action indexing fix (#2689)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2689)
- [Allow port to be selected in spanning tree tool (#2692)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2692)
- [Do not go up directory in test definitions (#2690)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2690)
- [[test] Add dicionary and feature_mask (#2693)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2693)
- [To ensure runs are identical cache tests should use kill cache (#2688)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2688)
- [Add two safe numeric casts (#2679)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2679)
- [Update restore.sh (#2683)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2683)
- [Cats response during inference based on user provided hints (#2643)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2643)
- [Add third party notice (#2664)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2664)
- [fix types (#2677)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2677)
- [Stream flatbuffers instead of reading entire file (#2670)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2670)
- [[test] runtests parser (#2651)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2651)
- [Access union types with field access instead of cstyle casts (#2665)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2665)
- [Fix CMake for libvw and libvw_c_wrapper install (#2673)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2673)
- [Remove a raw pointer (#2666)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2666)
- [cats via python (#2668)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2668)
- [Syntheticcover exploration (#2663)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2663)
- [Fix options warnings on macos (#2660)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2660)
- [Remove generated flatbuffer file (#2661)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2661)
- [Fix cover bug (#2647)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2647)
- [Flatbuffers (#2496)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2496)
- [Refactor explore_eval fix (#2642)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2642)
- [add learn benchmarks (#2657)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2657)
- [added java api binding for ccb learner (#2644)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2644)
- [fix FOLDER_NAME variable in build_docs.yml (#2655)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2655)
- [remove deprecated set-env (#2654)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2654)
- [[tests] fix format of comments (#2649)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2649)
- [Update build_python_wheels_macos.yml (#2650)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2650)
- [update builds to point to latest vw image (#2641)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2641)
- [Add framework for managing predict_data in the reduction stack (#2282)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2282)
- [Update PACKAGE.rst (#2640)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2640)

</div>

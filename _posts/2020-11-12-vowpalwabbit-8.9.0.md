---
title: "VowpalWabbit 8.9.0 Release Notes"
layout: blog
tags: Release&nbsp;notes
description: This release includes major features such as continuous actions, square CB, probabilistic label tree, slates, CB distributionally robust optimization, CB ADF RND, Python wheels and many bug fixes.
author: Jack Gerrits
avatar_link: https://avatars1.githubusercontent.com/u/7558482?s=400&u=21e4cca683799d65a20a4cf3d11d0c17853ef9cb&v=4
---

<div class="blog_highlight" markdown="1">
- [GitHub release](https://github.com/VowpalWabbit/vowpal_wabbit/releases/tag/8.9.0)
- [PyPi](https://pypi.org/project/vowpalwabbit/)
</div>

It's been a while since we last released, but a lot of exciting things have been going on!

Let's take a look at some of the big items from this release.

## Python Wheels

We now produce Python wheels for [most platforms](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Python#support) which are uploaded to PyPi. This means you almost never have to build from source to use VW in Python! We're committed to making using VW in Python a great experience, and this is just the first step.

## String feature values in text format
In a small expansion of the text format you can now supply a string as the value for a feature. This strictly adds a case which is now valid and doesn't affect any existing valid data files. If this was tried previously you'd receive a malformed example warning and the feature would be skipped. When a feature value is supplied in this way the hash is now calculated as `hash(feature_value, hash(feature_name, namespace_hash))` where hash's signature is `hash(input, seed)`. This chained hashing is denoted by a `^` in the audit output.

```sh
echo "| myname:myvalue" | vw --audit
```

**Output:**
<div class="output" markdown="1">

Num weight bits = 18
learning rate = 0.5
initial_t = 0
power_t = 0.5
using no cache
Reading datafile =
num sources = 1
Enabled reductions: gd, scorer
average  since         example        example  current  current  current
loss     last          counter         weight    label  predict features
0
	myname^myvalue:112555:1:0@0	Constant:116060:1:0@0
    n.a.     n.a.            1            1.0  unknown   0.0000        2

finished run
number of examples = 1
weighted example sum = 1.000000
weighted label sum = 0.000000
average loss = n.a.
total feature number = 2

</div>

- [Input format wiki](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Input-format)
- [Audit wiki](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Audit)

## Continuous Actions
CATS is a contextual bandit algorithm with a continuous action space. It uses epsilon greedy exploration with tree policy classes and smoothing.

CATS, utilizing the features given as input, will first choose a center from a continuous action range using a tree policy, and then will use a bandwidth to determine a radius of randomization around the chosen center (centers or discrete actions). The depth of the tree and the bandwidth need to be specified beforehand.

Thanks to Maryam Majzoubi ([@mmajzoubi](https://github.com/mmajzoubi)) for this contribution.

- [Read the paper](https://arxiv.org/pdf/2006.06040.pdf)
- [Learn more at the wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/CATS,-CATS-pdf-for-Continuous-Actions)
- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2493)

## Square CB
Square CB is a new exploration algorithm for contextual bandits which works by reducing contextual bandits to regression. It is the first reduction of this type that provably has optimal performance for contextual bandits, and has comparable runtime to other basic exploration algorithms such as epsilon-greedy. Empirically, it has been shown that it has competitive performance on the large-scale evaluation setup from the [bake-off paper](https://arxiv.org/abs/1802.04064).

Thanks to Dylan Foster ([@canondetortugas](https://github.com/canondetortugas)) for this contribution.

- [Learn more at the wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Contextual-Bandit-Exploration-with-SquareCB)
- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2536)

## Probabilistic Label Tree
Probabilistic label tree is a new reduction for logarithmic time multilabel classification. It is especially useful when there is a large number of classes, around 10000 or more.

Thanks to Marek Wydmuch ([@mwydmuch](https://github.com/mwydmuch)) for this contribution.

- [Read the paper](http://proceedings.mlr.press/v48/jasinska16.html)
- [See a demo of it](https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/demo/plt)
- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2440)

## Slates
Slates is a multi slot algorithm which builds upon the ideas of [Conditional Contextual Bandit](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Conditional-Contextual-Bandit). It adds the following constraints:

1. There is a single global reward
2. Slots have disjoint action sets

- [Learn more at the wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Slates
)
- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2347)

## Contextual Bandit Distributionally Robust Optimization
This reduction adds support for distributionally robust optimization for contextual bandits in VW.

- [Learn more at the wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Contextual-Bandit-Distributionally-Robust-Optimization-(cb_dro))
- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2203)

## CB Explore ADF RND
This adds a new exploration algorithm for CB ADF inspired by random network distillation.

- [Learn more at the wiki page (point 5.)](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Contextual-Bandit-algorithms#changing-action-set-or-featurized-actions
)
- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2407)

## Initial Pandas support in Python

We introduced in this release `DFtoVW`, a class that converts `pandas.DataFrame` object into VW input format. To use import it from `vowpalwabbit.DFtoVW`. We currently support simple label, multiclass label and feature transformations.

Example:
```python
from vowpalwabbit.DFtoVW import DFtoVW, SimpleLabel, Feature, Namespace
import pandas as pd

df = pd.DataFrame({"y": [1, -1], "a": [2, 3], "b": [3, 2]})
conv1 = DFtoVW(df=df,
    label=SimpleLabel("y"),
    features=[Feature("a"), Feature("b")])
conv1.convert_df()
# ['1 | a:2 b:3', '-1 | a:3 b:2']

conv2 = DFtoVW(df=df,
    label=SimpleLabel("y"),
    namespaces=[Namespace(name="ns1", features=Feature("a"))])
conv2.convert_df()
# ['1 |ns1 a:2', '-1 |ns1 a:3']
```

- [Input format wiki](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Input-format)
- [Documentation](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/vowpalwabbit.DFtoVW.html#vowpalwabbit.DFtoVW.DFtoVW)
- [More examples](https://github.com/VowpalWabbit/vowpal_wabbit/blob/master/python/tests/test_DFtoVW.py)
- [Code](https://github.com/VowpalWabbit/vowpal_wabbit/blob/80917701fb0353f8f862cab3a0f8425bab37396c/python/vowpalwabbit/DFtoVW.py#L517)

Thanks to Etienne Kintzler ([@etiennekintzler](https://github.com/etiennekintzler)) for this contribution.


## New options
### `--chain_hash`
In the JSON and DSJSON formats when a string was supplied as a value the old behavior was to concatenate the property name with the value. This option changes the behavior to hash the feature name a long with the value to determine the feature index. The old behavior is deprecated and you'll receive a warning if `--chain_hash` is not supplied and you are using either `--json` or `--dsjson`. The old behavior will be removed in a future version.

- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2214)

### `--local`
When a model is saved in active learning mode, it resumes active learning when loaded (i.e., it starts listening for input on a port and ignoring local sources).
This option allows the user to change this behaviour (so that the Python library can interact with the loaded model, for example).

Contributed by [@zechyw](https://github.com/zechyw).

- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2411)

### `--dry_run`
This option will skip running the driver. It is especially helpful with the new diagnostic about enabled reductions.

**Example:**
```sh
vw --ccb_explore_adf --dry_run
```

**Output:**
<div class="output" markdown="1">

Num weight bits = 18
learning rate = 0.5
initial_t = 0
power_t = 0.5
using no cache
Reading datafile =
num sources = 1
Enabled reductions: gd, scorer, csoaa_ldf, cb_adf, cb_explore_adf_greedy, cb_sample, shared_feature_merger, ccb_explore_adf

finished run
number of examples = 0
weighted example sum = 0.000000
weighted label sum = 0.000000
average loss = n.a.
total feature number = 0

</div>

- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2531)

### `--nounif`
This option was added to cb_explore with cover so that it can behave the same way as cb_explore_adf_cover which provides a switch for turning off the uniform exploration on zero-probability actions. Uniform exploration on zero-probability actions is now on by default in cb cover to match the existing behavior of cb_explore_adf_cover.

- [Pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2633)

## Other improvements
- [Automatic documentation generation on each commit.](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2381) Published here: https://vowpalwabbit.org/docs
- [Valgrind checking on every pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2316)
- [Formatting checks on PR diffs](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2538)
- [Invert hash now includes all weights even if they do not have an audit string](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2246)
- [Use TCP_NODELAY for daemon sockets to avoid Nagle introducing long delay](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2269)
- [Use a power of 10 lookup table to improve VW text parser perf for exp lookups](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2490)
- [Refactor IO abstractions into generic writers and readers](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2412)

## Thank you

A huge thank you and welcome to all of the new contributors since the last release:

- [@adityauser](https://github.com/adityauser)
- [@canondetortugas](https://github.com/canondetortugas)
- [@etiennekintzler](https://github.com/etiennekintzler)
- [@mmajzoubi](https://github.com/mmajzoubi)
- [@mritunjaysharma394](https://github.com/mritunjaysharma394)
- [@mwydmuch](https://github.com/mwydmuch)
- [@olgavrou](https://github.com/olgavrou)
- [@RituRajSingh878](https://github.com/RituRajSingh878)
- [@SchuylerGoodman](https://github.com/SchuylerGoodman)
- [@Sharad24](https://github.com/Sharad24)
- [@Smit-create](https://github.com/Smit-create)
- [@thealphadollar](https://github.com/thealphadollar)
- [@timgates42](https://github.com/timgates42)
- [@zechyw](https://github.com/zechyw)
- [@zwd-ms](https://github.com/zwd-ms)

And of course thank you to existing contributors:
- [@arielf](https://github.com/arielf)
- [@ataymano](https://github.com/ataymano)
- [@cheng-tan](https://github.com/cheng-tan)
- [@gramhagen](https://github.com/gramhagen)
- [@jackgerrits](https://github.com/jackgerrits)
- [@kumpera](https://github.com/kumpera)
- [@lalo](https://github.com/lalo)
- [@lokitoth](https://github.com/lokitoth)
- [@peterychang](https://github.com/peterychang)
- [@pmineiro](https://github.com/pmineiro)
- [@rajan-chari](https://github.com/rajan-chari)


## Full changelist

<div>
  <i class="fa fa-caret-right"></i>
  <button class="changelist_button">
    There were plenty more changes! Click here to expand and see the full changelist.
  </button>
</div>

<div class="changelist hidden" markdown="1">

- [cover to mimic cover adf (#2633)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2633) - olgavrou
- [Enable automatic CB and CCB equivalence for single slot examples (#2610)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2610) - Jack Gerrits
- [fixed duplicate quadratic interactions (#2636)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2636) - Rajan
- [bug fix: action index is inconsistent in explore_eval (#2631)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2631) - cheng-tan
- [benchmark against master (#2637)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2637) - olgavrou
- [Experimental benchmarking pipeline (#2625)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2625) - olgavrou
- [cats pdf edge cases (#2623)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2623) - olgavrou
- [Make chain hash the default with text format and warn with json formats (#2634)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2634) - Jack Gerrits
- [Update DFtoVW examples to reflect the move to a different file (#2632)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2632) - Jack Gerrits
- [[py] add docs for DFtoVW (#2630)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2630) - Eduardo Salinas
- [Add python to clang format script (#2627)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2627) - Jack Gerrits
- [Run clang-format over codebase (#2626)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2626) - Jack Gerrits
- [Update ubuntu version for formatting CI (#2628)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2628) - Jack Gerrits
- [Rename p, lp, simple_label (#2622)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2622) - Jack Gerrits
- [Contributing guidelines (#2508)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2508) - Eduardo Salinas
- [Fix msbuild warnings C4005, C4242 (#2619)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2619) - Schuyler Goodman
- [[py] add test based on example (#2617)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2617) - Eduardo Salinas
- [Change loss function to a unique_ptr (#2616)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2616) - Jack Gerrits
- [[log_multi] remove extra arg (#2615)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2615) - Eduardo Salinas
- [Create test for programmatic access to Search SequenceSpanTask in DotNet (#2595)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2595) - Jacob Alber
- [--dry_run &amp; elevate &quot;option gates&quot; into a native feature of options (#2531)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2531) - Eduardo Salinas
- [remove throw (#2604)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2604) - John
- [Add exit scope for predictions (#2611)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2611) - olgavrou
- [Make the duplicate interactions warning respect --quiet (#2612)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2612) - Jack Gerrits
- [[py] Default feature name based on pandas colname, default VW separator based on type (#2609)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2609) - Etienne Kintzler
- [[py] move DFtoVW to its own file](https://github.com/VowpalWabbit/vowpal_wabbit/pull/unknown) - Eduardo Salinas
- [Remove the possibility in DFtoVW to provide constant values (#2601)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2601) - Etienne Kintzler
- [Ensure CCB labels are restored if an exception is throw. Add temporary logging so we can validate the fix. (#2602)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2602) - Rodrigo Kumpera
- [Ensure CCB labels are restored if an exception is throw. Add temporary logging so we can validate the fix. (#2603)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2603) - Rodrigo Kumpera
- [cats to respect --quiet (#2597)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2597) - olgavrou
- [Add multilabels class for DFtoVW (#2547)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2547) - Etienne Kintzler
- [Support using &quot;_p&quot; in DSJSON parser. (#2592)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2592) - zwd-ms
- [Update PACKAGE.rst (#2594)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2594) - Jack Gerrits
- [Create CI for producing Windows Python wheels (#2593)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2593) - Jack Gerrits
- [Continuous actions dsjson (#2590)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2590) - olgavrou
- [Run Python wheel CI for PRs (#2591)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2591) - Jack Gerrits
- [Revert &quot;[Build] Make vw_io an object library  (#2564)&quot; (#2588)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2564) - Jack Gerrits
- [Only depend on vw_c_api_unit_test when BUILD_EXPERIMENTAL_BINDING is on (#2586)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2586) - Jack Gerrits
- [Build+Test Python wheels for MacOS in CI (#2585)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2585) - Jack Gerrits
- [Require exact Python version to be found (#2583)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2583) - Jack Gerrits
- [Update setup.py (#2584)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2584) - Jack Gerrits
- [Remove boost thread dep (#2580)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2580) - Jack Gerrits
- [Remove Boost::system dependency (#2581)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2581) - Jack Gerrits
- [Update build_python_wheels.yml (#2582)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2582) - Jack Gerrits
- [Update Python build script to allow for wheel generation (#2579)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2579) - Jack Gerrits
- [Continuous actions (#2493)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2493) - Maryam Majzoubi
- [Use correct type in static assert (#2575)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2575) - Jack Gerrits
- [Use strings for warning names (#2574)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2574) - Jack Gerrits
- [Use target based property, remove duplicated link (#2569)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2569) - Jack Gerrits
- [Implement reader and writer to be used with raw c api (#2565)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2565) - Jack Gerrits
- [Add options stubs (#2570)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2570) - Jack Gerrits
- [[CAPI] Add stubs for VW workspace (#2563)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2563) - Jack Gerrits
- [Fail on warnings (#2571)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2571) - olgavrou
- [Fix include path to use header out of binary dir (#2572)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2572) - Jack Gerrits
- [Initial step for finding static lib deps on Windows (#2568)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2568) - Jack Gerrits
- [[Build] Make vw_io an object library  (#2564)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2564) - Jack Gerrits
- [Define cpack variables and include CPack (#2535)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2535) - Jack Gerrits
- [VWSlim fixes (#2562)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2562) - Jack Gerrits
- [[CAPI] Add C bindings to valgrind CI (#2561)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2561) - Jack Gerrits
- [[CAPI] Add exports and types headers (#2553)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2553) - Jack Gerrits
- [Use AfterHash for IndentPPDirectives (#2560)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2560) - Jack Gerrits
- [[CAPI] Put experimental bindings behind experimental cmake flag (#2557)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2557) - Jack Gerrits
- [Revert &quot;Add preprocessor indent format option (#2554)&quot; (#2559)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2554) - Jack Gerrits
- [Add preprocessor indent format option (#2554)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2554) - Jack Gerrits
- [Ensure c bindings test runs as part of test_with_output (#2552)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2552) - Jack Gerrits
- [[CAPI] Implement buildsystem for C bindings (#2551)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2551) - Jack Gerrits
- [&quot;First slot&quot;/&quot;all slots&quot; loss report for ccb (#2525)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2525) - Alexey Taymanov
- [Resolve more MSVC warnings (#2549)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2549) - olgavrou
- [Handle boost exception being raised from add_and_parse (#2548)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2548) - Jack Gerrits
- [Fix C4296 and C2065 (#2544)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2544) - Schuyler Goodman
- [Add SquareCB contextual bandit algorithm (#2536)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2536) - Dylan Foster
- [Enable unit test run with valgrind (#2540)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2540) - olgavrou
- [- Provide guidance about how to fix (#2542)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2542) - Jack Gerrits
- [Overhaul formatting CI (#2538)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2538) - Jack Gerrits
- [Add devcontainer configuration (#2541)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2541) - Jacob Alber
- [Make valgrind build fail on error (#2534)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2534) - olgavrou
- [Migrate error codes implementation from #2493 and move into experimental namespace (#2537)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2537) - Jack Gerrits
- [Fix python tests on Windows (#2530)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2530) - peterychang
- [Extract ngram creation and transformation to a separate class (#2532)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2532) - Jack Gerrits
- [Fix incorrect type casting in weight default initialization (#2522)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2522) - Jack Gerrits
- [Extract namedlabels class (#2523)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2523) - Jack Gerrits
- [Disable flaky test (#2526)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2526) - olgavrou
- [Resolving various MSVC warnings (#2515)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2515) - olgavrou
- [Clear prediction in the slates reduction (#2520)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2520) - Jack Gerrits
- [Use collection comparison instead of iterating over the collection and comparing (#2519)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2519) - Jack Gerrits
- [Add test for spoof_hex_encoded_namespaces (#2517)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2517) - Jack Gerrits
- [Set reader consistently (#2510)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2510) - olgavrou
- [resolve MSVC C4456 and C4459 (#2511)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2511) - olgavrou
- [Update java subversion (#2514)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2514) - Jack Gerrits
- [Update Java Spark bindings for CB support (#2512)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2512) - Jack Gerrits
- [Resolve C4244 MSVC warnings (#2507)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2507) - olgavrou
- [Handle cast-function-type warning explicitly in code (#2502)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2502) - Jack Gerrits
- [Resolve second batch of v_array based memset warnings (#2498)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2498) - Jack Gerrits
- [Error if multilabel given to multiclass (#2501)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2501) - olgavrou
- [add multiclass label type (#2500)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2500) - Etienne Kintzler
- [Fix two warnings in PLT (#2503)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2503) - Jack Gerrits
- [Probabilistic Label Tree (#2440)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2440) - Marek Wydmuch
- [Migrate away from deprecated strerror function (#2494)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2494) - Jack Gerrits
- [Improve the handling of ignoring warnings across platforms and toolch… (#2495)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2495) - Jack Gerrits
- [Proposal: Use a power of 10 lookup table to improve VW text parser perf by 10% (#2490)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2490) - Jack Gerrits
- [Fix Slates crash (#2489)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2489) - Jack Gerrits
- [Fix warnings to do with memset of non-trivial types (#2484)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2484) - Jack Gerrits
- [Remove autogen file](https://github.com/VowpalWabbit/vowpal_wabbit/pull/unknown) - Eduardo Salinas
- [Build fixes for slim (#2485)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2485) - Jack Gerrits
- [make chain hashing equivalent between text and json format (#2487)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2487) - olgavrou
- [Add simple test for slates to RunTests (#2478)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2478) - Jack Gerrits
- [Simplify DFtoVW py api](https://github.com/VowpalWabbit/vowpal_wabbit/pull/unknown) - Etienne Kintzler
- [Revert doc comment change (#2482)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2482) - Jack Gerrits
- [Make count_label thread safe locklessly (#2480)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2480) - peterychang
- [Run apt update in workflow to ensure apt install works (#2481)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2481) - Jack Gerrits
- [Switch to std::chrono in bfgs to fix warnings (#2477)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2477) - Jack Gerrits
- [Update python slearn_vw.VW estimator to match SKLearn specs (#2368)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2368) - Scott Graham
- [Remove vw::pairs and vw::triples. Done with #1863. (#2236)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2236) - Rodrigo Kumpera
- [Multiple passes of cleanup to iobuf (#2366)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2366) - Rodrigo Kumpera
- [Improve const correctness of options framework (#2470)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2470) - Jack Gerrits
- [Change language to remove reference to whitelist (#2473)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2473) - Jack Gerrits
- [Use black in python (#2395)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2395) - Smit Lunagariya
- [fix memcpy overflow (#2468)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2468) - peterychang
- [added quantile loss (#2299)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2299) - Aditya Singh
- [Cleanup feature_group (#2434)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2434) - Jack Gerrits
- [Fix clang-tidy issues in CCB and Slates (#2466)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2466) - Jack Gerrits
- [Create .clang-tidy file  (#2465)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2465) - Jack Gerrits
- [Turn on CMAKE_EXPORT_COMPILE_COMMANDS in CMakeLists.txt (#2464)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2464) - Jack Gerrits
- [Simplify clang-format and small fixes and changes (#2463)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2463) - Jack Gerrits
- [Drain the queue if it is non empty due to possible early termination exits (#2457)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2457) - Jack Gerrits
- [Fix build break for older versions of ZLib (#2461)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2461) - Jack Gerrits
- [Revert API break (#2460)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2460) - Jack Gerrits
- [Ataymano/ccb exploration fix (#2454)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2454) - Alexey Taymanov
- [Fix directory for requirements install (#2453)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2453) - Jack Gerrits
- [Add pandas to requirements, fix documentation generation (#2448)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2448) - Jack Gerrits
- [Pandas to vw text format (#2426)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2426) - Etienne Kintzler
- [Fix some warnings, improve example lifecycle management (#2435)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2435) - Jack Gerrits
- [Remove headers no longer needed in io_buf (#2437)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2437) - Jack Gerrits
- [Fix warnings in unit test project (#2439)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2439) - Jack Gerrits
- [Fix CB state corruption when GD THROWs (#2442)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2442) - Jacob Alber
- [Add examples to swap_guard and scope_exit (#2441)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2441) - Jack Gerrits
- [Fix label name in bug_report (#2438)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2438) - Jack Gerrits
- [IO abstraction refactor - writers and readers (#2412)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2412) - Jack Gerrits
- [Implement two new RAII utilities and migrate nn (#2431)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2431) - Jack Gerrits
- [Add debug option to setup python script (#2432)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2432) - Eduardo Salinas
- [Change fetching of positional args to be in the options interface (#2418)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2418) - Jack Gerrits
- [Fix text parser in Python (#2430)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2430) - Jack Gerrits
- [Widen diff output as as the small width was causing failures on some machines (#2429)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2429) - Jack Gerrits
- [[Slates] Fix metadata extraction (#2425)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2425) - Jack Gerrits
- [[Slates] Fix float retrieval (#2424)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2424) - Jack Gerrits
- [Ataymano/ccb reproducibility fix (#2422)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2422) - Alexey Taymanov
- [Add missing hook into slates parser for json (#2420)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2420) - Jack Gerrits
- [Fix Slates slot assignment (#2421)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2421) - Jack Gerrits
- [Cb explore adf rnd (#2407)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2407) - Paul Mineiro
- [Update config.yml (#2415)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2415) - Jack Gerrits
- [Update build-linux-valgrind.yml (#2417)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2417) - Jack Gerrits
- [ Change Interactions from signed char to uint8_t to avoid casting (#2296)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2296) - Sharad Chitlangia
- [Added --local option (for loading active learning/damon models) (#2411)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2411) - Zechy Wong
- [Create tool to help measure throughput of parser (#2402)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2402) - Jack Gerrits
- [Merge symbol export visibility handling between C++ lib and DLL and fixes to vw_exception (#2404)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2404) - Jack Gerrits
- [Fix push many (#2409)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2409) - cheng-tan
- [Write some docs about the learner object (#2403)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2403) - Jack Gerrits
- [Fixes passing list of strings as examples in predict and learn (#2401)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2401) - Smit Lunagariya
- [Migrate to CodeCov for code coverage (#2385)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2385) - Jack Gerrits
- [Add back unit test generation (#2406)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2406) - Jack Gerrits
- [[Slates] Implement DSJSON parser for slates (#2390)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2390) - Jack Gerrits
- [[Slates] Move the slates namespace to be nested under VW (#2394)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2394) - Jack Gerrits
- [Update master branch to be consistent with 8.8.1 release (#2398)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2398) - Jack Gerrits
- [Move deletion logic to destructor of vw (#2399)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2399) - Jack Gerrits
- [Delete windows_build.bat (#2383)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2383) - Jack Gerrits
- [Remove Travis and Appveyor files now that they are turned off (#2384)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2384) - Jack Gerrits
- [Fix usages of LEARNER ns (#2396)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2396) - Jack Gerrits
- [Migrate LEARNER namespace to VW::LEARNER, provide compat header (#2393)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2393) - Jack Gerrits
- [Change estimator portion of output to use clearer implementation of PI (#2389)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2389) - Jack Gerrits
- [[Slates] Expose slates label to Python (#2388)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2388) - Jack Gerrits
- [Add VW::make_unique, make scoped_calloc_or_throw exception safe, fix test usage of make_unique (#2387)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2387) - Jack Gerrits
- [Remove noisy and unnecessary source from doyxgen generated docs (#2392)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2392) - Jack Gerrits
- [Update documentation generation (#2386)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2386) - Jack Gerrits
- [Build and upload documentation for each release (#2381)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2381) - Jack Gerrits
- [Implement the core reduction for slates (#2347)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2347) - Jack Gerrits
- [Added doc template and feature request template (#2361)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2361) - Ritu Raj Singh
- [Fix return reference to temporary local bug (#2373)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2373) - Jack Gerrits
- [Documentation correction of pyvw.py (#2336)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2336) - Smit Lunagariya
- [Added tests to increase coverage (#2276)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2276) - Smit Lunagariya
- [Remove Boost::thread dependency (#2379)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2379) - Jack Gerrits
- [Fix warning where only copy assignment constructor was defined, can be replaced with defaults (#2372)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2372) - Jack Gerrits
- [Update build_docs.yml (#2376)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2376) - Jack Gerrits
- [Add basic contents to the doxygen mainpage (#2377)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2377) - Jack Gerrits
- [Reorder path in RunTests so that local build takes priority over installed VW (#2380)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2380) - Jack Gerrits
- [Prevent overwriting passes when data is passed in VW at object creation (#2364)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2364) - Smit Lunagariya
- [Only override RelWithDebInfo flags for non MSVC situations (#2375)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2375) - Jack Gerrits
- [LDA / minibatch bug fix (#2334)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2334) - Eduardo Salinas
- [Added --quiet arg (#2360)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2360) - Aditya Singh
- [Ignore tmp.model (#2367)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2367) - Smit Lunagariya
- [Only run upload on master repository (#2365)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2365) - Jack Gerrits
- [Enable automatic building and hosting of documentation for every new commit (#2350)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2350) - Jack Gerrits
- [[FIX] Added warning for &quot;--ring_size&quot; with 0 as an argument (#2337)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2337) - Aditya Singh
- [Auto-read version in conf.py for docs from version.txt (#2356)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2356) - Smit Lunagariya
- [added  repr in BaseEstimator from sklearn (#2307)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2307) - Ritu Raj Singh
- [added sgd param in sklearn_vw (#2348)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2348) - Ritu Raj Singh
- [added multiclassifier in vw_sklearn (#2332)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2332) - Ritu Raj Singh
- [Change RelWithDebInfo to use O3 instead of O2 and set it as default (#2344)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2344) - Jack Gerrits
- [Fixes AttributeError in multiclass_probabilities_label (#2346)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2346) - Smit Lunagariya
- [Unit tests dynamically link to libvw, so they can't catch vw specific exceptions. See #2234. (#2235)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2235) - Rodrigo Kumpera
- [Uniform docstyle in sklearn_vw.py (#2305)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2305) - Smit Lunagariya
- [Implement Slates label parser (#2321)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2321) - Jack Gerrits
- [Fix clang tidy issues in CCB (#2327)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2327) - Jack Gerrits
- [[FIX] Make Python Examples Up To Date With Scikit-Learn Version 0.22.1 (#2301)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2301) - Shivam Kumar Jha
- [Fix two typos in memory_tree.cc (#2331)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2331) - Ariel Faigon
- [Fix the issue #2322 to throw error for invalid epsilon argument passed. (#2325)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2325) - Mritunjay Kumar Sharma
- [Add convert_labels param in VW sklearn class (#2293)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2293) - Jack Gerrits
- [Fix most valgrind errors in unit tests (#2318)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2318) - Jack Gerrits
- [Need to decrement failure count in case of expected failure (#2319)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2319) - Jack Gerrits
- [Create CI to run Valgrind (#2316)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2316) - Jack Gerrits
- [RunTests should not fail if Valgrind failed for a script or Python file (#2315)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2315) - Jack Gerrits
- [[FIX] Remove Outputs From Example Notebooks (#2304)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2304) - Shivam Kumar Jha
- [Fix str function in cbandit to produce correct format (#2297)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2297) - Smit Lunagariya
- [[STYLE] Make Python Files Adhere To Set Linting Standards (#2302)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2302) - Shivam Kumar Jha
- [Do not block stderr on Nan prediction + Non-logging logger (#2288)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2288) - Alexey Taymanov
- [Change CMakeLists.txt to have each file on its own line (#2294)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2294) - Jack Gerrits
- [Don't initialize multiple variables in one line in search (#2289)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2289) - Jack Gerrits
- [Remove symbols without definitions (#2287)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2287) - Jack Gerrits
- [Move destruction of search_private to its destructor (#2286)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2286) - Jack Gerrits
- [Fix race condition in daemon mode between parsing and inference threads. Fixes #2201 (#2283)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2283) - Rodrigo Kumpera
- [Invert hash now includes all weights even if they do not have an audit string (#2246)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2246) - Jack Gerrits
- [Use TCP_NODELAY for daemon sockets to avoid Nagle introducing long de… (#2269)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2269) - Rodrigo Kumpera
- [Fix warnings in unit_test by wrapping string constants in std::string temporary objects (#2280)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2280) - Jack Gerrits
- [Make Windows build better (#2279)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2279) - Jacob Alber
- [Remove profile from vw_clr.vcxproj (#2278)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2278) - Jack Gerrits
- [Allow overriding --epsilon value from model file (#2277)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2277) - Jacob Alber
- [Add chain hash option (#2214)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2214) - cheng-tan
- [Use _WIN32 (compiler definition) instead of WIN32 (sdk definition) (#2266)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2266) - Jack Gerrits
- [Support interpreting the string NaN as a float nan in dsjson (#2256)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2256) - Jack Gerrits
- [Support finding system version of RapidJSON (#2248)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2248) - Jack Gerrits
- [Update README.md (#2265)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2265) - Jack Gerrits
- [Run Linux build in both release and debug mode (#2261)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2261) - Jack Gerrits
- [Multiline parsing in python (#2259)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2259) - Smit Lunagariya
- [Fixes nameerror in Contextual_Bandit_Examples (#2263)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2263) - Smit Lunagariya
- [Unify python README with wiki (#2258)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2258) - peterychang
- [Fix segfault when reading from cache, using interactions and audit (#2250)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2250) - Jack Gerrits
- [Add deprecation warning for qcolon (#2252)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2252) - Jack Gerrits
- [Delete INSTALL (#2251)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2251) - Jack Gerrits
- [Silence cmake warning for policy CMP0076 (#2249)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2249) - Jack Gerrits
- [Fix some cases where fuzzy compare would not work (#2243)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2243) - Jack Gerrits
- [Remove in_use field from example (#2237)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2237) - Jack Gerrits
- [Fix most of the deprecation warnings for sklearn 0.22 (#2208)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2208) - peterychang
- [Add support for detecting available C++ standard on all platforms  (#2233)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2233) - Jack Gerrits
- [Cb dro fix (#2239)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2239) - Paul Mineiro
- [Remove unimplemented function (#2238)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2238) - Jack Gerrits
- [winsdk update (#2224)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2224) - Alexey Taymanov
- [Distributionally robust cb (#2203)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2203) - Paul Mineiro
- [Parser string view (#2117)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2117) - peterychang
- [Performance fixes (#2220)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2220) - Jack Gerrits
- [Align prediction and label enum types (#2218)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2218) - Jack Gerrits
- [Update .travis.yml to fix Maven issue (#2225)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2225) - Jack Gerrits
- [Ataymano/random fixes (#2221)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2221) - Alexey Taymanov
- [Add macros for silencing deprecation warnings (#2219)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2219) - Jack Gerrits
- [Create pretty printer for gdb (#2209)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2209) - Jack Gerrits
- [Reduce probability of overflow (#2217)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2217) - Rajan
- [Fix version of NewtonSoft used by in vw_cli.vcxproj (#2215)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2215) - Jacob Alber
- [Fix simple typo: throogh -&gt; through (#2213)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2213) - Tim Gates
- [Cleanup Headers (#2195)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2195) - Jack Gerrits
- [Fix delete behavior for examples created using parse function (#2206)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2206) - Jack Gerrits
- [Fix deprecated function usage, add file opened check (#2187)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2187) - Jack Gerrits
- [Learning2Search notebook format fix (#2204)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2204) - Alexey Taymanov
- [When building unit tests vw_c_wrapper DLL should be binplaced (#2189)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2189) - Jack Gerrits
- [Fix predict affecting model state when in library mode (#2190)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2190) - Jack Gerrits
- [Add vw_types.natvis to generated solution (#2186)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2186) - Jack Gerrits
- [Update test/README (#2198)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2198) - Ariel Faigon
- [Standardize copyright comments (#2185)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2185) - Jack Gerrits

</div>

---
title: "VowpalWabbit 9.0.0 Release Notes"
layout: blog
tags: Release&nbsp;notes
description: Usability, fixes, new reductions and Python modernization
author: Jack Gerrits
avatar_link: https://avatars1.githubusercontent.com/u/7558482?s=400&u=21e4cca683799d65a20a4cf3d11d0c17853ef9cb&v=4
---

<div class="blog_highlight" markdown="1">

- [GitHub release](https://github.com/VowpalWabbit/vowpal_wabbit/releases/tag/9.0.0)
- [PyPi](https://pypi.org/project/vowpalwabbit/)
- [Python 8.11 to 9 migration guide](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/python_8110_900_migration_guide.html)

</div>

Vowpal Wabbit 9 is the first major release in [over 6 years](https://github.com/VowpalWabbit/vowpal_wabbit/releases/tag/8.0)! There are a number of usability improvements, new reductions, bug fixes and internal improvements here. The Python package has undergone a bit of a modernization with a more understandable module structure, naming and types. Most changes should be non breaking for standard use cases. See [here for the migration guide](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/python_8110_900_migration_guide.html). There is still improvement to be made with Python but this is a good first step towards a more usable package.

## Breaking changes

This release includes some breaking changes detailed below. Please review them to see if they affect you.

### [Failing to open an input file is no longer ignored](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3571)

In the past if VW was not able to open an input file it would print a message and continue. This usually meant it would fall back to reading from standard input leading to unintuitive behavior. VW will now treat failure to open an input file as an error, produce the appropriate error message and exit.

### [Python2.7 and Python3.5 are no longer supported](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3104)
Python 2.7 and 3.5 are no longer supported. The last release where they were available was 8.11.0. Details on the Python support matrix can be found [here](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Python#support). Dropping support for these also allows us to begin to introduce new features such as type hints.

### Python module structure

To align with PEP8 and be more consistent we renamed the following modules.

- `vowpalwabbit.DFtoVW` ->`vowpalwabbit.dftovw`
- `vowpalwabbit.sklearn_vw` ->`vowpalwabbit.sklearn`

We did as much as we could to keep the old names accessible. Unfortunately, since some operating systems are case insensitive renaming the `DFtoVW` module causes some issues. There may be some ways of importing `vowpalwabbit.DFtoVW` that broke in this migration on some operating systems or setups.

For example, the following will be broken and must be changed.
```python
from vowpalwabbit.DFtoVW import DFtoVW
# Change to ->
from vowpalwabbit.dftovw import DFtoVW
```

Most of the core objects from `vowpalwabbit.pyvw` are now accessible in the root module.

For example the following can now be done:

```python
from vowpalwabbit import Workspace
workspace = Workspace(quiet=True)
workspace.learn('1 | a b c')
print(workspace.predict('| b c'))
```

See the [docs](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.html) for what is in the root module.
### `save_resume` is now the default for model saving and loading

We have seen confusion around the **old** default behavior that required a flag to be supplied to continue training from a model. We decided (after a [call for comment](https://github.com/VowpalWabbit/vowpal_wabbit/issues/3163)) that it makes more sense for the default behavior of VW be to support continuing training when saving and loading a model. This new model is slightly larger, but more flexible. If the previous behavior is required, `--predict_only_model` is available. You may want this if you are using the model file in an inference only setup or you have tooling which requires this format.

This will change the format of any readable models by default because more information is saved. If you depend on that format please keep in mind this change.

### `-q:` option removal
`-q:` has been removed. This is different to `-q ::`, which certainly has not been removed. `-q:`  may have been [added](https://github.com/VowpalWabbit/vowpal_wabbit/commit/e6ea9fd4f75e21507bf4050ece6d80db97907840) by mistake. It has never actually done anything and is confusing when it is so similar to the very important `-q` option.  It has been deprecated for some time and is now removed.

### [Python label object creation changes](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3615)

There is no breaking change if you were using `pyvw.Example.get_label`. There is only a change if you directly constructed any label objects.

Label objects in Python have had their `__init__` and `from_example` functions changed. `__init__` no longer accepts a `pyvw.Example` object and just accepts that label's state. `from_example` is now a static factory function.

### [Saved models now contain learning rate and power_t](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3609)

When resuming training a model from a file in the past VW did not remember the learning rate and `power_t` used in initial training. VW will not use the same values when the model is loaded. The values can be overridden by supplying a new value on the command line when resuming.

### Internal changes

The following sets of changes are internal breaking changes. These should not affect you unless you depend on any of the C++ code structure. These changes have been marked in the past.

- [refactor!: Remove in_use field](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3167)
- [refactor!: Remove ezexample](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3164)
- [refactor!: Remove feature_self_interactions compile time value ](https://github.com/VowpalWabbit/vowpal_wabbit/pull/)
- [refactor!: Remove deprecated things in v_array](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3166)
- [refactor!: remove deprecations targeted for VW 9.0](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3268)

## Highlights

### Output options

VW's output has been cleaned up in this release. During default operation VW produces two different streams of output. The driver which contains some initial information, progressive validation and results. The logger which produces info, warning and error information. In the past logging information was not produced in a consistent way. Logging information now has a consistent format and can be controlled.

- `--quiet` - Works the same as before but can be explained as turning off both the driver and log output streams
- `--driver_output_off` - Will just turn off the driver but leave logging on
- `--driver_output <stderr|stdout>` (default: `stderr`) - Direct driver output to the specified location
- `--log_output <stderr|stdout|compat>` (default: `stdout`) - Direct logging output to the specified location. Or, if `compat` is chosen the output location will be what it was in 8.11. Past versions were not consistent about output location and this was added if any user depended on that behavior.
log_output
- `--log_level <critical|error|warn|info|off>` (default: `info`) - Log level to enable.

### Options reachability warning

If an option is passed which is definitely not used by any enabled reduction VW will now issue a warning.

```
vw --epsilon 0.5
```

```
[warning] Option 'epsilon' depends on another option (or combination of options) which was not supplied. Possible combinations of options which would enable this option are:
	cb_explore_pdf
	warm_cb
	bag, cb_explore_adf
	cb_explore_adf, cover
	cb_explore_adf, first
	cb_explore_adf, synthcover
	cb_explore_adf, rnd
	cb_explore_adf, softmax
	cb_explore_adf
	cb_explore
```

### Documentation site

This is the first release which includes the new [documentation site](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/index.html). We plan on iterating on this and converging documentation over time. The tutorials are now hosted here and redirect from their old locations. The Python based tutorials and examples have links at the top of the page to make the content interactive in the browser. [Try it out!](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/tutorials/python_first_steps.html)

### Python package now includes type hints

Now that Python 2 is no longer supported we were able to add type hints to the Python code base. These typehints are also checked for each commit in CI. They make the [documentation](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.html#https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.html#) much clearer too.

### [Python Linux AArch64 binary wheels](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3576)

Thanks to [@odidev](https://github.com/odidev) the Python package now includes AArch64 binary wheels for Linux.

### `vowpalwabbit.pyvw` class naming

Classes in `vowpalwabbit.pyvw` have been renamed to match PEP8. The old names are still accessible but are deprecated.

- [abstract_label](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.abstract_label) -> [AbstractLabel](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.AbstractLabel)
- [simple_label](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.simple_label) -> [SimpleLabel](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.SimpleLabel)
- [multiclass_label](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.multiclass_label) -> [MulticlassLabel](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.MulticlassLabel)
- [multiclass_probabilities_label](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.multiclass_probabilities_label) -> [MulticlassProbabilitiesLabel](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.MulticlassProbabilitiesLabel)
- [cost_sensitive_label](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.cost_sensitive_label) -> [CostSensitiveLabel](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.CostSensitiveLabel)
- [cbandits_label](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.cbandits_label) -> [CBLabel](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.CBLabel)
- [namespace_id](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.namespace_id) -> [NamespaceId](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.NamespaceId)
- [example_namespace](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.example_namespace) -> [ExampleNamespace](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.ExampleNamespace)
- [vw](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.vw) -> [Workspace](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.Workspace)
- [example](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.example) -> [Example](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/reference/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.Example)

### New reduction: FreeGrad

FreeGrad is a new base learner described in [this paper](https://arxiv.org/abs/2002.12242). It can be tried where coin or gradient descent may have been used before.

[Learn more at the wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/FreeGrad)

### New [experimental](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Experimental) reduction: AutoML

AutoML is a new reduction whose primary goal is to provide users with a hands-off method to get an optimal learning configuration without prior experience using VW or an in-depth understanding of their dataset. A "configuration" is a general term which can be extended to any aspect of VW (enabled reduction, # of passes, etc…) but as of now a configuration will specify the set of namespace interactions used in a contextual bandit problem. More specifically, a configuration specifies a set of interactions which will be excluded from the default configuration -q :: (All quadratic interactions).

[Learn more at the wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Automl)

### New [experimental](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Experimental) reduction: Interaction Grounded Learning

VW's learning algorithm attempts to minimize loss, and the contextual bandit input format specifically calls for cost. However, in the setting on reinforcement learning and contextual bandits it is common to use reward in a label for a data point. And for rewards the agent wishes to maximize reward. Accidentally supplying a reward in place of a cost for contextual bandit label in VW will result in incorrect learning as minimizing this value is the opposite of what is intended.

This reduction tracks incoming labels and determines whether they are rewards or costs. Note that because positive value are assumed to be rewards and negative values costs, if your dataset is labelled such that positive values are still costs but are used to penalize the learner then this automatic translation will not work.


[Learn more at the wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Interaction-Grounded-Learning)


### New [experimental](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Experimental) reduction: Baseline Challenger Contextual Bandit

The reduction builds a CI around the baseline action and use it instead of the policy as the greedy action if its lower bound is higher than the policy expected reward.

[Learn more at the pull request](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3302)


### [Experimental](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Experimental): Full name interactions

An experimental new feature which allows interactions to be specified as the entire namespace name instead of just the first character was added. It is specified with the option: `--experimental_full_name_interactions <arg>`. The value of `<arg>` is the list of namespaces in the interaction separated by `|`. For example to interaction two namespaces `Action` and `Access`: `--experimental_full_name_interactions Action|Access`. This new feature allows interactions between namespaces where the first character is the same. In the past that would have needed to be achieved through prefixing the namespaces with a unique character.


### Python package includes CLI tool
Thanks to @mathcass the [Python package includes the CLI tool](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3144). There are a few limitations to using this compared to the executable itself which are important to know.

- Standard input cannot be used (i.e. redirecting from `cat` into the `stdin` of the process)
- Options `--onethread` and `--args` cannot be used


### [Experimental](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Experimental): Privacy Preserving Learning

One of the RLOS projects in 2021 was around privacy preserving learning and was worked on by @manavsinghal157. The feature implements aggregated learning by saving only those features that have seen a minimum threshold of users.

Note: this feature is available behind a compiler flag and is still experimental. See [wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Privacy-Preserving-Learning) for instructions.

[Learn more at the wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Privacy-Preserving-Learning)

### 0-indexing for One-Against-All

Previously labels had to be 1-indexed for the `oaa`, `csoaa`, and `csoaa_ldf` reductions. Now these reductions can use 0-indexed labels, and report 0-indexed predictions. VW will dynamically detect the indexing of the examples, but you can also set it explicitly with `--indexing 0` or `--indexing 1`.


## Thank you

A huge thank you and welcome to all of the new contributors since the last release:

- [@mathcass](https://github.com/mathcass)
- [@sergeyf](https://github.com/sergeyf)
- [@slahabar](https://github.com/slahabar)
- [@thmavri](https://github.com/thmavri)
- [@dantswain](https://github.com/dantswain)
- [@robotsorcerer](https://github.com/robotsorcerer)
- [@manavsinghal157](https://github.com/manavsinghal157)
- [@zmhammedi](https://github.com/zmhammedi)
- [@aaiyer](https://github.com/aaiyer)
- [@odidev](https://github.com/odidev)
- [@jonpsy](https://github.com/jonpsy)

And of course thank you to existing contributors:

- [@ataymano](https://github.com/ataymano)
- [@bassmang](https://github.com/bassmang)
- [@cheng-tan](https://github.com/cheng-tan)
- [@etiennekintzler](https://github.com/etiennekintzler)
- [@gramhagen](https://github.com/gramhagen)
- [@kumpera](https://github.com/kumpera)
- [@lalo](https://github.com/lalo)
- [@olgavrou](https://github.com/olgavrou)
- [@peterychang](https://github.com/peterychang)
- [@rajan-chari](https://github.com/rajan-chari)
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

- [feat: add some debugging info for cb costs > 1](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3660)
- [feat: exclude ccb namespaces from automl (#3653)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3653)
- [feat: add types to vowpalwabbit.dftovw (#3639)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3639)
- [feat!: Persist learning_rate, power_t, and initial_t for loaded models (#3609)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3609)
- [feat: get_label and get_prediction work the same way, more consistent usage of enums (#3629)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3629)
- [feat: pyvw label accessors for multilabel (#3633)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3633)
- [feat: add cb_eval label accessor and fix CBLabel (#3632)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3632)
- [feat: export CCB types from python package (#3627)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3627)
- [feat: Label accessor for CCB (#3546)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3546)
- [feat: [automl] add confidence interval flag (#3618)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3618)
- [feat: pyvw label accessor for slates (#3603)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3603)
- [feat: pyvw label accessor for continuous actions (#3596)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3596)
- [feat: Update label class names, deprecate old names, add strong typing (#3599)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3599)
- [feat: Use an Enum instead of integers for label and prediction types in Python (#3581)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3581)
- [feat: Separate scored_config from automl (#3586)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3586)
- [feat: Include submodules in main vowpalwabbit package (#3577)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3577)
- [feat: undeprecate chain_hash (#3575)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3575)
- [feat: Add epsilon_reduction_features for decay of exploration (#3563)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3563)
- [feat!: promote failure to open input file from warning to error (#3571)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3571)
- [feat: More consistent and controllable output (#3529)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3529)
- [feat: [automl] add debugging features (#3463)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3463)
- [feat: Warn if options are passed which cannot be reached due to unsupplied necessary args (#3504)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3504)
- [feat: Use label_type to enable shared_feature_merger, Resolves #3512 (#3545)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3545)
- [feat: enable 0-indexed labels for csoaa (#3533)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3533)
- [feat: better error message for as_multiline and as_singleline (#3515)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3515)
- [feat: warn if --quantile_tau is not used (#3514)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3514)
- [feat: ability to capture the audit output using the vwdll api (#3360)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3360)
- [feat: better error message for bfgs dependent options (#3517)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3517)
- [feat!: Remove --save_resume and add --predict_only_model. Resolves: #3163 (#3502)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3502)
- [feat: Added the parameter-free online learning algorithm FreeGrad (#3067)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3067)
- [feat: Privacy Preserving Learning (#3334)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3334)
- [feat: Interaction Grounded Learning (#3282)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3282)
- [feat: print expected input label and output pred type (#3207)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3207)
- [feat: Treat features in ccb_slot_namespace as standard features (#3480)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3480)
- [feat: improve error message when using --passes without cache specified (#3462)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3462)
- [feat: enable 0-indexing for oaa (#3409)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3409)
- [feat: add one_of method, standardize help output, Resolves #3318 (#3443)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3443)
- [feat: [py] add git commit hash to library version (#3446)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3446)
- [feat: [automl] add oracle for all one-diff configs (#3441)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3441)
- [feat: make json parser usable without `all` (#3439)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3439)
- [feat: Add vw as python module command (#3144)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3144)
- [feat: Output specific message when stdin is used to try avoid confusion (#3435)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3435)
- [feat: expose holdout sum loss in python bindings (#3440)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3440)
- [feat: [automl] Add feature to clear configs on champ change (#3438)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3438)
- [feat: Support for integer search space, lrq, cubic and lrqfa in vw-hyperopt (#3366)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3366)
- [feat: add output_label and input_prediction (#3414)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3414)
- [feat: add image for prediction and label directionality (#3431)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3431)
- [feat: create interface for metric sink  (#3419)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3419)
- [feat: add conda packaging instructions (#3418)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3418)
- [feat: enable getting label parser by enum type  (#3411)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3411)
- [feat: prefix cache entries with size  (#3410)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3410)
- [feat: Implement wildcard expansion for full name based interactions (#3364)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3364)
- [feat: adds new metric dsjson_sum_cost_original_baseline (#3396)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3396)
- [feat: add trim_whitespace function (#3380)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3380)
- [feat: Add new safety reduction that uses baseline if it is better than the current policy. (#3302)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3302)
- [feat: AutoML interactions (#3252)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3252)
- [feat: Adds new ccb metrics for comparing first slot label with the us… (#3365)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3365)
- [feat: Adds new metric for aggregating original label cost for first slot  (#3359)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3359)
- [feat: support extent based interaction (#3348)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3348)
- [feat: add clamp function to math library and migrate usages (#3299)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3299)
- [feat: create vw-dump-options program to dump all options into json format (#3313)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3313)
- [feat: update active_interactor.py for Python3 (#3294)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3294)
- [feat: extent based namespaces (#3208)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3208)
- [feat: support skip reasons in run_tests.py (#3270)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3270)
- [feat: add save/load to ChiSquared (#3267)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3267)
- [feat: Adding metric for sum of original_label_cost (#3248)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3248)
- [feat: Add ccb namespace benchmarks, generalize example generation (#3196)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3196)
- [feat: VW fuzzer (#3212)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3212)
- [feat: ability to customize learner builder in vw.h (#3190)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3190)
- [feat: Add benchmarks to track full namespace performance (#3193)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3193)
- [feat: [Tutorial] DFtoVW tutorial v2 (#3181)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3181)

## Fixes
- [fix: learn/predict exceptions were causing a destructor to throw](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3659)
- [fix: only persist learning_rate and power_t for save_resume -- also dont dont parse update_options](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3658)
- [fix: report regcb predictions as probabilities (#3655)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3655)
- [fix: support sklearn_vw name (#3646)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3646)
- [fix: fix type and deprecate legacy example construction method (#3644)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3644)
- [fix: a fix for search dep to guarantee actions are valid (#3637)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3637)
- [fix: fix incorrect refactor (#3636)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3636)
- [fix: LDF hooktask usage - undo d30b3045a4ab5edc9550e67df87ade8567459ca4 (#3638)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3638)
- [fix: double free of end_pass example causing tests to fail randomly (#3617)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3617)
- [fix: coin overflowing fix (#3613)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3613)
- [fix: fix __init__ args for deprecated classes (#3611)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3611)
- [fix: bfgs cannot load save_resume model (#3606)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3606)
- [fix: replace flatbuffers deprecated Length with size (#3607)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3607)
- [fix: remove std::iterator from slimvw to resolve build issues (#3597)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3597)
- [fix: slim warnings when compiling as 32 bit (#3593)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3593)
- [fix: convert dep list to str before joining (#3605)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3605)
- [fix!: remove deprecated and confusing --q: argument (not -q ::) (#3594)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3594)
- [fix: typo (#3591)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3591)
- [fix: vwdll unit test memory leak (#3585)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3585)
- [fix: don't produce warning about log_output if a custom trace listener is being used (#3579)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3579)
- [fix: Windows double to float conversion warning (#3587)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3587)
- [fix: windows hidden variable warning (#3568)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3568)
- [fix: Stop search_generate from segfaulting (#3565)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3565)
- [fix: resolve segfaults in test_search (#3561)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3561)
- [fix: Suppress build warnings on windows (#3560)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3560)
- [fix: allow library_example and train.sh to run without fail (#3557)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3557)
- [fix: marginal --invert_hash feature names (#3554)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3554)
- [fix: ill-formatted logger warnings (#3552)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3552)
- [fix: csoaa_ldf rank incorrect action outputs (#3551)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3551)
- [fix: feature count for cost sensitive and cb with --noconstant, Resolves #439 (#3550)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3550)
- [fix: add one_of to dump_options, Resolves: #3526 (#3540)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3540)
- [fix: cats_tree bandwidth overflow, Resolves: #3542 (#3544)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3544)
- [fix: benchmarks ci, revert to non self-hosted runner (#3537)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3537)
- [fix: macos ci by disabling daemon tests (#3536)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3536)
- [fix: update macOS image to 10.15 (#3531)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3531)
- [fix: remove accidentally left in debug print (#3528)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3528)
- [fix: [ci] Attempt to fix flaky Windows build (#3523)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3523)
- [fix: Do not output exception information many times on failure (#3505)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3505)
- [fix: change transitive defaults for label/pred type (#3516)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3516)
- [fix: [automl] use global random_state inst (#3518)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3518)
- [fix: shared_feature_merge should enable if base is of expected type (#3506)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3506)
- [fix: cb/ccb loss fix (#3508)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3508)
- [fix: Deduplicate namespace terms for ignore, ignore_linear, and keep when saving to model and printing out in command line. (#3490)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3490)
- [fix: workaround cache job failures (#3484)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3484)
- [fix: error if wildcard used with lrq and lrqfa (#3475)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3475)
- [fix: Fix feature count when reserved namespaces present (#3473)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3473)
- [fix: fix ccb feature count, remove unnecessary slot copy, fix message (#3479)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3479)
- [fix: warning in search (#3477)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3477)
- [fix: cb feature count off for shared (#3470)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3470)
- [fix: [automl] Update champ change test (#3467)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3467)
- [fix: fix crash in daemon mode children, deadlock in endpass and add logging for any future crashes (#3464)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3464)
- [fix: Add slot_id to total feature count in ccb (#3461)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3461)
- [fix:  (WIP) Fixes for issues found during fuzz testing  (#3213)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3213)
- [fix: inf comparison and nan comparison should work for test diff (#3415)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3415)
- [fix: do not mark example emitted at EOF as newline (#3413)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3413)
- [fix: improve error message when cache file of different VW is loaded (#3407)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3407)
- [fix: change multilabel_oaa probability reporting to 0-index (#3403)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3403)
- [fix: Add --probabilities flag to multilabel_oaa, Resolves #3331 (#3362)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3362)
- [fix: example_is_newline incorrect return type (#3390)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3390)
- [fix: [ccb] emit dsjson_sum_cost_original metric (#3382)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3382)
- [fix: don't use enabled_reductions in json parser for ccb metrics (#3377)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3377)
- [fix: fix bug where read_lines would ignore given length (#3343)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3343)
- [fix: Fix CCB slot aggregation for original label cost metric (#3350)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3350)
- [fix: active was using inf values for sensitivity (#3321)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3321)
- [fix: `self.classes_[indices]` in sklearn VW (#3332)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3332)
- [fix: perf issues found by clang-tidy (#3319)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3319)
- [fix: fix incorrect set of maxk (#3298)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3298)
- [fix: don't use heap for io_buf (#3317)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3317)
- [fix: fix multiple definitions caused by non-inline header lambdas in benchmarks (#3316)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3316)
- [fix: remove v_array copy from --onethread and std::function from parse_dispatch (#3301)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3301)
- [fix: add back setting active property in reduction setup (#3290)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3290)
- [fix: undo active printing change (#3292)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3292)
- [fix: Use random state in simulator for cross-platform (#3293)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3293)
- [fix: resolve more gcc warnings (#3271)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3271)
- [fix: properly release memory in the event of an error (#3272)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3272)
- [fix: fix warning is search from unsafely using realloc (#3255)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3255)
- [fix: incorrect change of push_at in search (#3240)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3240)
- [fix: move lda above scorer to avoid incorrect application of scorer (#3263)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3263)
- [fix: use reference for pred local variable in cb_dro (#3259)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3259)
- [fix: fix memcpy warning in cc (#3254)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3254)
- [fix: fix two clang-12 warnings (#3256)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3256)
- [fix: clean up cb_dro dependencies (#3253)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3253)
- [fix: missing min compare in ChiSquared impl (#3251)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3251)
- [fix: Catch segfaults dense parameters (#3233)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3233)
- [fix: fix comparator for interactions sorting (#3236)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3236)
- [fix: fix gcc warnings (#3229)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3229)
- [fix: fix fallthrough warning on GCC C++11/C++14 (#3227)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3227)
- [fix: [docs] Update link to Python notebook examples (#3226)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3226)
- [fix: maintain sum_feat_sq in concat and truncate to (#3209)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3209)
- [fix: benchmarks need to call finish to avoid leaking (#3210)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3210)
- [fix: add back check for space names not empty (#3205)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3205)
- [fix: feature_limit gives the unique of the first N not the first N unique features (#3206)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3206)
- [fix: remove commented code (#3198)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3198)
- [fix: lbl_parser should be set after calling setup base (#3187)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3187)
- [fix: add --quiet to cats notebook tutorial (#3177)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3177)

## Other changes
- [docs: Add migration guide for python 8.11 to 9 (#3647)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3647)
- [docs: cleanup notebooks and change deprecated messages (#3643)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3643)
- [docs: add types and update docs for pyvw (#3645)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3645)
- [docs: convert from numpydoc to googledoc python docstrings (#3641)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3641)
- [docs: update to match new module structure (#3628)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3628)
- [docs: rename doc -&gt; docs (#3634)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3634)
- [docs: remove placeholder text (#3631)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3631)
- [docs: add docstrings for deprecated classes (#3621)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3621)
- [docs: standardize tutorial titles (#3582)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3582)
- [docs: document pyvw.vw.get_log (#3580)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3580)
- [docs: Update classification notebook (#3578)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3578)
- [docs: help string updates (#3572)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3572)
- [docs: add default values to some options (#3569)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3569)
- [docs: Provide instructions for fixing format issues with container (#3509)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3509)
- [docs: document VW::rand_state (#3507)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3507)
- [docs: update help strings in gd (#3483)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3483)
- [docs: add docs for v_array + small fixes (#3182)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3182)
- [docs: fix path (#3173)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3173)
- [docs: Move examples and tutorials into docs dir (#3160)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3160)
- [docs: Add redirects so old links still work (#3168)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3168)
- [docs: override docs version for push builds (#3172)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3172)
- [docs: Python doc styling (#3169)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3169)
- [docs: Overhaul python documentation (#3093)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3093)
- [refactor: store l1 and l2 as model state and not command line arguments](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3654)
- [refactor: Remove periods from help message (#3650)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3650)
- [refactor: deprecate unused option cb_to_cbadf (#3648)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3648)
- [refactor: CCBLabel enforce outcome exists when asking for it (#3624)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3624)
- [refactor: Use 'Default' in help message (#3626)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3626)
- [refactor: change python module names to align with PEP8 (#3623)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3623)
- [refactor: Shorten default and clean help message (#3620)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3620)
- [refactor!: Separate from_example as static method for label classes in pyvw (#3615)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3615)
- [refactor: remove unnecessary parts of pylibvw (#3616)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3616)
- [refactor: Finish python renames (#3612)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3612)
- [refactor: Use cpp label enums in pyvw (#3608)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3608)
- [refactor: don't support unneeded option types in framework (#3595)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3595)
- [refactor: apply Black python formatting to entire project (#3604)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3604)
- [refactor: make stdout the default for log output (#3601)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3601)
- [refactor: add example_queue_limit option to replace ring_size (#3590)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3590)
- [refactor: compact make_reduction_learner calls where possible (#3592)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3592)
- [refactor: short option name for --log_output (#3574)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3574)
- [refactor: output cleanups (#3570)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3570)
- [refactor: simplify tag printing (#3567)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3567)
- [refactor: Show warning any time --log_output_stream is used (#3564)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3564)
- [refactor: standardize file naming (OjaNewton -&gt; oja_newton) (#3566)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3566)
- [refactor: quiet output for vw unit tests (#3562)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3562)
- [refactor: throw instead of log for cache reading failure (#3553)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3553)
- [refactor: clarify examples and features cache reading and properly cache flat_example (#3530)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3530)
- [refactor: alphabetize vw make (#3549)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3549)
- [refactor: Standardize unit test file naming (tests.cc-&gt;test.cc) (#3548)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3548)
- [refactor: indicies -&gt; indices (#3538)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3538)
- [refactor: Separate csoaa from csoaa_ldf (#3535)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3535)
- [refactor: Use model_utils for label cache (#3527)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3527)
- [refactor: make 'output' path mostly const (#3510)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3510)
- [refactor: disable prediction with ccb and cb_type mtr (#3493)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3493)
- [refactor: deprecate ::vw alias (#3458)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3458)
- [refactor: use VW::workspace instead of ::vw (#3476)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3476)
- [refactor: convert RunTests.tt to consume json test description (#3442)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3442)
- [refactor: rename vw -&gt; VW::workspace (#3346)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3346)
- [refactor: Use enum class instead of bare enum (#3434)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3434)
- [refactor: remove redundant read cache parameter (#3424)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3424)
- [refactor: Remove unused enum (#3412)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3412)
- [refactor: move getpid logic to separate function (#3408)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3408)
- [refactor: Make label parsers independent of shared_data and parser  (#3404)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3404)
- [refactor: remove unused members in parser (#3405)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3405)
- [refactor: add label type to learner, encapsulate pred type and multiline (#3402)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3402)
- [refactor: [automl] use read/write_model_field (#3381)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3381)
- [refactor: replace usages of deprecated functions and types (#3401)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3401)
- [refactor: remove setters from learner now that builder migration is complete (#3400)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3400)
- [refactor: Organize core enums (#3397)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3397)
- [refactor: Remove init_learner and all remaining reductions, add label and pred type where possible (#3399)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3399)
- [refactor: move label reporting out of the parse path (#3389)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3389)
- [refactor: [cb] Change defines to cb_type_t enum and add consts (#3393)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3393)
- [refactor: use typed cache operations for slates and ccb cache operations  (#3388)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3388)
- [refactor: make is ring example const (#3387)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3387)
- [refactor: handle read and write separately for model fields (#3386)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3386)
- [refactor: migrate search to reduction builder interface  (#3375)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3375)
- [refactor: remove unused classes from other approaches to extent based interactions (#3376)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3376)
- [refactor: Migrate chisq save_load to process_model_field (#3358)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3358)
- [refactor: Add label and use builder to set learner features in ect, log_multi, recall_tree, warm_cb (#3357)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3357)
- [refactor: change counters to better reflect usage of pool (#3342)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3342)
- [refactor: Add label and use builder to set learner features in kernel_svm, lda_core, lrq, lrqfa, memory_tree (#3341)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3341)
- [refactor: Apply clang-tidy performance fixes (#3338)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3338)
- [refactor: migrate from typedef to using  (#3339)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3339)
- [refactor: make version checking a constexpr operation (#3329)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3329)
- [refactor: use helper method for model variables (#3326)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3326)
- [refactor: Add label and use builder to set learner features in expreplay, gd_mf, get_pmf, interact (#3330)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3330)
- [refactor: remove redunant read message from reading interface (#3325)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3325)
- [refactor: Add label and use builder to set learner features in cs_active and explore_eval (#3323)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3323)
- [refactor: clean up search setup a bit  (#3286)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3286)
- [refactor: explicitly pass buffer into parser read call (#3314)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3314)
- [refactor: Add label and use builder to set learner features in cbzoo and confidence (#3310)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3310)
- [refactor: Add label and use builder to set learner features in cb_to_cb_adf and cbify (#3309)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3309)
- [refactor: migrate svrg to builder (#3284)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3284)
- [refactor: Move empty interaction check into inner scope where size is known (#3300)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3300)
- [refactor: remove dependence on all for get_best_constant (#3307)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3307)
- [refactor: migrate stagewise_poly to builder  (#3285)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3285)
- [refactor: migrate pmf_to_pdf to builder (#3287)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3287)
- [refactor: use override for loss function virtual functions (#3280)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3280)
- [refactor: use vector instead of raw buffer for reading model files (#3279)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3279)
- [refactor: refactor test filtering, add typing (#3274)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3274)
- [refactor!: remove deprecations targeted for VW 9.0 (#3268)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3268)
- [refactor: migrate active  to builder and fix warnings (#3243)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3243)
- [refactor: Use reference in marginal constructor for non-nullable variable (#3269)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3269)
- [refactor: Add label and use builder to set learner features in cb_explore (#3266)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3266)
- [refactor: use new builder for marginal and other fixes (#3250)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3250)
- [refactor: migrate sender to builder (#3260)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3260)
- [refactor: Encapsulate resetting and current file in io_buf (#3265)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3265)
- [refactor: migrate audit_regressor to builder and fix issues (#3244)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3244)
- [refactor: migrate baseline to builder (#3247)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3247)
- [refactor: migrate scorer to builder (#3261)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3261)
- [refactor: Add label and use builder to set learner features in bs, cats, cb_algs (#3264)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3264)
- [refactor: migrate shared_feature_merger to builder (#3262)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3262)
- [refactor: migrate autolink to builder (#3246)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3246)
- [refactor: create text utils and refactor interaction parsing  (#3230)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3230)
- [refactor: prepare interactions for ranges (#3228)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3228)
- [refactor: search's destructor now cleans up all of its memory (#3214)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3214)
- [refactor: change noop to use new base learner builder (#3223)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3223)
- [refactor: change topk to use new reduction learner builder (#3222)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3222)
- [refactor: Make interactions use iterators (#3218)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3218)
- [refactor: change unit tests to use builders (#3225)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3225)
- [refactor: Add label and use builder to set learner features in cats_pdf.cc (#3221)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3221)
- [refactor: Add label and use builder to set learner features in csoaa.cc (#3215)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3215)
- [refactor: Add label and use builder to set learner features in oaa.cc (#3203)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3203)
- [refactor: Add label and use builder to set learner features in gd.cc (#3211)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3211)
- [refactor: Do feature sort in a more generic way (#3204)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3204)
- [refactor: Add label and use builder to set learner features in ftrl.cc (#3201)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3201)
- [refactor: Use same namespace push/pop code in JSON (#3202)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3202)
- [refactor: Various linting and naming fixes in parse args and related files (#3191)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3191)
- [refactor: rename setup_base to stack_builder (#3189)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3189)
- [refactor: move reduction stack building out of parse_args.cc (#3052)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3052)
- [refactor: replace c-style with c++ casts (#3180)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3180)
- [refactor!: Remove deprecated things in v_array (#3166)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3166)
- [refactor!: Remove feature_self_interactions compile time value  (#3165)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3165)
- [refactor!: Remove ezexample (#3164)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3164)
- [refactor: CCB warnings and lint fixes (#3162)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3162)
- [refactor: remove enabled_reductions from vw/all struct (#3176)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3176)
- [refactor!: Remove in_use field (#3167)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3167)
- [refactor: move to 2d list based grouping of namespaces (#3153)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3153)
- [refactor: add label and use builder to set learner features in sample_pdf.cc (#3157)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3157)
- [perf: create benchmark for sum_ft_squared (#3345)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3345)
- [test: fix error for not found files and fix bash skips (#3558)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3558)
- [test: Allow bash tests to run in parallel (#3524)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3524)
- [test: fix test false positive, add types, use pathlib, change from format to fstrings (#3541)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3541)
- [test: Add in CCB performance audit focusing on no_predict flag (#3500)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3500)
- [test: remove RunTests, update docs, refer to json file directly (#3465)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3465)
- [test: migrate `make test` to use run_tests.py (#3454)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3454)
- [test: rename schema to vwtest and use it for extra tests (#3456)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3456)
- [test: use current machine core count as default number of jobs (#3452)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3452)
- [test: don't crash on optional test fields (#3455)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3455)
- [test: implement extra options -O flag for run_tests.py (#3450)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3450)
- [test: [automl] bump tolerance down (#3426)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3426)
- [test: Add runtests schema and automatically validate in VSCode (#3416)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3416)
- [test: update type in baseline_cb_test (#3398)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3398)
- [test: follow to fix test file that was missed - copyright header and define (#3392)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3392)
- [test: [automl] use vw_math for float comparison (#3391)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3391)
- [test: fix for using -o outside of test dir (#3355)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3355)
- [test: allow tests requiring spanning tree to be skipped (#3353)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3353)
- [test: Use proper substitution names to support run_tests.py (#3354)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3354)
- [test: fix simulator forward declaration (#3322)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3322)
- [test: add cb_sim ref to test callback (#3311)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3311)
- [test: add kill cache to test 344 so it can be rerun without failure (#3303)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3303)
- [test: simulator with per example callback (#3291)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3291)
- [test: unit tests improvements (#3281)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3281)
- [test: add output on failure for test_with_output (#3283)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3283)
- [test: [cpp] add cb explore simulator for unit testing (#3273)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3273)
- [test: [py] add save load test &amp; refactor (#3257)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3257)
- [build: make ensure_cmake_valgrind use -DCMAKE_BUILD_TYPE=Debug (#3635)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3635)
- [build: Separate VWSlim cmake config from the core project (#3513)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3513)
- [build: update instructions for building macos wheels (#3497)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3497)
- [build: Remove tox (#3495)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3495)
- [build: [Java] Patch to make JNI build work on macos (#2747)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/2747)
- [build: cmake don't run submodule init if files already exist (#3436)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3436)
- [build: allow tests to automatically handle static/shared boost test dependency + fixup copyright header (#3379)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3379)
- [build!: drop support for Python2.7 and Python3.5 (#3104)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3104)
- [build: Create GitHub Action for valgrind (#3156)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3156)
- [ci: dont limit concurrency (#3649)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3649)
- [ci: Add Python CI to produce and verify source distribution (#3642)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3642)
- [ci: run arm python build for each commit (#3622)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3622)
- [ci:Add Linux AArch64 wheel build support (#3576)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3576)
- [ci: fix typecheck ci (#3600)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3600)
- [ci: Build Python 3.10 wheels for Windows (#3498)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3498)
- [ci: Build Python 3.10 wheels for Windows and Linux (#3499)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3499)
- [ci: Add explicit pandas install for benchmark CI (#3487)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3487)
- [ci: remove old valgrind CI (#3449)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3449)
- [ci: enforce Python formatting (#3422)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3422)
- [ci: reuse a single file instead of adding files on each iteration for input format benchmarks (#3349)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3349)
- [ci: cancel previous runs in same PR (#3347)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3347)
- [ci: run benchmark job on self hosted runner (#3344)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3344)
- [ci: Run clang tidy checks for each PR (#3258)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3258)
- [ci: move to Ubuntu18.04 for CI jobs (#3308)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3308)
- [ci: test remove update for python env issue (#3305)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3305)
- [ci: turn on new valgrind script in parallel (#3277)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3277)
- [ci: Change valgrind log path (#3276)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3276)
- [ci: remove Python3.6 from CI (#3275)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3275)
- [ci: Fix Python Windows CI issue (#3184)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3184)
- [ci: remove Azure devops valgrind pipeline (#3158)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3158)
- [ci: mitigate mongodb upgrade failure in MacOS CI (#3161)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3161)
- [chore: update version to 9.0.0 (#3656)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3656)
- [chore: mark automl and baseline challenger as experimental (#3625)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3625)
- [chore: run clang-format over codebase (#3610)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3610)
- [chore: Fix warnings (#3474)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3474)
- [chore: cleanup unused files in test dir and move some files to their place (#3469)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3469)
- [chore: update runtests.AUTOGEN.json (#3451)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3451)
- [chore: [automl] rename test, misnomer (#3429)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3429)
- [chore: [automl] remove commented function (#3428)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3428)
- [chore: format python package (#3423)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3423)
- [chore: format test python files (#3420)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3420)
- [chore: Add snippets for reduction scaffolds (#3394)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3394)
- [chore: add CMakeUserPresets.json to .gitignore (#3315)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3315)
- [chore: bump version of action-semantic-pull-request -&gt; 3.4.2 (#3306)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3306)
- [chore: remove '.*' from .gitignore (#3295)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3295)
- [revert: Revert &quot;feat: [py] add git commit hash to library version (#3446)&quot; (#3583)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3583)
- [Update python_Simulating_a_news_personalization_scenario_using_Contextual_Bandits.ipynb (#3630)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3630)
- [update fuzzer documentation (#3521)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3521)
- [ci: Fix Windows CI issue](https://github.com/VowpalWabbit/vowpal_wabbit/pull/unknown)
- [Update valgrind.yml (#3159)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/3159)

</div>
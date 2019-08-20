---
title: Get started with Vowpal Wabbit
order: -1
module_id: getting_started
description: This tutorial will run you through a familiar simple regression problem as a VW workflow. It will teach you about how to interact with VW, structure input and understand its output.
guide_link_text: 'Get started'
show_on_learn: false
layout: tutorial
body_class: tutorial
resource_icon: /svg/resources/guide.svg
---

# Getting Started with Linear Regression and Vowpal Wabbit

This guide describes how to perform Linear Regression with Vowpal Wabbit (VW). It features an overview of a simple regression problem using a VW workflow tutorial with examples. You will find information about interacting with VW, including structuring input, understanding output, and learn important VW diagnostics. 

## Getting started with Vowpal Wabbit

To install VW—and for more information on building VW from source or using a package manager—see [Getting started](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Getting-started) guide. 

>**Note:** This tutorial uses [Vowpal Wabbit Python package](https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/python). Additional binary packages are available for select platforms. See [Getting started](https://cheng-tan.github.io/vowpalwabbit.github.io/) module on the homepage for more information.

## Create linear regression data-set in Vowpal Wabbit

Before you begin making predictions for regression problems, you first need to create a data-set. For example, say you want to predict whether a house requires a new roof in the next 10 years.

**Create** a training-set file in VW, `house_dataset` that includes the following:

```
0 | price:.23 sqft:.25 age:.05 2006
1 2 'second_house | price:.18 sqft:.15 age:.35 1976
0 1 0.5 'third_house | price:.53 sqft:.32 age:.87 1924
```

Vowpal Wabbit hashes feature names into in-memory indexes by default unless the feature names are positive integers. In the first line of the `house_dataset` example, the first three features use an index derived from a hash function while the last feature uses index `2006` directly. Also, the first three features have explicit values (`.23`, `.25`, and `.05` respectively) while the last, `2006` has an implicit default value of `1`.

```
0 | price:.23 sqft:.25 age:.05 2006
```

-The first number in each line is a label. 
-A `0` label corresponds to no roof-replacement, while a `1` label corresponds to a roof-replacement. 
-The bar `|` separates label related data (what we want to predict) from features (what we always know). 
-The features in the first line are `price`, `sqft`, `age`, and `2006`. Each feature may have an optional `:<numeric_value>` following it or, if the value is missing, an implied value of `1`. 

The label information for the second line is more complex than the first: 

`1 2 'second_house | price:.18 sqft:.15 age:.35 1976`

- The `1` is the label indicating that a roof replacement is required. 
- The `2` is an optional _importance weight_, which implies that this example counts twice. The importance weight comes up in many settings. 
- A missing importance weight defaults to 1. `'second_house` is the tag. You can find more information on importance weight in the the Vowpal Wabbit diagnostic header section below.

The third line is more straightforward, except for a new number: 

`0 1 0.5 'third_house | price:.53 sqft:.32 age:.87 1924`

In the label information following the importance weight, the `0.5` is an initial prediction. Sometimes you have multiple interacting learning systems and want to be able to predict an offset rather than an absolute value.

Next, we learn:

```sh
vw house_dataset
```
The output for this command is:

```
Num weight bits = 18
learning rate = 0.5
initial_t = 0
power_t = 0.5
using no cache
Reading datafile = house_dataset
num sources = 1
average  since         example        example  current  current  current
loss     last          counter         weight    label  predict features
0.000000 0.000000            1            1.0   0.0000   0.0000        5
0.666667 1.000000            2            3.0   1.0000   0.0000        5

finished run
number of examples = 3
weighted example sum = 4.000000
weighted label sum = 2.000000
average loss = 0.750000
best constant = 0.500000
best constant's loss = 0.250000
total feature number = 15
```

## Vowpal Wabbit diagnostics

This section provides information on the various types of diagnostic information VW presents.

**Use** `--quiet`  command to turn off diagnostic information in Vowpal Wabbit.

### Hash function bits

The following output shows the number of bits from the hash function:

```
Num weight bits = 18
```

This diagnostic shows that the number of bits used from the hash function is 18 (more than enough for this example). Use `-b bits` to adjust the number of bits to use.

### Learning rate

The following output shows the learning rate:

```
learning rate = 0.5
```

The default learning rate is `0.5` with current default update (`--normalized --invariant --adaptive`). 

If the data is noisy, you need a larger data-set or multiple passes to predict well. For massive data-sets, the learning rate decays towards `0` by default. 

**Use** `-l rate` to adjust the learning rate up or down.

.**Note:** A high learning rate makes the model converge faster than a low learning rate, but if you adjust the learning rate too high, you risk over-fit and end-up worse on average.

### Learning rate decay

The following output sample shows the initial time:

```
initial_t = 0
```

This diagnostic shows the initial time for learning rate decay. 

**Use** `--initial_t time` to adjust the initial time. 

>**Note:** It is common to need to adjust the initial time in Vowpal Wabbit. 

### Learning rate decay power

The following output shows the power on learning rate decay:

```
power_t = 0.5
```

This diagnostic shows the power on learning rate decay. The VW default is `0.5` and a _minimax optimal choice_. This value works well for most problems. 

Stationary datasets, where the fundamental relation between the input features and target label are not changing over time, should benefit from a high (close to 1.0) --power_t while learning against changing conditions. For example, learning against an adversary who continuously changes the rules-of-the-game, benefit from low (close to 0) `--power_t` so the learner can react quickly to these changing conditions.  

**Use** `--power_t p` to adjust learning rate decay—where _p_ is in the range [0,1]. 

`0` means the learning rate does not decay, which can be helpful when state tracking.
`1` is aggressive, but plausible if a data-set represents a collection of random variables is [independent and identically distributed (IID)](https://en.wikipedia.org/wiki/Independent_and_identically_distributed_random_variables).

### Cache files

The following output shows that you are not using a cache file: 

```
using no cache
```

A cache file contains your dataset in a faster to handle format. It can speed up training if you use multiple passes or you run multiple experiments on the same dataset (even with different options).

The default cache file name is the dataset file name with `.cache` appended. For example, `house_dataset.cache`. 

**Use** `--cache_file housing.cache` to override the default cache file name. 

The first time you use `-c` you create a cache file. If the cache already exists and it is newer than the data-set, that is the default cache. If you want to experiment with the same dataset over and over, it is highly recommended to pass `-c` every time you train. 

**Use** `-c` for multiple passes `--passes`, so VW caches the data in a faster format (passes > 1 should be much faster).  

### Data sources 

The following output shows the source of data: 

```
Reading datafile = house_dataset
```

VW supports a variety of different input methods. This example uses a simple text file, and VW displays the source of the data. 

Alternative data sources include _cache files_ (from previous VW runs), _stdin_, or a _tcp socket_.

### Number of data sources

The following output shows the number of data sources:

```
num sources = 1
```

There is only one input file in this example. You can specify multiple files in VW.

## Vowpal Wabbit diagnostic header

Next, VW shows you some diagnostic information in the header.

```
average  since         example        example  current  current  current
loss     last          counter         weight    label  predict features
0.000000 0.000000            1            1.0   0.0000   0.0000        5
0.666667 1.000000            2            3.0   1.0000   0.0000        5
```

-**`average loss`** computes the <a href="http://hunch.net/~jl/projects/prediction_bounds/progressive_validation/coltfinal.pdf" target="_blank">progressive validation</a> loss. Progressive validation loss deviates like a test set, and hence is a reliable indicator of success on the first pass over any data-set.
-**`since last`** is the progressive validation loss since the last printout.
-**`example counter`** indicates which example is printed out. In this case,  example `2`.
-**`example weight`** is the sum of the importance weights of examples seen so far. In this case, it's `3.0`, because the second example has an importance weight of `2`.
-**`current label`** is the label of the second example.
-**`current predict`** is the prediction (before training) on the current example.
-**`current features`** is the number of features in the current example. 

The `current features` diagnostic is excellent for debugging. Note that we have five features when you expect four. This change happens because VW always adds a default _constant feature_.

**Use** `--noconstant` to disable the default constant feature. 

## Vowpal Wabbit debugging diagnostics 

Now, VW prints a new line with an exponential backoff. This information is useful for debugging problems before the learning algorithm finishes with a data-set:

```
finished run
number of examples = 3
weighted example sum = 4.000000
weighted label sum = 2.000000
average loss = 0.750000
best constant = 0.500000
best constant's loss = 0.250000
total feature number = 15
```

The `best constant` and `best constant's loss` only work if you are using squared loss. Squared loss is the default for VW. They compute the best constant's predictor and the loss of the best constant predictor. 

If `average loss` is not better than `best constant's loss`, something is wrong. In this case, we have too few examples to generalize.

If you want to overfit, use the following:

```sh
vw house_dataset -l 10 -c --passes 25 --holdout_off
```

Now, the progress section of the output looks like this:

```
average  since         example        example  current  current  current
loss     last          counter         weight    label  predict features
0.000000 0.000000            1            1.0   0.0000   0.0000        5
0.666667 1.000000            2            3.0   1.0000   0.0000        5
0.589385 0.531424            5            7.0   1.0000   0.2508        5
0.378923 0.194769           11           15.0   1.0000   0.8308        5
0.184476 0.002182           23           31.0   1.0000   0.9975        5
0.090774 0.000000           47           63.0   1.0000   1.0000        5
```

Notice that the `since last` data dropped to 0 by example 47 (25 passes over 3 examples result in 75 examples). This result implies that, by looking at the same 3 lines of data 25 times, we reached a _perfect predictor_. Not surprising, given that with three examples and five features for each example. 

>**Note:** You have to add `--holdout_off` because VW automatically switches to _over-fit avoidance_ mode by holding 10% of the examples and evaluating performance on the data being held instead of using online training progressive loss algorithms.

**Use** `--holdout_period period` to change the "1 in 10" period in VW. 

## Saving your model into a file

Vowpal Wabbit learns the weights of the features and keeps them in an _in-memory vector_ by default. 

**Add** `-f filename` to save the final regressor weights to a file. For example:

```sh
vw house_dataset -l 10 -c --passes 25 --holdout_off -f house.model
```

## Make predictions with Vowpal Wabbit 

You can make predictions in VW by supplying the `-p filename`. For example, to output them to standard out

```sh
vw house_dataset -p /dev/stdout --quiet
```

The output for this command is:

```
0.000000
0.000000 second_house
1.000000 third_house
```

The first line, `0.000000` refers to the first example, which has an empty tag.
The second line, `0.000000 second_house` refers to the second example. Notice that the tag appears here. The primary use of the tag is mapping predictions to the corresponding examples.
The third output, `1.000000 third_house` refers to the third example. The initial prediction was set to `0.5`, and the prediction is now `1.000000`. This result means that _some_ learning occurred. 

In the last example, the model was built in memory incrementally, as VW analyzed the examples. In other words, you predicted _while you learned_.

It is more common to learn first, then save the model to a file. Then, you make predictions using that saved model.

**Use:** `-i house.model` to load the initial model to memory. 

**Add** `-t` to specify _test-only_ (do no learning). For example:

```sh
vw -i house.model -t house_dataset -p /dev/stdout --quiet
```

The output for this command is:

```
0.000000
1.000000 second_house
0.000000 third_house
```

The results are different this time because the first prediction made one pass over the data. In the second example, you loaded the over-fitted model (25 passes) and used the `house_dataset` with `-t` (or _testing only_ mode). 

>**Note:** Always use a different data-set for testing vs. training for real prediction settings.

## Auditing with Vowpal Wabbit

VW has a built-in audit option that helps debug machine learning (ML) applications.

**Use** `--audit` to output helpful information about predictions and features. For example: 

```sh
vw house_dataset --audit --quiet
```

The output for this command is:

```
0
  price:229902:0.23:0@0 sqft:162853:0.25:0@0 age:165201:0.05:0@0 2006:2006:1:0@0 Constant:116060:1:0@0
0 second_house
  price:229902:0.18:0@0 sqft:162853:0.15:0@0 age:165201:0.35:0@0 1976:1976:1:0@0 Constant:116060:1:0@0
1 third_house
  price:229902:0.53:0.882655@0.2592 age:165201:0.87:0.453833@0.98 sqft:162853:0.32:1.05905@0.18 Constant:116060:1:0.15882@8 1924:1924:1:0@0
```

Every example uses two lines:

- The first line is the prediction.
- The second line shows one entry per feature. 
- **`229902`** is the index of the feature, computed by a hash function on the feature name.
- **`0.23`** is the value of the feature.
- **`0`** is the value of the feature's weight.
- **`@0.25`** is the sum of gradients squared for that feature (when you use _per-feature adaptive learning rates_).

VW has an advanced _namespaces_ feature that allows you to group features and operate them on-the-fly. Namespace options include the following: 

Use `-q XY` to cross a pair of namespaces.
Use `--cubic XYZ` to cross 3 namespaces.
Use `--lrq XYn` to low-rank quadratic interactions.
Use `--ignore X` to skip all features belonging to a namespace.

The first feature listed is:

```
price:229902:0.23:0@0.25
```

For this feature, **`price`** is the original feature name. If you use a namespace, it appears before `^`. For example: 

`Namespace^Feature` 

Notice that the feature `2006` uses the index 2006. You can use _hashes_ for features in VW, or _pre-computed indices_—as is common in other machine learning systems. 

The advantage of using unique _integer-based feature names_ is that they are guaranteed not to collide after hashing. The advantage of _free-text (non-integer)_ feature names is readability and self-documentation. 

Because only `:`, `|`, and _spaces_ are special to the VW parser, you can give features easy-to-read names. For example:

`height>2 value_in_range[1..5] color=red`

You can start feature names with a digit. For example: 

`1st-guess:0.5 2nd-guess:3` 

## More to explore

This guide only describes a fraction of Vowpal Wabbit’s capabilities. To explore more about VW features and performance—other loss functions, other optimizers, and other representations—including ridiculously fast active learning with clusters of 1000s of machines, see the following resources:

- To learn about VW, Contextual Bandits, and reinforcement learning see [Contextual Bandit tutorial]( {{ "guides/contextual_bandits.html" | relative_url}} )
- To explore more VW tutorials see <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Tutorial#more-tutorials" target="_blank">tutorials section of the GitHub wiki</a>
- To browse examples of VW in action see <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Examples" target="_blank">examples on the GitHub wiki</a>

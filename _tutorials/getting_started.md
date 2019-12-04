---
page_title: Linear Regression Tutorial | Vowpal Wabbit
page_description: This tutorial runs through a regression problem with Vowpal Wabbit to introduce unique features, explain how to structure input, and understand the results using examples.  
title: Vowpal Wabbit Linear Regression Tutorial
order: 5
module_id: getting_started
description: This tutorial runs through a regression problem using a Vowpal Wabbit workflow and explains how to structure input and understand results. 
layout: tutorial
level: beginner
tags: linear&nbsp;regression command&nbsp;line
---

# Vowpal Wabbit Linear Regression Tutorial

This tutorial demonstrates how to approach a regression problem with Vowpal Wabbit. It features an overview of a linear regression problem using a Vowpal Wabbit workflow tutorial with examples, introduces unique Vowpal Wabbit features, and explains how to structure input and understand the results. 

<div class="prerequisites" markdown="1">
**Prerequisites**

To install Vowpal Wabbit, and for more information on building Vowpal Wabbit from source or using a package manager, see [Get Started](../start.html). Vowpal Wabbit is supported in C++. Additional binary packages are available for select platforms. 

>**Note:** See [Command Line Tutorial](cmd_first_steps.html) for Vowpal Wabbit command line basics and a quick introduction to training and testing your model. See [Python Tutorial](python_first_steps.html) to explore the basics for using Python to pass some data to Vowpal Wabbit to learn a model and get a prediction.

</div>

## Create a dataset 

Before we begin making predictions for regression problems, we need to create a dataset. For example, say we want to predict whether a house will require a new roof in the next 10 years.

Create a training-set file in Vowpal Wabbit `house_dataset` and copy the following dataset:

```
0 | price:.23 sqft:.25 age:.05 2006
1 2 'second_house | price:.18 sqft:.15 age:.35 1976
0 1 0.5 'third_house | price:.53 sqft:.32 age:.87 1924
```

### Vowpal Wabbit hashing techniques

Vowpal Wabbit hashes feature names into in-memory indexes by default unless the feature names are positive integers.

For example, in the first line of the `house_dataset` example, the first three features use an index derived from a hash function while the last feature uses index `2006` directly. Also, the first three features have explicit values (`.23`, `.25`, and `.05` respectively) while the last, `2006` has an implicit default value of `1`:

```
0 | price:.23 sqft:.25 age:.05 2006
```

 - The first number in each line is a label.
 - A `0` label corresponds to no roof-replacement, while a `1` label corresponds to a roof-replacement.
 - The bar `|` separates label related data (what we want to predict) from features (what we always know).
 - The features in the first line are `price`, `sqft`, `age`, and `2006`. Each feature may have an optional `:<numeric_value>` following it or, if the value is missing, an implied value of `1`.

The label information for the second line is more complex:

```
1 2 'second_house | price:.18 sqft:.15 age:.35 1976
```

 - The `1` is the label indicating that a roof-replacement is required.
 - The `2` is an optional importance weight which implies that this example counts twice. Importance weights come up in many settings.
 - A missing importance weight defaults to 1. `'second_house` is the tag. See Vowpal Wabbit live diagnostics section for more on importance weight.

The third line is more straightforward, except for an additional number. In the label information following the importance weight, the `0.5` is an initial prediction.:

```
0 1 0.5 'third_house | price:.53 sqft:.32 age:.87 1924
```

Sometimes you have multiple interacting learning systems and want to be able to predict an offset rather than an absolute value.

Now, we learn:

```sh
vw house_dataset
```

**Output:**

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

## Vowpal Wabbit output

This section provides information on the various types of diagnostic output Vowpal Wabbit presents.

**Use** `--quiet`  command to turn off diagnostic information in Vowpal Wabbit.

### Hash function bits

The following output shows the number of bits from the hash function:

```
Num weight bits = 18
```

This diagnostic ouput shows that the number of bits from the hash function is 18 (more than enough for this example). Use `-b bits` to adjust the number of bits to be used from the hash function.

### Learning rate

The following output shows the learning rate:

```
learning rate = 0.5
```

The default learning rate is `0.5` with current default update (`--normalized --invariant --adaptive`). 

If the data is noisy, you need a larger data-set or multiple passes to predict well. For massive data-sets, the learning rate decays towards `0` by default.

**Use**  `-l rate` to adjust the learning rate up or down.

>**Note:** A higher learning rate makes the model converge faster, but if you adjust the learning rate too high, you risk over-fit and end-up worse on average.

### Initial time

The following output shows the initial time for learning rate decay:

```
initial_t = 0
```

>**Note:** Learning rates often decay over time, and this diagnostic output specifies the initial time. You can adjust with `--initial_t time`, although this is rarely necessary these days.

### Power on learning rate decay

The following output specifies the power on the learning rate decay: 

```
power_t = 0.5
```

The default is `0.5` and a minimax optimal choice that works well for most problems in Vowpal Wabbit. A different way of stating this is: stationary data-sets where the fundamental relation between the input features and target label are not changing over time, should benefit from a high (close to 1.0) `--power_t` while learning against changing conditions, like learning against an adversary who continuously changes the rules-of-the-game, would benefit from low (close to 0) `--power_t` so the learner can react quickly to these changing conditions.

>**Note:** You can adjust this `--power_t p` where _p_ is in the range [0,1]. 0 means the learning rate does not decay, which can be helpful when state tracking, while 1 is very aggressive, but plausibly optimal for [IID](https://en.wikipedia.org/wiki/Independent_and_identically_distributed_random_variables) data-sets. 

### Cache files

The following output shows that you are not using a cache file: 

```
using no cache
```

A cache file contains our dataset in a faster to handle format and can greatly speed up training if we use multiple passes or run multiple experiments on the same dataset (even with different options). The default cache file name is the dataset file name with `.cache` appended. 

For example: 

`house_dataset.cache` 

**Use** `--cache_file housing.cache` to override the default cache file name. 

The cache file is created the first time you use `-c`. If the cache exists and is newer than the dataset, that file is used by default.  

**Use** `-c` for multiple passes `--passes`, so Vowpal Wabbit caches the data in a faster format (passes > 1 should be much faster).  If you want to experiment with the same dataset over and over, it is highly recommended to pass `-c` every time you train.

### Data sources 

The following output shows the source of the data: 

```
Reading datafile = house_dataset
```

>**Note:** There are many different ways to input data to Vowpal Wabbit. Here we're just using a simple text file and VW tells us the source of the data. Alternative sources include **cache files** (from previous runs), **stdin**, or a **tcp socket**.

### Number of data sources

The following output shows the number of data sources:

```
num sources = 1
```

There is only one input file in this example, but we can specify multiple files.

## Vowpal Wabbit diagnostic header

Vowpal Wabbit prints live diagnostic information in the header like the following:

```
average  since         example        example  current  current  current
loss     last          counter         weight    label  predict features
0.000000 0.000000            1            1.0   0.0000   0.0000        5
0.666667 1.000000            2            3.0   1.0000   0.0000        5
```

 - The `average loss` output computes the [progressive validation](http://hunch.net/~jl/projects/prediction_bounds/progressive_validation/coltfinal.pdf){:target="blank"} loss. The critical thing to understand here is that progressive validation loss deviates like a test set, and hence is a reliable indicator of success on the first pass over any data-set.
 - The `since last` output is the progressive validation loss since the last printout.
 - The `example counter` output tells you which example is printed. In this case, it's example `2`.
 - `example weight` tells you the sum of the importance weights of examples seen so far. In this case it's `3.0`, because the second example has an importance weight of `2.0`.
 - The `current label` output tells you the label of the second example.
 - The `current predict` output tells you the prediction (before training) on the current example.
 - The `current features` output tells you the amount of features in the current example. 
 
The `current features` diagnostic is great for debugging. Note that we have five features when you expect four. This happens because VW always adds a default constant feature.

Use the `--noconstant` command-line option to turn it off.

VW prints a new line with an exponential backoff. This is very handy, because we can often debug a problem before the learning algorithm finishes going through a data-set.

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

At the end, some more straightforward totals are printed. The `best constant` and `best constant's loss` only work if you are using squared loss. Squared loss is the Vowpal Wabbit default. They compute the best constant's predictor and the loss of the best constant predictor. 

If `average loss` is not better than `best constant's loss`, something is wrong. In this case, we have too few examples to generalize.

If you want to overfit, use the following:

```sh
vw house_dataset -l 10 -c --passes 25 --holdout_off
```

The progress section of the output is:

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

You'll notice that by example 47 (25 passes over 3 examples result in 75 examples), the `since last` column has dropped to `0`, implying that by looking at the same (three lines) of data 25 times we have reached a perfect predictor. This is unsurprising with three examples having five features each. 

The reason we have to add `--holdout_off` is that when running multiple-passes, Vowpal Wabbit automatically switches to 'over-fit avoidance' mode by holding-out 10% of the examples (the "1 in 10" period can be changed using `--holdout_period period`) and evaluating performance on the held-out data instead of using the online-training progressive loss.

## Saving your model (a.k.a. regressor) into a file

By default VW learns the weights of the features and keeps them in an in memory vector. If you want to save the final regressor weights into a file, add `-f filename`:

```sh
vw house_dataset -l 10 -c --passes 25 --holdout_off -f house.model
```

## Getting predictions

We want to make predictions of course, this can be done by supplying the `-p filename` option. Stdout can be used as below:

```sh
vw house_dataset -p /dev/stdout --quiet
```

The output is:
```
0.000000
0.000000 second_house
1.000000 third_house
```

- The 1st output line `0.000000` is for the 1st example which has an empty tag.
- The 2nd output `0.000000 second_house` is for the 2nd example. You'll notice the tag appears here. This is the primary use of the tag: mapping predictions to the examples they belong to.
- The 3rd output `1.000000 third_house` is for the 3rd example. Clearly, some learning happened, because the prediction is now `1.000000` while the initial prediction was set to `0.5`.

Note that in this last example, we predicted _while we learned_. The model was being incrementally built in memory as VW went over the examples.

Alternatively, and more commonly, we would first learn and save the model into a file. Later we would predict using the saved model.

You may load a initial model to memory by adding `-i house.model`. You may also want to specify `-t` which stands for "test-only" (do no learning):

```sh
vw -i house.model -t house_dataset -p /dev/stdout --quiet
```

Which would output:
```
0.000000
1.000000 second_house
0.000000 third_house
```

Obviously the results are different this time, because in the first prediction example, we learned as we went, and made only one pass over the data, whereas in the 2nd example we first loaded an over-fitted (25 pass) model and used our data-set `house_dataset` with `-t` (testing only mode). In real prediction settings, one should use a different data-set for testing vs training.

## Auditing

When developing a new ML application, it's very helpful to debug. VW can help with this using the `--audit` option, which outputs extra informations about predictions and features.

```sh
vw house_dataset --audit --quiet
```

Output:
```
0
  price:229902:0.23:0@0  sqft:162853:0.25:0@0  age:165201:0.05:0@0  2006:2006:1:0@0  Constant:116060:1:0@0
0 second_house
  price:229902:0.18:0@0  sqft:162853:0.15:0@0  age:165201:0.35:0@0  1976:1976:1:0@0  Constant:116060:1:0@0
1 third_house
  price:229902:0.53:0.882655@0.2592  age:165201:0.87:0.453833@0.98  sqft:162853:0.32:1.05905@0.18  Constant:116060:1:0.15882@8  1924:1924:1:0@0
```

Every example uses two lines. The first line has the prediction, and the second line has one entry per feature. Looking at the first feature, we see:

```
price:229902:0.23:0@0.25
```

- `price` is the original feature name. If you use a namespace, it appears before `^` (i.e. `Namespace^Feature`). Namespaces are an advanced feature which allows you to group features and operate them on-the-fly, in the core of VW with the options: `-q XY` (cross a pair of namespaces), `--cubic XYZ` (cross 3 namespaces), `--lrq XYn` (low-rank quadratic interactions), and `--ignore X` (skip all features belonging to a namespace).
- `229902` is the index of the feature, computed by a hash function on the feature name.
- `0.23` is the value of the feature.
- `0` is the value of the feature's weight.
- `@0.25` represents the sum of gradients squared for that feature when you are using per-feature adaptive learning rates.

Examining further, you'll notice that the feature `2006` uses the index 2006. This means that you may use hashes or pre-computed indices for features, as is common in other machine learning systems.

The advantage of using unique integer-based feature-names is that they are guaranteed not to collide after hashing. The advantage of free-text (non integer) feature names is readability and self-documentation. Since only `:`, `|`, and _spaces_ are special to the VW parser, you can give features extremely readable names like: `height>2 value_in_range[1..5] color=red` and so on. Feature names may even start with a digit, e.g.: `1st-guess:0.5 2nd-guess:3` etc.

## What's next?

The above only scratches the surface of VW. You can learn with other loss functions, with other optimizers, with other representations, with clusters of 1000s of machines, and even do ridiculously fast active learning.

- Learn about using VW to do reinforcement learning in the [Contextual Bandit tutorial]( {{ "tutorials/contextual_bandits.html" | relative_url}} )
- Explore more content in the <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Tutorial#more-tutorials" target="_blank">tutorials section of the GitHub wiki</a>
- Browse <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Examples" target="_blank">examples on the GitHub wiki</a>

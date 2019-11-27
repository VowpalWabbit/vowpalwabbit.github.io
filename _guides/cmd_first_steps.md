---
title: Getting started with the command line
order: 5
module_id: cmd_getting_started
description: This tutorial runs you through the absolute basics for the command line
guide_link_text: Read the command line getting started
level: basic
layout: tutorial
tags: getting&nbsp;started command&nbsp;line
---

# Getting started with Vowpal Wabbit command line

This tutorial introduces Vowpal Wabbit command line basics with a quick introduction to training and testing your model with Vowpal Wabbit. We explore passing some data to Vowpal Wabbit to learn a model and get a prediction. 

To learn more about interacting with Vowpal Wabbit, including advanced tutorials on input formatting and interpreting results, see [Tutorials](https://vowpalwabbit.org/tutorials.html).

### Install Vowpal Wabbit

To install Vowpal Wabbit see [Get Started](https://vowpalwabbit.org/start.html).

## Training scenario and dataset

For this tutorial scenario, we want to use Vowpal Wabbit to help us predict whether or not a house will require a new roof in the next 10 years.

First, create a file ‘train.txt’ and copy the following dataset:

```
0 | price:.23 sqft:.25 age:.05 2006
1 | price:.18 sqft:.15 age:.35 1976
0 | price:.53 sqft:.32 age:.87 1924
```

>**Note:** If the format of this sample dataset looks unfamiliar and you want more details see the Vowpal Wabbit [Linear Regression Tutorial](https://vowpalwabbit.org/guides/getting_started.html#a-first-data-set) for information on input format and feature hashing techniques.

## Train a model

Next, we train a model, and save it to a file:

```sh
vw -d train.txt -f model.vw
```

This tells Vowpal Wabbit to:

- Use the '-d' **data** file `train.txt`
- Write the '-f" **final** model to `model.vw`

With Vowpal Wabbit, the output includes more than a few statistics and statuses. The [Linear Regression Tutorial](https://vowpalwabbit.org/guides/getting_started.html#vws-diagnostic-information) and [Contextual Bandit Reinforcement Learning Tutorial](https://vowpalwabbit.org/tutorials/contextual_bandits.html) covers this format in more detail:

<details>
  <summary><strong>Output for comparison</strong></summary>

```
final_regressor = model.vw
Num weight bits = 18
learning rate = 0.5
initial_t = 0
power_t = 0.5
using no cache
Reading datafile = train.txt
num sources = 1
average  since         example        example  current  current  current
loss     last          counter         weight    label  predict features
0.000000 0.000000            1            1.0   0.0000   0.0000        5
0.500000 1.000000            2            2.0   1.0000   0.0000        5

finished run
number of examples = 3
weighted example sum = 3.000000s
weighted label sum = 1.000000
average loss = 0.666667
best constant = 0.333333
best constant's loss = 0.222222
total feature number = 15
```

</details>

## Test

Create a file, called `test.txt` and paste this into it:
```
| price:.46 sqft:.4 age:.10 1924
```

We can then get a prediction by loading in the model and supplying our test set:
```sh
vw -d test.txt -i model.vw -p predictions.txt
```
This tells VW to:
- Use the **d**ata file `test.txt`
- Use the **i**nput model `model.vw`
- Write **p**redictions to `predictions.txt`

<details>
  <summary>Output for comparison</summary>

```
predictions = predictions.txt
Num weight bits = 18
learning rate = 0.5
initial_t = 0
power_t = 0.5
using no cache
Reading datafile = test.txt
num sources = 1
average  since         example        example  current  current  current
loss     last          counter         weight    label  predict features
    n.a.     n.a.            1            1.0  unknown   0.0000        5

finished run
number of examples = 1
weighted example sum = 1.000000
weighted label sum = 0.000000
average loss = n.a.
```

</details>

`cat predictions.txt` shows:
```
0
```

So the model predicted a value of 0, this house wont need a new roof in the next 10 years. Well, at least according to our model learned from 3 examples...

## Next Steps

The next step is the [linear regression tutorial](https://vowpalwabbit.org/guides/getting_started.html). You'll get another look at the house roof problem and learn about VW's input format and output information.

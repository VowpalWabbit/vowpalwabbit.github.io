---
page_title: Command Line Tutorial | Vowpal Wabbit
page_description: Learn command line basics and explore how to train and test your models with Vowpal Wabbit.
title: Getting started with Vowpal Wabbit command line
order: 5
module_id: cmd_getting_started
description: Learn command line basics and explore how to train and test your models with Vowpal Wabbit.
guide_link_text: See command line tutorial
level: basic
layout: tutorial
tags: getting&nbsp;started command&nbsp;line
---

# Getting started with Vowpal Wabbit command line

This tutorial introduces Vowpal Wabbit command line basics with a quick introduction to training and testing your model with Vowpal Wabbit. We explore passing some data to Vowpal Wabbit to learn a model and get a prediction.

For more advanced Vowpal Wabbit tutorials, including how to format data and understand results, see [Tutorials](https://vowpalwabbit.org/tutorials.html).

<div class="prerequisites" markdown="1">
**Prerequisites**

To install Vowpal Wabbit see [Get Started](https://vowpalwabbit.org/start.html).
</div>

## Training scenario and dataset

For this tutorial scenario, we want to use Vowpal Wabbit to help us predict whether or not a house will require a new roof in the next 10 years.

First, create a file `train.txt` and copy the following dataset:

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

- Use the `-d` **data** file `train.txt`.
- Write the `-f` **final** model to `model.vw`.

With Vowpal Wabbit, the output includes more than a few statistics and statuses. The [Linear Regression Tutorial](https://vowpalwabbit.org/guides/getting_started.html#vws-diagnostic-information) and [Contextual Bandit Reinforcement Learning Tutorial](https://vowpalwabbit.org/tutorials/contextual_bandits.html) covers this format in more detail:

<details>
  <summary><strong>Output for comparison:</strong></summary>

  <div class="output" markdown="1">
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
</div>
</details>

## Test a model

Now, create a file called `test.tx` and copy this data:

```
| price:.46 sqft:.4 age:.10 1924
```

We get a prediction by loading the model and supplying our test data:

```sh
vw -d test.txt -i model.vw -p predictions.txt
```
This tells Vowpal Wabbit to:

- Use the `-d` **data** file `test.txt`.
- Use the `-i` **input** model `model.vw`.
- Write `-p` **predictions** to `predictions.txt`.

<details>
  <summary><strong>Output for comparison:</strong></summary>

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

### Vowpal Wabbit results
The model predicted a value of ‘0’. This result means our house will not need a new roof in the next 10 years (based on just three examples we used in our training dataset).

## More to explore

- See the Vowpal Wabbit Python Tutorial for a quick introduction to the basics of training and testing your model.
- To learn more about how to approach a contextual bandits problem using Vowpal Wabbit — including how to  work with different contextual bandits approaches, how to format data, and understand the results — see the [Contextual Bandit Reinforcement Learning Tutorial](https://vowpalwabbit.org/tutorials/contextual_bandits.html).
- For more on the contextual bandits approach to reinforcement learning, including a content personalization scenario, see the [Contextual Bandit Simulation Tutorial](https://vowpalwabbit.org/tutorials/cb_simulation.html).
- See the [Linear Regression Tutorial](https://vowpalwabbit.org/guides/getting_started.html) for a different look at the roof replacement problem and learn more about Vowpal Wabbit's format and understanding the results.

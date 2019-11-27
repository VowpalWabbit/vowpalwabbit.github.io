---
page_title: Python Tutorial | Vowpal Wabbit
page_description: This tutorial is a quick introduction to training and testing your model with Vowpal Wabbit using Python.
title: Getting started with Vowpal Wabbit and Python
order: 6
module_id: python_getting_started
description: This tutorial is a quick introduction to training and testing your model with Vowpal Wabbit using Python. 
guide_link_text: See the Vowpal Wabbit Python tutorial 
level: basic
layout: tutorial
tags: getting&nbsp;started Python
---

# Getting started with Vowpal Wabbit and Python

This tutorial is a quick introduction to training and testing your model with Vowpal Wabbit using Python. We explore passing some data to Vowpal Wabbit to learn a model and get a prediction. 

For more advanced Vowpal Wabbit tutorials, including how to format data and understand results, see [Tutorials](https://vowpalwabbit.org/tutorials.html).

<div class="prerequisites" markdown="1">
**Prerequisites**

To install Vowpal Wabbit see [Get Started](getting_started.html).

>**Note** This tutorial uses the [Vowpal Wabbit Python package](https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/python).
</div>

## Getting started

First, make sure you import the following Python package for this tutorial:

```Python
from vowpalwabbit import pyvw
```

Next, we create an instance of Vowpal Wabbit, and pass the `quiet=True` option to avoid diagnostic information output to `stdout` location:

```Python
model = pyvw.vw(quiet=True)
```

## Training scenario and dataset

For this tutorial scenario, we want Vowpal Wabbit to help us predict whether or not our house will require a new roof in the next 10 years.

To create some examples, we use the Vowpal Wabbit text format and then learn on them: 

```Python
train_examples = ["0 | price:.23 sqft:.25 age:.05 2006"
                  "1 | price:.18 sqft:.15 age:.35 1976"
                  "0 | price:.53 sqft:.32 age:.87 1924"]

for example in train_examples:
    model.learn(example)
```

>**Note:** For more details on Vowpal Wabbit input format and feature hashing techniques see the [Linear Regression Tutorial](https://vowpalwabbit.org/guides/getting_started.html).

Now, we create a `test_example` to use for prediction:

```Python
test_example = "| price:.46 sqft:.4 age:.10 1924"

prediction = model.predict(test_example)
print(prediction)
```
**Output:**

```
0.0
```

### Vowpal Wabbit results

The model predicted a value of `0`. According to our learning model, our house will not need a new roof in the next 10 years (at least that is the result from just three examples we used in our training dataset). 

## More to explore

- To learn how to approach a contextual bandits problem using Vowpal Wabbit — including how to  work with different contextual bandits approaches, how to format data, and understand the results — see the [Contextual Bandit Reinforcement Learning Tutorial](https://vowpalwabbit.org/tutorials/contextual_bandits.html).
- For more on the contextual bandits approach to reinforcement learning, including a content personalization scenario, see the [Contextual Bandit Simulation Tutorial](https://vowpalwabbit.org/tutorials/cb_simulation.html).
- See the [Linear Regression Tutorial](https://vowpalwabbit.org/guides/getting_started.html) for a different look at the roof replacement problem and learn more about Vowpal Wabbit's format and understanding the results.

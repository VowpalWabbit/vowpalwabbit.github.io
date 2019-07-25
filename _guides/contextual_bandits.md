---
title: Get started with Contextual Bandits
order: -1
module_id: contextual_bandits
description: This tutorial will run you through using VW for a Contextual Bandit problem.
guide_link_text: 'Begin tutorial'
show_on_learn: false
layout: tutorial
body_class: tutorial
resource_icon: /svg/resources/guide.svg
---

# Contextual Bandits in VW

The goal of this tutorial is to have you walk away with an understanding of Contextual Bandits, when CB can be used, how to run CB algorithms in Vowpal Wabbit (VW), and hopefully make you feel empowered and excited to use it on your own. This tutorial focuses on Python but VW is also supported in C++ and C#.

## What is a Contextual Bandit?

Consider an application that interacts with its environment, such as a news website with users or a cloud controller with machines. Let's call this application _APP_. This application repeatedly goes through the following:
1. Some context x arrives and is observed by _APP_
2. _APP_ chooses an action _a_ from a set of actions _A_ i.e. a ∈ A to take (A may depend on x)
3. Some reward r for the chosen a is observed by _APP_

We want our application _APP_ to take actions such that we get the highest possible reward. In machine learning parlance, we want a _model_ that tells us which action to take.

This scenario is very similar to a traditional <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank">Multi Armed Bandit (MAB)</a>. The term "multi-armed bandit" comes from a hypothetical experiment where a gambler must choose between multiple actions (i.e. slot machines, the "one-armed bandits"), each with an unknown payout. The goal is to maximize the payout by optimally choosing the best actions when odds and payouts are unknown.

In MAB, the gambler has no information at all to make a decision. However, our application _APP_ differs from MAB because we have some information available to the _APP_ which is the "context". Contextual Bandits uses additional information i.e. context available to make better decisions while choosing actions. Hence, the name "contextual" bandits.

In the contextual bandit problem, a learner (the gambler in the hypothetical experiment) repeatedly observes a context, chooses an action, and observes a loss/cost/reward for the chosen action only.

We use the term "policy" many times in this tutorial. For those new to RL, let's try to understand the distinction between _model_ and _policy_. In essence "policy" for RL is roughly equivalent to "model".  The word "model", as used in machine learning essentially means "learned function". When someone says "policy", it is more specific than "model", because it indicates this is a model that acts in the world.

In Contextual Bandits, the contexts and actions are usually represented as feature vectors. _APP_ chooses actions by applying a policy _π_ that takes a context as input and returns an action. The goal is to find a policy that maximizes average reward over a sequence of interactions.

## Real world examples of contextual bandit

1. News website
  - Decision to optimize: which article to display to user
  - Context: user features - browsing history, location, device, time of day
  - Actions: available news articles
  - Reward: user engagement - click or no click

2. Cloud Controller
  - Decision to optimize: wait time before reboot of unresponsive machine
  - Context: machine hardware spec - sku, os etc., failure history, location, load
  - Actions: minutes - {1 ,2 , ...N}
  - Reward: - total downtime

## CB algorithms

The focal point of Contextual Bandit learning research is efficient exploration algorithms. For more details, please refer to the <a href="https://arxiv.org/pdf/1802.04064.pdf" target="_blank">Contextual Bandit bake-off paper</a>.

VW offers various CB algorithms. For more details, please refer to the <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Contextual-Bandit-algorithms" target="_blank">Github wiki</a>.

Having said that, we have tried to summarize as much as we can in this tutorial with the intention that you learn a quite a bit about CB in general and working with CB algorithms in VW.

## VW CB functionalities

In this section we go over different CB functionalities offered by VW, understand how to format data and understand the results.

### Specifying CB approach

Multiple policy evaluation approaches can be used when optimizing a policy. VW offers 4 approaches that you can specify using `--cb_type`:

- Inverse Propensity Score `--cb_type ips`
- Doubly Robust `--cb_type dr`
- Direct Method `--cb_type dm`
- Multi Task Regression/Importance Weighted Regression `--cb_type mtr`

For more details, please refer to the <a href="https://arxiv.org/pdf/1802.04064.pdf" target="_blank">Contextual Bandit bake-off paper</a>.

**CB algorithms** in VW can be classified as:

1. `--cb`: CB module which allows you to optimize predictor based on already collected CB data, CB without exploration
2. `--cb_explore`: CB learning algorithm for when the maximum number of actions is known ahead of time and semantics of actions stays the same across examples
3. `--cb_explore_adf`: CB learning algorithm for when the set of actions changes over time or we have rich information for each action

### Specifying exploration algorithms

VW offers 5 exploration algorithms

- Explore-first `--first`
- Epsilon-greedy `--epsilon`
- Bagging Explorer `--bag`
- Online Cover `--cover` 
- Softmax Explorer `--softmax` (only supported for `--cb_explore_adf`)

For more details, please refer to the <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Contextual-Bandit-algorithms" target="_blank">Github wiki</a>.

## Input Format

Let's recall - A CB problem has four main components:

- **Context (x)**: the additional information which helps in choosing action
- **Action (a)**: the action chosen from a set of possible actions _A_
- **Probability (p)**: probability of choosing _a_ from _A_
- **Cost/Reward (r)**: reward received for action _a_

We next look at the input format for different CB types that VW offers

### 1. `--cb`

`--cb <number_of_actions>`: e.g. --cb 4 specifies we want to use CB module and our data has a total of 4 actions.

Each example must be a separate line in your data file and must follow the format:
```
action:cost:probability | features
```
You may notice that the left side of the | is different to the example in the linear regression tutorial. This is because CB has a different label type. The format is the same on the right side of the |, and in this case they are specified by the context _x_.

Sample data file (train.dat) with five examples:
```
1:2:0.4 | a c
3:0.5:0.2 | b d
4:1.2:0.5 | a b c
2:1:0.3 | b c
3:1.5:0.7 | a d
```

Usage: `./vw -d train.dat --cb 4`

**Note:** The usage mentioned in this section is for using VW command line. However, in the example tutorial below, we also see how to use it in Python.

### 2. `--cb_explore`

`--cb_explore <number_of_actions>`: e.g. `--cb_explore 4` specifies our examples explore a total of 4 actions. Since this is exploring through the action space, you also have to specify which algorithm you want to use for exploration.

The example format is same as in the case of `--cb`

Usage:
- `./vw -d train.dat --cb_explore 4 --first 2`
  - In this case, on the first two actions, we take each of the 4 actions with probability 1/4.
- `./vw -d train.dat --cb_explore 4 --epsilon 0.2`
  - In this case, the prediction of the current learned policy is taken with probability 1 - _epsilon_ (i.e. 80% of the time) and with the remaining (i.e. 20%) epsilon probability an action is chosen uniformly at random.
- `./vw -d train.dat --cb_explore 4 --bag 5`
  - In this case, we use an ensemble approach. We take an argument _m_ for `--bag` and train _m_ different policies, i.e. 5 in the above example. The policies differ because they are being trained on different subsets of data, with each example going to a subset of the _m_ policies.
- `./vw -d train.dat --cb_explore 4 --cover 3`
  - In this case, similar to bagging _m_ different policies are trained but unlike bagging the training of these policies is explicitly optimized to result in a diverse set of predictions, choosing all the actions which are not already learned to be bad in a given context. This is a _theoretically optimal_ exploration algorithm. If you are curious to learn more, you can read more about it in this <a href="http://arxiv.org/abs/1402.0555" target="_blank">paper</a>.

### 3. `--cb_explore_adf`

`--cb_explore_adf` e.g. `--cb_explore_adf` Since this exploring through the action space, you also have to specify which algorithm you want to use for exploration.

The example format for this one is a little bit different from the other two cases because the action set changes over time or we have rich information for each action. Hence, it is best to create features for every (context, action) pair rather than features associated only with context and shared across all actions.

Let's look at it in more detail to understand it better -
- Each example now spans multiple lines, with one line per action
- For each action, we have the label information (action, cost, probability), if known, as before
- The action field _a_ is ignored now since actions are identified by line numbers, and typically set to 0
- The semantics of cost and probability are same as before
- Each example is also allowed to specify the label information on precisely one action
- A newline signals end of a multiline example
- Additionally, we can specify contextual features which are shared across all actions in a line at the beginning of an example, which always has a `shared` label, as in the second multiline example below. Since the shared line is not associated with any action, it should never contain the label information.

Sample data file (train.dat) with two examples:
```
| a:1 b:0.5
0:0.1:0.75 | a:0.5 b:1 c:2

shared | s_1 s_2
0:1.0:0.5 | a:1 b:1 c:1
| a:0.5 b:2 c:1
```
In the first example above, we have 2 actions, one line for each. The first line represents the first action and it has two action dependent features _a_ and _b_. The second line represents the second action and it has three action dependent features _a_, _b_ and _c_. The second action was the chosen action for the example and it follows the format
```
action:cost:probability | features
0:0.1:0.75 |
```
Action 0 is ignored, has cost 0.1 and probability of 0.75.

Usage:

- `./vw -d train_adf.dat --cb_explore_adf`
- `./vw -d train.dat --cb_explore_adf --first 2`
- `./vw -d train.dat --cb_explore_adf --epsilon 0.1`
- `./vw -d train.dat --cb_explore_adf --bag 5`
- `./vw -d train.dat --cb_explore_adf --softmax --lambda 10`

In the case of the softmax explorer, which uses the policy to not only predict an action but also predict a score indicating the quality of each action. A distribution is then created with the probability of action a being is proportional to exp(lambda*score(x,a)). Here lambda is a parameter, which leads to uniform exploration for lambda = 0, and stops exploring as lambda approaches infinity. In general, this provides another nice knob for controlled exploration based on the uncertainty in the learned policy.

## Let's create a small data-set

### Set-up
Load required packages
```python
import pandas as pd
import sklearn as sk
import numpy as np
```

Install [Vowpal Wabbit Python package](https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/python)
```sh
pip install boost
apt-get install libboost-program-options-dev zlib1g-dev libboost-python-dev -y
pip install vowpalwabbit
```

Generate sample training data that could originate from previous random trial, e.g. AB test, for the CB to explore. The data here is equivalent to the <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Logged-Contextual-Bandit-Example" target="_blank">wiki example</a>.
```python
train_data = [{'action': 1, 'cost': 2, 'probability': 0.4, 'feature1': 'a', 'feature2': 'c', 'feature3': ''},
              {'action': 3, 'cost': 0, 'probability': 0.2, 'feature1': 'b', 'feature2': 'd', 'feature3': ''},
              {'action': 4, 'cost': 1, 'probability': 0.5, 'feature1': 'a', 'feature2': 'b', 'feature3': ''},
              {'action': 2, 'cost': 1, 'probability': 0.3, 'feature1': 'a', 'feature2': 'b', 'feature3': 'c'},
              {'action': 3, 'cost': 1, 'probability': 0.7, 'feature1': 'a', 'feature2': 'd', 'feature3': ''}]

train_df = pd.DataFrame(train_data)

# Add index to data frame
train_df['index'] = range(1, len(train_df) + 1)
train_df = train_df.set_index("index")
```

Generate some test data that you want the CB to make decisions for, e.g. features describing new users, for the CB to exploit.
```python
test_data = [{'feature1': 'b', 'feature2': 'c', 'feature3': ''},
            {'feature1': 'a', 'feature2': '', 'feature3': 'b'},
            {'feature1': 'b', 'feature2': 'b', 'feature3': ''},
            {'feature1': 'a', 'feature2': '', 'feature3': 'b'}]

test_df = pd.DataFrame(test_data)

# Add index to data frame
test_df['index'] = range(1, len(test_df) + 1)
test_df = test_df.set_index("index")
```

Let's look at the dataframes
```python
train_df.head()

test_df.head()
```

### Let's try `--cb` in Python

First, create the Python model - this stores the model parameters in the Python `vw` object. Here we use arguments for a Contextual Bandit with four possible actions.
```python
from vowpalwabbit import pyvw

vw = pyvw.vw("--cb 4")
```
Note: You can pass `--quiet` if you want vw to stop talking while it's working.


Next, for each train example we call learn on our vw model.
```python
for i in train_df.index:
  action = train_df.loc[i, "action"]
  cost = train_df.loc[i, "cost"]
  probability = train_df.loc[i, "probability"]
  feature1 = train_df.loc[i, "feature1"]
  feature2 = train_df.loc[i, "feature2"]
  feature3 = train_df.loc[i, "feature3"]

  # Construct the example in the required vw format.
  learn_example = str(action) + ":" + str(cost) + ":" + str(probability) + " | " + str(feature1) + " " + str(feature2) + " " + str(feature3)

  # Here we do the actual learning.
  vw.learn(learn_example)
```

Use the model that was just trained on the train set to perform predictions on the test set. We construct the example as before but don't include the label and pass it into predict instead of learn.
```python
for j in test_df.index:
  feature1 = test_df.loc[j, "feature1"]
  feature2 = test_df.loc[j, "feature2"]
  feature3 = test_df.loc[j, "feature3"]

  test_example = "| " + str(feature1) + " " + str(feature2) + " " + str(feature3)

  choice = vw.predict(test_example)
  print(j, choice)
```
The CB assigns every instance to action 3 as it should per the cost structure of the train data; you can play with the cost structure to see that the CB updates its predictions accordingly.

The model you just trained can be saved and loaded from a file. The `-i` argument means input regressor, telling vw to load a model from that file instead of starting from scratch.
```python
vw.save('cb.model')
del vw

vw = pyvw.vw("--cb 4 -i cb.model")
print(vw.predict('| a b'))
```

## What's next?

- Look through <a href="https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/python/examples" target="_blank">example Python notebooks</a>
- Explore more content in the <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Tutorial#more-tutorials" target="_blank">tutorials section of the GitHub wiki</a>
- Browse <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Examples" target="_blank">examples on the GitHub wiki</a>
- Check out the various <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Command-Line-Arguments" target="_blank">command line options of VW</a>

We hope you have fun exploring VW!

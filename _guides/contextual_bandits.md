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

# Contextual Bandits and Vowpal Wabbit

This guide describes how to approach a contextual bandit problem with Vowpal Wabbit (VW). It features a Python tutorial and an overview of the contextual bandit problem using VW—including when and how to work with with different CB approaches, how to format VW test data, and understand the results. 

## Getting started with Vowpal Wabbit

To install VW—and for more information on building VW from source or using a package manager—see [Getting started](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Getting-started) guide. 

>**Note:** The CB tutorial uses [Vowpal Wabbit Python package](https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/python). Additional binary packages are available for select platforms. See [Getting started](https://cheng-tan.github.io/vowpalwabbit.github.io/) module on the homepage for more information.

## The contextual bandit problem

The contextual bandit problem is an extension of the multi-armed bandit (MAB) problem. The MAB problem comes from a hypothetical experiment where a gambler must choose between multiple slot machine (“one-armed bandits”) actions, each with an unknown payout. The goal is to maximize the payout by optimally choosing the best actions when odds and payouts are unknown. 

In MAB, the gambler has no information at all to make a decision. In the CB problem, a learner (the gambler in the hypothetical experiment) repeatedly observes a context, chooses an action, and observes a loss/cost/reward for the chosen action only. Contextual bandit algorithms use additional side information (or context) from each arm to aid decision-making decisions when choosing actions in dynamic environments—where options change rapidly, and the set of available actions is limited.

## Working with CB in Vowpal Wabbit

To introduce a VW approach to the contextual bandit problem and explore capabilities, this guide uses a hypothetical application called _APP_. 

_APP_ interacts with the context of a user's behavior (search history, visited pages, or geolocation) in a dynamic environment–such as a news website or a cloud controller. _APP_ differs from MAB because we have some information available to the _APP_, which is the context.

_APP_ performs the following functions:

* Some context _x_ arrives and is observed by _APP_.
* _APP_ chooses an action _a_ from a set of actions _A, i.e., a ∈A_ (_A_ may depend on _x_).
* Some reward _r_ for the chosen a is observed by _APP_.

Contextual bandits use incoming data to help optimize a website to make better algorithmic decisions in real-time for the user.

For example:

_APP_ news website:
  - **Decision to optimize:** articles to display to user.
  - **Context:** user data (browsing history, location, device, time of day)
  - **Actions:** available news articles
  - **Reward:** user engagement (click or no click)

 _APP_ cloud controller:
  - **Decision to optimize:** the wait time before reboot of unresponsive machine.
  - **Context:** the machine hardware specs (SKU, OS, failure history, location, load).
  - **Actions:** time in minutes - {1 ,2 , ...N}
  - **Reward:** - the total downtime

You want  _APP_ to take actions that provide the highest possible reward. In machine learning parlance, we want a _model_ that tells us which action to take. 

### Policy vs. model

We use the term _policy_ many times in this tutorial. In Reinforcement Learning (RL), the policy is roughly equivalent to _model_.

In machine learning, the model means _learned function_. When someone says policy, it is more specific than model because it indicates this is a model that acts in the world.

Contexts and actions are typically represented as feature vectors in CB algorithms. For example, _APP_ chooses actions by applying a policy **π** that takes a context as input and returns an action. The goal is to find a policy that maximizes the average reward over a sequence of interactions.

### Specifying the CB approach

There are multiple policy evaluation approaches available to optimize a policy. VW offers four approaches to specify CB approach using `--cb_type`:

- **Inverse Propensity Score:** `--cb_type ips`
- **Doubly Robust:** `--cb_type dr`
- **Direct Method:** `--cb_type dm`
- **Multi Task Regression/Importance Weighted Regression:** `--cb_type mtr`

>**Note:** The focal point of CB learning research is efficient exploration algorithms. For more details, see the <a href="https://arxiv.org/pdf/1802.04064.pdf" target="_blank">Contextual Bandit bake-off paper</a>.

### Specifying exploration algorithms

VW offers five exploration algorithms:

- **Explore-First** `--first`
- **Epsilon-Greedy** `--epsilon`
- **Bagging Explorer** `--bag`
- **Online Cover** `--cover`
- **Softmax Explorer** `--softmax` (only supported for `--cb_explore_adf`)

>**Note:** For more details on CB algorithms in VW, please refer to the <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Contextual-Bandit-algorithms" target="_blank">Vowpal Wabbit Github Wiki</a>.

## Contextual Bandit algorithms and input formats

There are four main components to a Contextual Bandit problem:

- **Context (x)**: the additional information which helps in choosing action.
- **Action (a)**: the action chosen from a set of possible actions _A_.
- **Probability (p)**: the probability of choosing _a_ from _A_.
- **Cost/Reward (r)**: the reward received for action _a_.

Vowpal Wabbit provides three CB algorithms:

* **`--cb`:** The CB module which allows you to optimize predictor based on already collected CB data, CB without exploration.
* **`--cb_explore`:** The CB learning algorithm for when the maximum number of actions is known ahead of time and semantics of actions stays the same across examples.
*  **`--cb_explore_adf`:** The CB learning algorithm for when the set of actions changes over time or you have rich information for each action VW offers different input formats for CB.

### Input format for `--cb`

`--cb <number_of_actions>`

The `--cb 4` command specifies that we want to use CB module and our data has a total of four actions.

Each example is represented as a separate line in your data file and must follow the following format:

```
action:cost:probability | features
```

Sample data file **train.dat** with five examples:

```
1:2:0.4 | a c
3:0.5:0.2 | b d
4:1.2:0.5 | a b c
2:1:0.3 | b c
3:1.5:0.7 | a d
```

Use the command `./vw -d train.dat --cb 4`

>**Note:** This usage is for the VW command line. See below for a Python tutorial.

### Input format for `--cb_explore`

`--cb_explore <number_of_actions>`

The command `--cb_explore 4` specifies our examples explore a total of four actions.

>**Note:** This format explores the action space so you must specify which algorithm you want to use for exploration.

#### Usage

The following examples use the input format for the `--cb` command example above:

`./vw -d train.dat --cb_explore 4 --first 2`

 In this case, on the first two actions, you take each of the four actions with probability 1/4.

`./vw -d train.dat --cb_explore 4 --epsilon 0.2`

In this case, the prediction of the current learned policy takes with probability 1 - _epsilon_ 80% of the time, and with the remaining 20% epsilon probability, an action is chosen uniformly at random.

`./vw -d train.dat --cb_explore 4 --bag 5`

In this case, you use an ensemble approach. Take an argument _m_ for `--bag` and train _m_ different policies (for example `5` in the above example). The policies differ because they train on different subsets of data, with each example going to a subset of the _m_ policies.

`./vw -d train.dat --cb_explore 4 --cover 3`

This algorithm is a theoretically optimal exploration algorithm. Similar to the previous bagging _m_ example, different policies are trained in this case. Unlike bagging, the training of these policies is explicitly optimized to result in a diverse set of predictions—choosing all the actions which are not already learned to be bad in a given context. 

For more information and research on this theoretically optimal exploration algorithm see this <a href="http://arxiv.org/abs/1402.0555" target="_blank">paper</a>.

### Input format for `--cb_explore_adf`

`--cb_explore_adf`

The command `--cb_explore_adf` is different from the other two example cases because the action set changes over time (or we have rich information for each action). 

- Each example now spans multiple lines, with one line per action
- For each action, we have the label information (action, cost, probability), if known.
- The action field _a_ is ignored now since line numbers identify actions and typically set to the 0.
- The semantics of cost and probability are the same as before.
- Each example is also allowed to specify the label information on precisely one action.
- A new line signals end of a multiline example.

It best to create features for every (context, action) pair rather than features associated only with context and shared across all actions.

>**Note:** This format explores the action space so you must specify which algorithm you want to use for exploration.

### Shared contextual features

You can specify contextual features which share all line actions at the beginning of an example, which always has a `shared` label, as in the second multiline example below.

Since the shared line is not associated with any action, it should never contain the label information.

Sample data file **train.dat** with two examples:

```
| a:1 b:0.5
0:0.1:0.75 | a:0.5 b:1 c:2

shared | s_1 s_2
0:1.0:0.5 | a:1 b:1 c:1
| a:0.5 b:2 c:1
```
In the first example, we have two actions, one line for each. The first line represents the first action, and it has two action dependent features _a_ and _b_. 

`| a:1 b:0.5`

The second line represents the second action, and it has three action dependent features _a_, _b_, and _c_. 

`0:0.1:0.75 | a:0.5 b:1 c:2`

If the second action is the chosen action it follows the following format:

```
action:cost:probability | features
0:0.1:0.75 |
```
Action 0 is ignored, has cost 0.1 and a probability of 0.75.

#### Usage

In the case of the softmax explorer, which uses the policy not only to predict an action but also predict a score indicating the quality of each action. The probability of action _a_ creates distribution proportional to exp(lambda*score(x,a)).

- `./vw -d train_adf.dat --cb_explore_adf`
- `./vw -d train.dat --cb_explore_adf --first 2`
- `./vw -d train.dat --cb_explore_adf --epsilon 0.1`
- `./vw -d train.dat --cb_explore_adf --bag 5`
- `./vw -d train.dat --cb_explore_adf --softmax --lambda 10`

Here lambda is a parameter, which leads to uniform exploration for lambda = 0, and stops exploring as lambda approaches infinity. In general, this provides an excellent knob for controlled exploration based on the uncertainty in the learned policy.

## Create Contextual Bandit test data

## Create Contextual Bandit test data

Begin by loading the required Python packages:

```python
import pandas as pd
import sklearn as sk
import numpy as np
```

Install [Vowpal Wabbit Python package](https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/python):

```sh
pip install boost
apt-get install libboost-program-options-dev zlib1g-dev libboost-python-dev -y
pip install vowpalwabbit
```

Now, generate some sample training data that could originate from previous random trial, e.g. AB test, for the CB to explore:

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

>**Note:** The data here is equivalent to the <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Logged-Contextual-Bandit-Example" target="_blank">VW wiki example</a>.

Next, create test data, for example features describing new users, for the CB to exploit to make decisions:

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

Your dataframes are:

```python
train_df.head()

test_df.head()
```

###  Contextual Bandits Python tutorial

First, create the Python model store the model parameters in the Python `vw` object.

Use the following command for a Contextual Bandit with four possible actions:

```python
from vowpalwabbit import pyvw

vw = pyvw.vw("--cb 4")
```

>**Note:** Use `--quiet` command to turn off diagnostic information in Vowpal Wabbit.

Now, call learn for each trained example on your VW model.

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

Use the model that was just trained on the train set to perform predictions on the test set. Construct the example like before but don't include the label and pass it into _predict_ instead of _learn_. For example:

```python
for j in test_df.index:
  feature1 = test_df.loc[j, "feature1"]
  feature2 = test_df.loc[j, "feature2"]
  feature3 = test_df.loc[j, "feature3"]

  test_example = "| " + str(feature1) + " " + str(feature2) + " " + str(feature3)

  choice = vw.predict(test_example)
  print(j, choice)
```

>**Note:** The CB assigns every instance to the third action as it should per the cost structure of the train data. You can save and load the model you train from a file.

Finally, experiment with the cost structure to see that the CB updates its predictions accordingly.

```python
vw.save('cb.model')
del vw

vw = pyvw.vw("--cb 4 -i cb.model")
print(vw.predict('| a b'))
```

The `-i` argument means input regressor, telling VW to load a model from that file instead of starting from scratch.

## More to explore

- Review the <a href="https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/python/examples" target="_blank">example Python notebooks</a>
- Explore the <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Tutorial#more-tutorials" target="_blank">tutorials section of the GitHub wiki</a>
- Browse <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Examples" target="_blank">examples on the GitHub wiki</a>
- Learn various <a href="https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Command-Line-Arguments" target="_blank">VW commands</a>

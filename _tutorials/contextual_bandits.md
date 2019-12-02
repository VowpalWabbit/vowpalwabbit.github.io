---
page_title: Contextual Bandits Reinforcement Learning | Vowpal Wabbit
page_description: This tutorial includes an overview of the contextual bandits approach to reinforcement learning and how to approach this problem using Vowpal Wabbit.
title: Contextual bandits and Vowpal Wabbit
order: 2
description: This tutorial runs through the contextual bandit approach to reinforcement learning with Vowpal Wabbit.
layout: tutorial
level: advanced
tags: contextual&nbsp;bandits command&nbsp;line python
jupyter_notebook_name: Contextual_bandits_and_Vowpal_Wabbit.ipynb
---

# Contextual Bandits Reinforcement Learning with Vowpal Wabbit

<div class="prerequisites" markdown="1">
**Prerequisites**

To install Vowpal Wabbit see [Get Started](getting_started.html).

>**Note** The contextual bandits tutorial uses [Vowpal Wabbit Python package](https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/python). Additional binary packages are available for select platforms. 
</div>

### Overview

This tutorial includes a brief overview of reinforcement learning, the contextual bandits approach to this machine learning paradigm, and describes how to approach a contextual bandits problem with Vowpal Wabbit. No prior knowledge of contextual bandits, reinforcement learning, or Vowpal Wabbit is required.

## Get started

If you are familiar with reinforcement learning and ready to start using Vowpal Wabbit in a contextual bandit setting, please see Part Two: Vowpal Wabbit Contextual Bandits Tutorial. This section includes a Python tutorial, information for how to work with Vowpal Wabbit contextual bandits approaches, how to format data, and understand the results. 

### The contextual bandit problem

In the contextual bandit problem, a learner repeatedly observes a context, chooses an action, and observes a loss/cost/reward for the chosen action only. Contextual bandit algorithms  use additional side information (or context) to aid real world decision-making <sup>{% cite DBLP:journals/corr/AgarwalBCHLLLMO16 %} {% cite DBLP:journals/corr/abs-1003-0146 %}</sup>. They work well for choosing actions in dynamic environments where options change rapidly, and the set of available actions is limited.

## Working with contextual bandits in Vowpal Wabbit

To introduce a Vowpal Wabbit approach to the contextual bandit problem and explore the capabilities of this approach to reinforcement learning, this guide uses a hypothetical application called **APP**.

**APP** interacts with the context of a user's behavior (search history, visited pages, or geolocation) in a dynamic environment–such as a news website or a cloud controller. **APP** differs from MAB because we have some information available to the **APP**, which is the context.

**APP** performs the following functions:

* Some context **x** arrives and is observed by **APP**.
* **APP** chooses an action **a** from a set of actions **A**, i.e., **a** ∈ **A** (**A** may depend on **x**).
* Some reward **r** for the chosen **a** is observed by **APP**.

For example:

**APP** news website:
  - **Decision to optimize**: articles to display to user.
  - **Context**: user data (browsing history, location, device, time of day)
  - **Actions**: available news articles
  - **Reward**: user engagement (click or no click)

**APP** cloud controller:
  - **Decision to optimize**: the wait time before reboot of unresponsive machine.
  - **Context**: the machine hardware specs (SKU, OS, failure history, location, load).
  - **Actions**: time in minutes - {1 ,2 , ...N}
  - **Reward**: negative of the total downtime

You want  **APP** to take actions that provide the highest possible reward. In machine learning parlance, we want a **model** that tells us which action to take.

### Policy vs. model

We use the term **policy** many times in this tutorial. In reinforcement learning, the policy is roughly equivalent to **model**. In machine learning, the model means **learned function**. When someone says policy, it is more specific than model because it indicates this is a model that acts in the world.

Contexts and actions are typically represented as feature vectors in contextual bandit algorithms. For example, **APP** chooses actions by applying a policy **π** that takes a context as input and returns an action. The goal is to find a policy that maximizes the average reward over a sequence of interactions.

### Specifying the contextual bandit approach

There are multiple policy evaluation approaches available to optimize a policy. Vowpal Wabbit offers four approaches to specify a contextual bandit approach using `--cb_type`:

- **Inverse Propensity Score**<sup>{% cite doi:10.1080/01621459.1952.10483446 %}</sup>: `--cb_type ips`
- **Doubly Robust**<sup>{% cite DBLP:conf/icml/JiangL16 %} {% cite DBLP:conf/icml/DudikLL11 %}</sup>: `--cb_type dr`
- **Direct Method**: `--cb_type dm`
- **Multi Task Regression/Importance Weighted Regression**<sup>{% cite bietti2018a %} {% cite Karampatziakis:2011:OIW:3020548.3020594 %}</sup>: `--cb_type mtr`

>**Note:** The focal point of contextual bandit learning research is efficient exploration algorithms. For more details, see the [Contextual Bandit bake-off paper](https://arxiv.org/pdf/1802.04064.pdf){:target="blank"}.

### Specifying exploration algorithms

Vowpal Wabbit offers five exploration algorithms:

- **Explore-First**<sup>{% cite DBLP:journals/corr/OsbandR15 %} {%cite DBLP:journals/corr/EcklesK14 %}</sup>: `--first`
- **Epsilon-Greedy**: `--epsilon`
- **Bagging Explorer**: `--bag`
- **Online Cover**<sup>{% cite DBLP:journals/corr/AgarwalHKLLS14 %}</sup>: `--cover`
- **Softmax Explorer**<sup>{% cite DBLP:journals/corr/abs-1811-04383 %}</sup>: `--softmax` (only supported for `--cb_explore_adf`)

>**Note:** For more details on contextual bandits algorithms and Vowpal Wabbit, please refer to the [Vowpal Wabbit Github Wiki](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Contextual-Bandit-algorithms){:target="blank"}.

## Contextual bandit algorithms and input formats

There are four main components to a contextual bandit problem:

- **Context (x)**: the additional information which helps in choosing action.
- **Action (a)**: the action chosen from a set of possible actions **A**.
- **Probability (p)**: the probability of choosing **a** from **A**.
- **Cost/Reward (r)**: the reward received for action **a**.

Vowpal Wabbit provides three contextual bandits algorithms:

1. `--cb`  
  The contextual bandit module which allows you to optimize predictor based on already collected data, or contextual bandits without exploration.
2. `--cb_explore`  
  The contextual bandit learning algorithm for when the maximum number of actions is known ahead of time and semantics of actions stays the same across examples.
3. `--cb_explore_adf`  
  The contextual bandit learning algorithm for when the set of actions changes over time or you have rich information for each action. Vowpal Wabbit offers different input formats for contextual bandits.

### Input format for `--cb`

```text
--cb <number_of_actions>
```

The `--cb 4` command specifies that we want to use the contextual bandit module and our data has a total of four actions.

Each example is represented as a separate line in your data file and must follow the following format:

```text
action:cost:probability | features
```

Sample data file **train.dat** with five examples:

```text
1:2:0.4 | a c
3:0.5:0.2 | b d
4:1.2:0.5 | a b c
2:1:0.3 | b c
3:1.5:0.7 | a d
```

Use the command
```text
vw -d train.dat --cb 4
```

>**Note:** This usage is for the Vowpal Wabbit command line. See below for a Python tutorial.

### Input format for `--cb_explore`

```text
--cb_explore <number_of_actions>
```

The command `--cb_explore 4` specifies our examples explore a total of four actions.

>**Note:** This format explores the action space so you must specify which algorithm you want to use for exploration.

#### Usage

The following examples use the input format for the `--cb` command example above:

```text
vw -d train.dat --cb_explore 4 --first 2
```

 In this case, on the first two actions, you take each of the four actions with probability 1/4.

```text
vw -d train.dat --cb_explore 4 --epsilon 0.2
```

In this case, the prediction of the current learned policy takes with probability **1 - epsilon** 80% of the time, and with the remaining 20% epsilon probability, an action is chosen uniformly at random.

```text
vw -d train.dat --cb_explore 4 --bag 5
```

```text
vw -d train.dat --cb_explore 4 --cover 3
```

This algorithm is a theoretically optimal exploration algorithm. Similar to the previous bagging **m** example, different policies are trained in this case. Unlike bagging, the training of these policies is explicitly optimized to result in a diverse set of predictions—choosing all the actions which are not already learned to be bad in a given context.

For more information and research on this theoretically optimal exploration algorithm see this [paper](http://arxiv.org/abs/1402.0555).

### Input format for `--cb_explore_adf`

```text
--cb_explore_adf
```

The command `--cb_explore_adf` is different from the other two example cases because the action set changes over time (or we have rich information for each action):

- Each example now spans multiple lines, with one line per action
- For each action, we have the label information (action, cost, probability), if known.
- The action field **a** is ignored now since line numbers identify actions and typically set to the 0.
- The semantics of cost and probability are the same as before.
- Each example is also allowed to specify the label information on precisely one action.
- A new line signals end of a multiline example.

It best to create features for every (context, action) pair rather than features associated only with context and shared across all actions.

>**Note:** This format explores the action space so you must specify which algorithm you want to use for exploration.

### Shared contextual features

You can specify contextual features which share all line actions at the beginning of an example, which always has a `shared` label, as in the second multiline example below.

Since the shared line is not associated with any action, it should never contain the label information.

Sample data file **train.dat** with two examples:

```text
| a:1 b:0.5
0:0.1:0.75 | a:0.5 b:1 c:2

shared | s_1 s_2
0:1.0:0.5 | a:1 b:1 c:1
| a:0.5 b:2 c:1
```
In the first example, we have two actions, one line for each. The first line represents the first action, and it has two action dependent features **a** and **b**.

```text
| a:1 b:0.5
```

The second line represents the second action, and it has three action dependent features **a**, **b**, and **c**.

```text
0:0.1:0.75 | a:0.5 b:1 c:2
```

If the second action is the chosen action it follows the following format:

```text
action:cost:probability | features
0:0.1:0.75 |
```
Action 0 is ignored, has cost 0.1 and a probability of 0.75.

#### Usage

In the case of the softmax explorer, which uses the policy not only to predict an action but also predict a score indicating the quality of each action. The probability of action **a** creates distribution proportional to **exp(lambda * score(x, a))**.

```text
vw -d train_adf.dat --cb_explore_adf
```

```text
vw -d train.dat --cb_explore_adf --first 2
```

```text
vw -d train.dat --cb_explore_adf --epsilon 0.1
```

```text
vw -d train.dat --cb_explore_adf --bag 5
```

```text
vw -d train.dat --cb_explore_adf --softmax --lambda 10
```

Here **lambda** is a parameter, which leads to uniform exploration for **lambda = 0**, and stops exploring as **lambda** approaches infinity. In general, this provides an excellent knob for controlled exploration based on the uncertainty in the learned policy.

## Create contextual bandit data

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

Now, generate some sample training data that could originate from previous random trial (for example A/B test) for the contextual bandit to explore:

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

>**Note:** The data here is equivalent to the [VW wiki example](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Logged-Contextual-Bandit-Example){:target="blank"}.

Next, create data for the contextual bandit to exploit to make decisions (for example features describing new users):

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
```

Output:

<div class="output" markdown="1">

| index | action | cost | feature1 | feature2 | feature3 | probability |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 1 | 2 | a | c |  | 0.4 |
| 2 | 3 | 0 | b | d |  | 0.2 |
| 3 | 4 | 1 | a | b |  | 0.5 |
| 4 | 2 | 1 | a | b | c | 0.3 |
| 5 | 3 | 1 | a | d |  | 0.7 |

</div>

```python
test_df.head()
```

Output:

<div class="output" markdown="1">

| index | feature1 | feature2 | feature3 |
|:---:|:---:|:---:|:---:|
| 1 | b | c | |
| 2 | a | | b|
| 3 | b | b | |
| 4 | a | | b |

</div>

##  Contextual bandits Python tutorial

First, create the Python model store the model parameters in the Python `vw` object.

Use the following command for a contextual bandit with four possible actions:

```python
from vowpalwabbit import pyvw

vw = pyvw.vw("--cb 4")
```

>**Note:** Use `--quiet` command to turn off diagnostic information in Vowpal Wabbit.

Now, call learn for each trained example on your Vowpal Wabbit model.

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

Use the model that was just trained on the train set to perform predictions on the test set. Construct the example like before but don't include the label and pass it into **predict** instead of **learn**. For example:

```python
for j in test_df.index:
  feature1 = test_df.loc[j, "feature1"]
  feature2 = test_df.loc[j, "feature2"]
  feature3 = test_df.loc[j, "feature3"]

  test_example = "| " + str(feature1) + " " + str(feature2) + " " + str(feature3)

  choice = vw.predict(test_example)
  print(j, choice)
```

Output:
<div class="output" markdown="1">
1 3
2 3
3 3
4 3
</div>

>**Note:** The contextual bandit assigns every instance to the third action as it should per the cost structure of the train data. You can save and load the model you train from a file.

Finally, experiment with the cost structure to see that the contextual bandit updates its predictions accordingly.

```python
vw.save('cb.model')
del vw

vw = pyvw.vw("--cb 4 -i cb.model")
print(vw.predict('| a b'))
```

Output:
<div class="output" markdown="1">
3
</div>

The `-i` argument means input regressor, telling Vowpal Wabbit to load a model from that file instead of starting from scratch.

## More to explore

- Review the [example Python notebooks](https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/python/examples){:target="blank"}.
- Explore the [tutorials section of the GitHub wiki](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Tutorial#more-tutorials){:target="blank"}.
- Browse [examples on the GitHub wiki](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Examples){:target="blank"}.
- Learn various [VW commands](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Command-Line-Arguments){:target="blank"}.

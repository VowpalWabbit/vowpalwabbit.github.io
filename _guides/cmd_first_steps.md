---
title: Getting started with the command line
order: 2
module_id: cmd_getting_started
description: This tutorial runs you through the absolute basics for the command line
guide_link_text: Read the command line getting started
level: basic
layout: tutorial
tags: getting&nbsp;started command&nbsp;line
---

Now that VW is installed, let's make sure it works by passing it some data, learning something then getting a prediction. This tutorial won't go in depth, it is just a really quick introduction and you can deep dive in the later tutorials.

This scenario is predicting whether a house will need a new roof in the next 10 years.

## Data

Create a file, called `train.txt` and paste this into it:
```
0 | price:.23 sqft:.25 age:.05 2006
1 | price:.18 sqft:.15 age:.35 1976
0 | price:.53 sqft:.32 age:.87 1924
```

The format may look odd, but go with it. The [linear regression tutorial](https://vowpalwabbit.org/guides/getting_started.html#a-first-data-set) goes into more detail about what it all means.

## Train

Then train a model, and save it to a file, like so:
```sh
vw -d train.txt -f model.vw
```
This tells VW to:
- Use the **d**ata file `train.txt`
- Write the **f**inal model to `model.vw`

There will be quite a few statistics and statuses printed. Don't worry too much about what it says, the [linear regression tutorial](https://vowpalwabbit.org/guides/getting_started.html#vws-diagnostic-information) goes through it in detail if you'd like to learn about it now.

<details>
  <summary>Output for comparison</summary>

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
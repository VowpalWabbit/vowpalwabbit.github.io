---
title: Getting started with Python
order: 6
module_id: python_getting_started
description: This tutorial runs you through the absolute basics for Python
guide_link_text: Read the Python getting started
level: basic
layout: tutorial
tags: getting&nbsp;started Python
---

Now that VW is installed, let's make sure it works by passing it some data, learning something then getting a prediction. This tutorial won't go in depth, it is just a really quick introduction and you can deep dive in the later tutorials.

This scenario is predicting whether a house will need a new roof in the next 10 years.

First thing is to import the package:
```Python
from vowpalwabbit import pyvw
```

We then create an instance of VW, and pass the quiet option to avoid diagnostic information being outputted to stdout.

```Python
model = pyvw.vw(quiet=True)
```

Then we create some examples, we are going to use the VW input format and text examples, and then learn on them. To learn about the VW text format see [here](https://vowpalwabbit.org/guides/getting_started.html#a-first-data-set). It is also possible to create the example object in Python and pass it in, see docs [here](https://vowpalwabbit.org/docs/vowpal_wabbit/python/html/vowpalwabbit.pyvw.html#vowpalwabbit.pyvw.example).

```Python
train_examples = ["0 | price:.23 sqft:.25 age:.05 2006"
                  "1 | price:.18 sqft:.15 age:.35 1976"
                  "0 | price:.53 sqft:.32 age:.87 1924"]

for example in train_examples:
    model.learn(example)
```

After this we create a test example and predict on that:
```Python
test_example = "| price:.46 sqft:.4 age:.10 1924"

prediction = model.predict(test_example)
print(prediction)
```
Output:
```
0.0
```
So the model predicted a value of 0, this house wont need a new roof in the next 10 years. Well, at least according to our model learned from 3 examples...


## Next Steps

Learn more about using VW in Python in the [Contextual Bandit tutorial](https://vowpalwabbit.org/guides/contextual_bandits.html). Alternatively, get another look at the house roof problem and learn about VW's input format and output information in the [linear regression tutorial](https://vowpalwabbit.org/guides/getting_started.html)
---
title: 2020 Exercises
layout: rlos_page
body_class: rlos
permalink: rlos/2020/code_exercises.html
---

# RL Open Source Fest Application Exercises

## C++ Exercise
If your project involves C++, complete the following exercise:

1. Clone the [vowpal_wabbit repo](https://github.com/VowpalWabbit/vowpal_wabbit) and build it. Instructions can be found on the wiki [here](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Dependencies )
2. Change the output of the `--version` option to include your name and the hash of your name
3. Send the code change as a diff (use `git diff`) and the output of `vw --version` with your change

The original output looks like this:
```
8.8.0 (git commit: 96e08b3bc)
```
We're looking for something like this:
```
8.8.0 (git commit: 92aa2d713)

My name is John Smith and my hash is 5a8e90dd454acc31
```

The code for argument parsing lives in [vowpalwabbit/parse_args.cc](https://github.com/VowpalWabbit/vowpal_wabbit/blob/master/vowpalwabbit/parse_args.cc) and the hash function is called `hashall`.



## Python/Data Science Exercise
If your project involves Python or data science, complete the following exercise:

1. Follow the [Simulating Content Personalization with Contextual Bandits tutorial](https://vowpalwabbit.org/tutorials/cb_simulation.html)
2. In the [first scenario](https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/tutorials/python_Simulating_a_news_personalization_scenario_using_Contextual_Bandits.html#first-scenario) it runs the simulation with the argument `--epsilon 0.2`. Change the notebook to visualize the effect of different values of `epsilon` from **0** to **1** in **0.1** increments
3. Send the modified notebook in **HTML** (File -> Download as -> HTML). Make sure your change is evaluated

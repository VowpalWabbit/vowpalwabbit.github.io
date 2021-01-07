---
title: 2021 Exercises
layout: generic_page_with_TOC
body_class: rlos
permalink: rlos/2021/code_exercises
---

# RL Open Source Fest Application Exercises

See [here](/rlos/2020/code_exercises) for last year's exercises.

## C++ Exercise
If your project involves C++, complete the following exercise:


VowpalWabbit (VW) has an input text format allows examples to have a tag associated with each of them. A tag is a string that carries no specific meaning but can be used to identify examples later. Given this example:
```
1 foo_tag| feat_1 feat_2
```
The string `foo_tag` is the tag in the above example.

### The task
Add a command line option (`--ignore_tag <value>`) to VW that makes it ignore examples with a specific tag `value`.

To test it, use the following test file (`input.txt`):
```
0.5 foo| a c
0.5 bar| a
0.5 ignore| b
1 ignore| a b
0 | c
```

Invoking vw with `./vw input.txt --ignore_tag ignore` should give the same result as using the following input:
```
0.5 foo| a c
0.5 bar| a
0 | c
```

Submit a diff file through `git --diff` for this exercise or a link to the commit in your fork.

### Links
- [vowpal_wabbit repo](https://github.com/VowpalWabbit/vowpal_wabbit) 
- [build instructions](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Dependencies)

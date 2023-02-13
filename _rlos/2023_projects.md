---
title: 2023 Projects
layout: rlos_page
body_class: rlos
permalink: rlos/2023/projects.html
---

# RL Open Source Fest Projects

Past projects:
- [2020](/rlos/2020/projects.html)
- [2021](/rlos/2021/projects.html)
- [2022](/rlos/2022/projects.html)


## Feature Engineering in VW using LUA

**Vowpal Wabbit (VW)** is a fast, efficient, flexible, widely used, online
machine learning system used for reinforcement learning, supervised learning,
and more.

**Lua** is a powerful, efficient, lightweight, embeddable scripting language.

A large portion of work in building Real world ML models is in:
- Cleaning data
- Adjusting features and labels before learning

The goal of this project is to combine the power of both projects.  Embed Lua
into VW so that these tasks can be done without external tools.


### Project Goals

1. Add Lua to VW and print "[your name] says hello from VW Lua"
2. Pass feature data and label into Lua and print to console from Lua
3. Change features and label using Lua and print it in VW
4. Read a Lua script file from disk when VW starts up and execute the script on
   new examples
5. Presentation of project findings and accomplishments 

#### Project Stretch Goal

- Change VW prediction in Lua

### Prerequisites

- Familiarity with C++
- Basic familiarity with VW (Screening exercise 1)
- Basic familiarity with Lua (Screening exercise 2)

### Screening exercise

#### Exercise 1: Working with VW

In a branch of your fork of the [VowpalWabbit
repo](https://github.com/VowpalWabbit/vowpal_wabbit) please implement the
following:

Exercise Goals: Demonstrate the following
1. Compile VW source and generate vw executable.
2. Make minor modifications to VW and create new vw executable.
3. Demonstrate that the modifications worked as expected

Exercise Tasks:
1. Compile and run VW.
2. Add some code to print “Hello world” when VW starts.
3. Commit this to your own fork of the repo.


#### Exercise 2: Working with Lua
(Reference: [Integrating Lua in C++ -
GeeksforGeeks](https://www.geeksforgeeks.org/integrating-lua-in-cpp/))

Exercise Goals: Demonstrate the following
1. Compile Lua and include it in a simple app as shown in the Reference.
2. Pass data into Lua from the simple app and demonstrate that the data can be accessed in script.
3. Change the data passed into the Lua script and access the changed data in the simple app.

Exercise Tasks:
1. Build Lua.
2. Create Lua object in C++.  Print "[your name] says hello” from within Lua.
3. Pass an int variable to Lua and print out the value in Lua
4. Change value of an int variable in Lua and print it out in C++


#### Submit the following
1. The branch in your VW fork containing the changes from exercise 1
2. Text with output from running VW in exercise 1
3. All files created by you for exercise 2
4. Instructions for building and running your project for exercise 2
5. Text with output from exercise 2

## Feature generation using transformers 

Feature engineering is of importance in the real world for the sequence decision
making, such as how to use historical shopping data to do item recommendations.
Transformer, a deep-learning architecture, has been studied extensively in
sequential language models and is able to deal with massive data. It would be
interesting to leverage Transformer to generate useful features for the sequence
decision making.

### Goals

1. Explore the scenarios where Transformer can be useful for feature generation
2. Conduct simulations to compare the Transformer-generated features with the
   raw features for online decision making in VowpalWabbit (VW)


### Stretch goals

1. Apply the Transformer-generated features to off-policy evaluation


### Deliverables

1. Python code and documentation on the experiments of different scenarios
2. Presentation of the findings


### Prerequisites

- Comfortable with writing Python
- Basic understanding of VW, reinforcement learning, contextual bandits, and
  transformers


### Screening exercise

When submitting your application please also complete the following exercise.

Write a Jupyter Notebook to conducting a small task with a transformer and
explain what you are trying to solve.

(Please check the installation, examples, and tutorial if needed:
https://huggingface.co/docs/transformers/index)


## Testing infrastructure for VowpalWabbit

VowpalWabbit is open source machine learning toolkit covering multiple
techniques (supervised learning, active learning, contextual bandits learning,
etc). It is widely used in both academic research and production systems, so
there are strong requirements to its quality and there is a room for improvement
in existing testing infrastructure.

### Goals

1. Come up with proposal of testing framework which can help to:
2. Write interpretable tests following TDD paradigm during further development.
3. Assert certain domain specific invariants (convergence, inequalities, etc)
  instead of naive diffs of outputs
4. Test subfamilies of algorithms (i.e. “test certain property of every
  exploration algorithm”)
5. Incorporate data simulators to make tests on a certain classes of datasets

### Stretch goals

1. Make new tests available in CI

### Deliverables

1. One or more pull requests making new framework available
2. New test cases using new framework
3. More bugs discovered with new test cases

### Prerequisites

- Basic understanding of machine learning problems and methods
- Familiarity with Python and scripting languages

### Screening exercise:

Let’s say we have just implemented a new training algorithm for regression with
the following interface:

```python
class NewTrainer:
    ...
    def train(self, x: List[List[float]], y: List[float]):
        ...

    def predict(self, x: List[float]) -> float:
        ...
        return 0
```

Design and write test suite for it in Python using `unittest` or `pytest`
frameworks.

## In-Database Machine Learning

In many real-world applications, various forms of data are already managed and
stored in database management systems. For inference and training tasks, people
usually export these data from databases and feed them into machine learning
engines, which often incurs overhead of data transformation and redundant
storage. In scenarios such as federated learning, extra care must be taken due
to privacy and security reasons when moving sensitive data around.

In this project, the goal is to investigate whether we can bring machine
learning closer to the data source, and to create the convenience of in-database
inference and training. We will integrate machine learning capabilities into a
database engine and build a prototype that facilitates machine learning tasks
through a familiar sql interface.

### Goals

1. Design the user interface for machine learning tasks in databases
2. Integrate a database engine such as SQLite with a machine learning library
   such as VW

### Stretch goals

1. Investigate and improve the performance of the prototype
2. Extend to federated learning settings

### Deliverables

1. A prototype that can run machine learning tasks inside a database
2. Code repo and documentation on the usage of this prototype

### Prerequisites

- Comfortable writing code in C++ and Python
- Good understanding of machine learning and/or database is a big plus

### Screening exercises

When submitting your application, please answer the following questions in a
paragraph or two:

1. Take a look at the [sqlite udf interface](https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection.create_function)
   and explain how it could be used to support calling into machine learning
   libraries. It’d be great if you could demonstrate with some code snippets.
2. Links to past coding project in C++

## Simulator and Data Generation Tool

A major issue that any machine learning library will face is having easy access
to relevant and well-formatted datasets. With its diverse set of input types and
formats, and unique problem setting, Vowpal Wabbit (VW) is certainly not immune
from this problem. Access to such datasets would have countless benefits for the
library, such as making statistical testing simpler and more robust, helping
newcomers onboard, and allowing experienced users to expand the breadth of their
use in a non-intimidating way. The goal of this project is to implement a
flexible tool within VW to generate datasets for various problem-settings, in
multiple formats, with configurable statistical properties. Ideally this feature
could act as a library within C++/Python as well as a standalone command line
tool.

### Goals

1. Implement a standalone command line tool to generate well-formatted VW datasets
2. Expose functionality as a library which can be called in both C++ and Python
3. Provide documentation and tutorials on how to use the tool and its various
options

### Stretch goals

4. Add functionality for newer problem settings such as CCB, CATS, and Slates
5. Analyze and update current test files to enhance coverage and seek edge cases

### Deliverables

1. One or multiple pull requests which implement above goals
2. Documentation on what is supported and how to use it
3. Test suite verifying correctness

### Prerequisites

- Comfortable writing C++
- Basic understanding of VW, reinforcement learning, and
contextual bandits

### Screening exercise

When submitting your application please also complete the following exercise.

Clone the [VW repo](https://github.com/VowpalWabbit/vowpal_wabbit/) and build
the entire project (including unit tests). The following executable should be in
your build directory: `build/vowpalwabbit/core/vw_core_test`.

Please run the `CppSimulatorWithoutInteraction` test using
```sh
build/vowpalwabbit/core/vw_core_test --gtest_filter=Tutorial.CppSimulatorWithoutInteraction
```

This test makes use of our [current simulator](https://github.com/VowpalWabbit/vowpal_wabbit/blob/master/vowpalwabbit/core/tests/simulator.cc)
to run a basic command. Please create some new feature in our current simulator,
and add a new test to `vowpalwabbit/core/tests/tutorial_test.cc` that makes use
of it. This feature can be anything from accepting conditional contextual bandit
(CCB) or some other data format, outputting the simulated data to a file, adding
functionality to generate rewards according to a more complex distribution, or
whatever you find most interesting.

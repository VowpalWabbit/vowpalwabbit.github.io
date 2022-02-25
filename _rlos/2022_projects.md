---
title: 2022 Projects
layout: rlos_page
body_class: rlos
permalink: rlos/2022/projects.html
---

# RL Open Source Fest Projects

Past projects:
- [2020](/rlos/2020/projects.html)
- [2021]((/rlos/2021/projects.html)

## Automl Extensions

[Automl](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Automl) is a new algorithm in VW based on the [ChaCha](https://arxiv.org/pdf/2106.04815.pdf) algorithm, which aims to provide users with a hands-off method to get an optimal learning configuration without prior experience using VW or an in-depth understanding of their dataset. A "configuration" is a general term which can be extended to any aspect of VW (enabled reduction, # of passes, etc…) but as of now a configuration will specify the set of namespace interactions used in a contextual bandit problem. More specifically, a configuration specifies a set of interactions which will be excluded from the default configuration.


This project aims to add a few extensions to Automl such as handling cubic namespace interactions (as opposed to only quadratic which is the case now), implementing a configuration which drops namespaces, and organizing / optimizing how configurations are stored, added, and removed.

### Goals

- Extend Automl to implement a configuration which drops namespace
- Design a mechanism and extend Automl to add and drop cubic interactions

### Stretch goals

- Organize the set of configs more cleanly. Ensure no configs are repeated

- Ramp up statistical testing, try different exploration algorithms

### Deliverables

- One or multiple pull requests which implement various extensions to Automl
- Documentation on what is supported and how to use it
- Test suite verifying correctness

### Prerequisites

- Comfortable writing C++
- Basic understanding of VW, reinforcement learning, and the goal of Automl
- Good understanding of algorithmic techniques, designing new algorithms, and understanding space and time complexity

### Screening exercise

When submitting your application please also answer the following question. Clone the [VW repo](https://github.com/VowpalWabbit/vowpal_wabbit/) and build the entire project (including unit tests). The following executable should be in your build directory `vowpal_wabbit/build/test/unit_test/vw-unit-test.out`. Please run the automl_first_champ_switch test using `vowpal_wabbit/build/test/unit_test/vw-unit-test.out -t automl_first_champ_switch`. This test deterministically finds that the champion first changes at example 161 when running automl through a simulator with specific conditions. Please update the random seed in the simulator for this test from 10 to 11 (on line 80 in `vowpal_wabbit/test/unit_test/automl_test.cc`). At what example does the first change of champion occur with this new seed? Please explain your process and how you arrived at your answer.

## Compiler Optimizations using Reinforcement Learning

Compilers translate programs written by humans into executable binaries. To generate optimized binaries, experts use heuristics inside compilers and spend tons of time tuning the compiler knobs. However, instead of training humans to become compiler experts, can we train machines to learn how to optimize code by themselves?

In this project, we will work together to try applying reinforcement learning to compiler optimizations in the context of [CompilerGym](https://ai.facebook.com/blog/compilergym-making-compiler-optimizations-accessible-to-all). Built on OpenAI Gym, this gym environment provides interfaces, datasets, tools, and leaderboards for a range of compiler optimization tasks over LLVM and GCC. We will develop RL agents using VowpalWabbit and experiment with different algorithms and optimization tasks.

### Goals

- Implement VW agents for CompilerGym
- Experiment with some compiler optimization tasks

### Stretch goals

- Feature engineering over computer programs
- Experiment with other machine learning techniques

### Deliverables

- A repository which integrates the gym environment with implemented agents
- A report on the approaches and experimental results

### Prerequisites

- Comfortable writing code in Python or C++
- Good understanding of compilers and/or machine learning is a big plus

### Screening exercises

When submitting your application, please answer the following questions in a paragraph or two:

1. What compiler optimization tasks do you want to tackle and why?
2. Links to past coding project in Python or C++.

## Testing infrastructure for VowpalWabbit

VowpalWabbit is open source machine learning toolkit covering multiple techniques (supervised learning, active learning, contextual bandits learning, etc). It is widely used in both academic research and production systems, so there are strong requirements to its quality and there is a room for improvement in existing testing infrastructure.

### Goals

- Come up with proposal of testing framework which can help to:
- Write interpretable tests following TDD paradigm during further development.
- Assert certain domain specific invariants (convergence, inequalities, etc) instead of naive diffs of outputs
- Test subfamilies of algorithms (i.e. “test certain property of every exploration algorithm”)
- Incorporate data simulators to make tests on a certain classes of datasets

### Stretch goals

- Make new tests available in CI

### Deliverables

- One or more pull requests making new framework available
- New test cases using new framework
- More bugs discovered with new test cases

### Prerequisites

- Basic understanding of machine learning problems and methods

- Familiarity with Python and scripting languages

### Screening exercise:

Let’s say we have just implemented a new training algorithm for regression with the following interface:

```python
class NewTrainer:
    ...
    def train(self, x: List[List[float]], y: List[float]):
        ...

    def predict(self, x: List[float]) -> float:
        ...
        return 0
```

Design and write test suite for it in Python using `unittest` or `pytest` frameworks.


## Native CSV parsing

VowpalWabbit (VW) supports several input formats, the main one being a custom text format described [here](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Input-format). Data is commonly formatted in CSV or TSV files and converters have been written which convert these files to VW text format. Such as [this one](https://github.com/VowpalWabbit/vowpal_wabbit/blob/master/utl/csv2vw). It would be convenient if VW were to be able to natively understand CSV files. There is a surprising amount of complexity in the design of implementing a generalized parser for CSV so this project will be as much about considering all of the design pieces as implementing a working parser.

### Goals
- Understand the extent of what can be expressed in the VW input format
- Decide on the scope of the CSV parser
- Design the configurable portions and option surface of the parser

### Stretch goals
- Design what a multiline (a more complex example where one atomic input to VW  has two dimensions) compatible parser may look like
- Design how namespaces may be expressed in a CSV datafile

### Deliverables
- A repository which implements a custom VW binary which supports CSV parsing
- Documentation on what is supported and how to use it
- Test suite verifying correctness

### Prerequisites
- Comfortable writing C++
- Comfortable using CMake
- Comfortable investigating requirements and designing before coding
- Basic understanding of VW

### Screening exercise
When submitting your application please also complete this exercise. Implement the changes specified in a branch of a fork of the [VowpalWabbit repo](https://github.com/VowpalWabbit/vowpal_wabbit). Learn more about the input format [here]().

1. Edit the [VW text parser](https://github.com/VowpalWabbit/vowpal_wabbit/blob/master/vowpalwabbit/parse_example.cc)
    - Print info after each line of input is parsed:
        -  The name of each namespace seen
            -  How many features were in that namespace
    -  Provide a summary of the total number of times each namespace was seen during parsing

#### Examples

For example the input data file:
```
|ns0 a b c |ns1 a |ns2 d e |ns0 x y z
```

Should print:
```
Example: ns0: 6, ns1: 1, ns2: 2
---
Total counts: ns0: 2, ns1: 1, ns2: 1
```

For example the input data file:
```
|a a |b b |c c
|b a |b b
|c a |a a
```

Should print:
```
Example: a: 1, b: 1, c: 2
Example: b: 2
Example: a: 1, c: 1
---
Total counts: a: 2, b: 3, c: 2
```

## Improve flatbuffer parser support in VowpalWabbit
The goal is to improve on current [flatbuffer](https://google.github.io/flatbuffers/) format. The suggested changes should result in smaller files.

### Goals and milestones
1. Compile VW in either Linux or Windows. (Report major pain points)
2. Change the flatbuffer schema to be column based instead of row based
3. Measure (before and after) serialized size and performance.
4. Change experimental status
5. Present results

### Prerequisites
- Familiarity with C++
- Familiarity with Flatbuffers

### Screening exercise

1. Create a simple flatbuffer schema file. It should be a table with 3 fields:
    - `a_name` – `string`
    - `a_value` – `float`
    - `a_flag` - `bool`
2. Create a C++ command line application that writes data to a file using the flatbuffer schema.
3. Create a C++ command line application that reads the file from previous step and writes the contents to `stdout`.

Submit:
- Axll project files
- Build instructions
- Output from the last step

## Introduce Feature Engineering Language in VowpalWabbit

### Goals

- Get started building VW and associated tooling
- Implement a feature engineering language capable of being a super-set of current polynomial interactions
    - Possible intermediate step: Feature engineering language as a tool to transform an existing dataset
    - Important to support (syntax not final):
        - Namespace interactions into implicit namespaces (as `-q`, etc. work)
        - Namespace interactions into explicit namespaces
        - Removing a namespace (`--ignore`)
        - Individual features are addressable and editable
- Add feature engineering reduction – operating in place (stretch goal = in tandem with) normal interaction generation


### Stretch Goals

- Simple functions and elementwise arithmetic
    - `MyNewNamespace = NamespaceA + sin(NamespaceB)`


### Extra stretch goals
- Mechanisms to interpret namespaces as specific types (Image, etc.) and type-specific functions
- Mechanisms to address multi_ex and do example-level edits


### Prerequisites

- Familiarity and confidence with C++ (see below)
- Knowledge of parser implementation and language grammar construction a plus


### Screening exercise

Part 1: Given an "expression" language, supporting queries consisting of variables (identifier literals, e.g. `myLiteral22`), values (float literals, e.g. `2.14728e7`), and operators:

* Parentheses: `( sub-expression )`
* Comparison (<, >, ==, !=): `expression1 < expression2`
* Logical (||, &&): `expression1 || expression2`

Implement a function `eval(std::string expr, std::map<std::string, float> vars)` that, given a string containing an expression in this language and the variable values, evaluates the expression, and prints the result, or reports an error. Comparison operators have precedence and bind tighter than logical operators, and associativity in all cases is left-to-right, similarly to the same operators in C++. Assume all referenced variables are always present in the input.

For example, for a set of variables with values:

| Variable     | Value |
|:------------ |:-----:|
| sepal_length |  4.9  |
| sepal_width  |  3.0  |
| petal_length |  1.4  |
| petal_width  |  0.2  |


* `sepal_length < 3`

  should print

  `false`

* `sepal_width > 2`

  should print

  `true`

* `sepal_length < 3 || sepal_width > 2`

  should print

  `true`

* `(sepal_length < 3) == (sepal_width > 2)`

  should print

  `false`

* `sepal_length && sepal_width`

  should print

  `Error in expression: 'sepal_length && sepal_width': cannot apply operator && to expressions of types (float, float)`

* `sepal_length < sepal_width == sepal_width`

  should print

  `Error in expression: 'sepal_length < sepal_width == sepal_width': cannot apply operator == to expressions of types (boolean, float)`

Part 2: Given a "database" with rows consisting of a set of key-value pairs:

```cpp
struct DataRow
{
  std::map<std::string, float> Fields;
};

typedef std::vector<DataRow> DataTable;
```

Implement a function `DataTable select(std::string query, const DataTable& table)` that, given a query in the "expression" language above and a `DataTable`, returns the rows that match the query.

Part 3: What kinds of optimizations could you make to your implementation of the `select()` function above? Describe them, but do not implement.
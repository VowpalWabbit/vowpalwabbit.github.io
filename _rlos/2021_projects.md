---
title: 2021 Projects
layout: rlos_page
body_class: rlos
permalink: rlos/2021/projects.html
---

# RL Open Source Fest Projects

See [here](/rlos/2020/projects.html) for last year's projects.

## 1. Raspberry Wabbit
Recent Raspberry Pi boards are more than powerful enough to run VW for online RL learning on device. However, ssome infrastructure work would facilitate mass adoption. This project would perform this infrastructure work and provide a demo application.

### Goals
- Support for audio and video featurization for VW
  - Support at least one audio and one video device
  - Support NPU featurization
- Virtual kit
  - Docker container and boot image containing all code ready to go
  - Links to buy all associated hardware
  - Nicely documented hello world instructions

### Stretch goals
- Canonical closed-loop application
  - Support for actions, GPIO or networked actuator
  - Support for feedback, e.g., GPIO or networked sensor, Fitbit, etc

## 2. Python support for variable and model introspection
Understanding how model variables influence predictions helps both troubleshooting and gaining insights into ones dataset. This project aims at bringing those capabilities to VW's Python API.

### Goals
- Understand functionality of vw-varinfo2 (Python implementation)
- Figure out why 2 passes are needed, figure out exact dependency on audit mode
  - Re-implement vw-varinfo2 using pyvw api, instead of using vw as a subprocess
  - Propose and implement a proper api inside pyvw api, no more separate script
- Deliver easy to use experience
  - Easy to use api to the end user (as in the user does not have to be guessing which args to use)
  - Suggestion: Jupyter notebook widgets to inspect individual variables and the whole model

### Stretch goals
- Augment Jupyter notebook experience for pyvw (easy stretch goal, could be also used as an intro to pyvw)
- Multiclass/CB support
- Figure out if some functionality can be implemented below Python api, augment cpp implementation (i.e. surface info obtained from audit mode in a more direct way rather than depending on audit mode)
- Weights for interaction related features

### Links
- https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Using-vw-varinfo
- https://github.com/arielf/weight-loss/blob/master/vw-varinfo2


## 3. Add extensive benchmarks to VW
VW has an experimental benchmarking solution but since it is a project where performance is central, having more extensive coverage is important.
The benchmarks will run on every code change and help contributors assess their immediate impact and long term trends.

### Goals
- Implement micro and end-to-end benchmarks for VW
  - Focus on latency performance but could also consider throughput
- Add developer tools to debug performance issues (e.g. flamegraph visualizations, git bisect scripts)
- Setup CI pipeline(s) to run the benchmarks

### Stretch goals
- Track and visualize long term performance trends
- Ability to compare all tests between VW versions/releases
- Ability to run the same VW benchmark on different libraries and compare

### Links
- [Current experimental benchmark yml file](https://github.com/VowpalWabbit/vowpal_wabbit/blob/master/.github/workflows/run_benchmarks.yml)
- [Current experimental benchmark pipeline](https://github.com/VowpalWabbit/vowpal_wabbit/actions?query=workflow%3A%22Run+Benchmarks%22)
- [current experimental benchmark code](https://github.com/VowpalWabbit/vowpal_wabbit/tree/master/test/benchmarks)
- [Framework used by arewefastyer.com](https://wiki.mozilla.org/EngineeringProductivity/Projects/Perfherder)


## 4. Tensorboard and Tensorwatch Integration
Integrate VW and RLClientLib(rl_sim) with Tensorboard and TensorWatch.
It would allow VW training to be overseen using TensorBoard / TensorWatch visualizations.

### Goals
- Integrate VW training with TensorWatch within a Jupyter notebook.
- Extend VW to output TensorBoard logs.
- Extend RLClientLib(rl_sim) to support TensorBoard and TensorWatch in the same way.

### Stretch Goals
- Support distribution, what-if and hyperparam tunning features of TensorBoard

### Links
- https://github.com/Microsoft/tensorwatch
- https://www.tensorflow.org/tensorboard

## 5. VW Server mode revamp
VW's current model serving uses an old-school daemon that is quite limited.
We want to modernize it and convert into a service using GRPC and a richer set of features.

### Goals
- Single model serving using GRPC with the following endpoints:
  - Predict
  - Learn
  - Statistics (number of features, current loss, etc)
  - Management (download current model, number of features)
- Wiki page describing how to use it

### Stretch goals
- Persistent model storage
- Multiple models from a single daemon
- Packaging tools with VW params and model

### Links
 - [GRPC](https://grpc.io/)

## 6. End-to-load local training loop for reinforcement learning
Our reinforcement-learning library currently doesn't offer an end-to-end local experience and requires some networked services for it.
Add a mode that works entirely local would be a great tool for learning and prototyping.

### Goals
- In-memory joining and training
- Extend configuration to enable local mode
- Python and C# API support

### Stretch Goals
- Checkpointing, load/save model
- Port some of our VW simulators to use it

## 7. Contextual Bandits Estimators in Python
All of VW's estimators used by contextual bandits are implemented in C++. This makes it a lot harder to work on new ones.
The goal of this project is allow them to be implemented in Python.

### Goals
- Add hooks for Python cb_type estimator
- Covert current IPS estimator to Python.

### Stretch Goals
- Integrate this with VW's estimators library

### Links
- https://github.com/VowpalWabbit/vowpal_wabbit/wiki/What-is-a-learner%3F
- https://github.com/VowpalWabbit/vowpal_wabbit/wiki/VW-Reductions-Workflows

# 8. Extensibility improvements to RLClientLib
VW's RL client library currently has most of its extension points available only thought the C++ API.
This limits a lot of what can be done by our users. Making those extension points available in Python and/or C# would make the library significantly more useful for our users.

### Goals
- The i_model extension point for inference.
- Create an example of using it to expose a sklearn model.

### Stretch Goals
- The i_transport extension point for log shipping
- The i_model_downloader extension point for model managament

### Links
- github.com/vowpalwabbit/reinforcement_learning

## 9. Sample Data Generator Library
A library of functions that can simplify generating sample data in all of VW's input formats (text, json, fb) and problem types (regression, classification, CB, etc)

### Goals
- A specification of the distribution of examples (e.g. number of features, feature types, feature sizes, string lengths, number of adf/ldf examples per multi_ex, action cadinality, etc)
- A specification of the number of examples
- Text / JSON / FlatBuffer support

### Stretch goals
- Bindability/x-lang (use from multiple languages)
- Multiple ways of input (command line, API, input file)

## 10. Implement and evaluate stream join algorithms
Large scale deployments of RL require doing a distributed data join of decisions and rewards.
It's not a simple problem as, in the real world, there could be a significant delay (days or weeks) between the decision and the reward.
This project aims to investigate and design alternatives and prototype them.

### Goals
- Investigate system alternatives and algorithms for stream join
- Design and implement a stream joiner prototype
- Evaluate performance and compare with naïve, in-memory, solutions.

### Stretch goals
- Cloud prototype

## 11. RLClientLib dataflow benchmarks
Key features of RLClientLib are:
- Maximize throughput
- Minimize latency of inference calls

But so far we are not measuring it in any standardized way (and it is not trivial to do since numbers depend a lot on multiple factors like number of threads, payload size, network condition etc).
We have some pieces such as (reinforcement_learning/test_tools/sender_test)[https://github.com/VowpalWabbit/reinforcement_learning/tree/master/test_tools/sender_test]
and (reinforcement_learning/examples/test_cpp)[https://github.com/VowpalWabbit/reinforcement_learning/tree/master/examples/test_cpp] which we are using from time to time for some ad-hoc testing, but arranging it into some unified benchmarking suite which we can run regularly and track progress/regression.

### Goals
- Design latency and throughput benchmarks for client library
- Setup CI pipeline(s) to run the benchmarks

## 12. RLClientLib / End to end learning benchmarks
There is a theoretical understanding of the learning performance of using VW directly. But in the real world, there are extra factors such as scheduled model updates that affect observed performance. We have no notion of end-to-end learning performance and no way to get any quantitative benchmarks of that kind. This project wants to identify and quantify the impact of those factors.

### Goals
- Improve the end to end RLClientLib ecosystem so we can evaluate the impact of each of those factors

### Outcomes
- Changes to RLClientLib and VW to allow for closer to real world evaluation
- An understanding of the impact of those factors

### Risks
This is an advanced project that will require the student to understand quite a bit of RL.

### Links
- [VowpalWabbit](https://github.com/VowpalWabbit/vowpal_wabbit)
- [RLClientLib](https://github.com/VowpalWabbit/reinforcement_learning)

## 13. Integrate estimator library into Azure Machine Learning (AML) pipeline

The current AML pipeline only produces the average loss from VW, for counterfactual evaluation, we'd like to add the data aggregation step into the pipeline.

### Goals:
- Support counterfactual evaluation using different estimators.

### Stretch goals:
- Visualize the results in Python

### Outcomes:
- Package and release the estimator lib
- Design the counterfactual evaluation log format which supports different estimators
- Add aggregation step in AML pipeline

### Links:
- https://github.com/VowpalWabbit/data-science/tree/master/from_mwt_ds/DataScience/VwPipeline
- https://github.com/VowpalWabbit/estimators

## 14. Extend FairLearn to include RL bias analysis using VW
Most RL algorithms focus on "how can a policy maximize rewards?". But what if higher rewards on average are obtained at the expense of rewards reduced for a sub-population? With AI and specifically VW being used extensively for personalization, good tools to identify and understand biases will have positive societal impact in use of RL.

This project will create an analysis script & code that takes sensitive variables(features) into account in counterfactual evaluations to help discover and possibly mitigate biased rewards. The project outcomes will make it into FairLearn, a broadly used open source toolkit for Bias & Fairness that is used in industry. You will interact with researchers, AI ethics experts, industry engineers and PMs to onramp on the concepts & tools and get guidance when you want to.

### Goals:
- Create code that runs counterfactual analysis of VW data logs, splitting analysis by cohorts defined by sensitive variables, and producing useful output conclusions and report. This can build starting from existing open source analysis scripts.
- Contribute the code and scripts and your work into FairLearn, with some basic how-to documentation for others to run it. This may include a synthetic demo dataset to showcase examples.
- Document what you have learned along the way about reinforcement learning and bias & fairness topics, and co-author a blog post with sponsors/experts.
Mentor: Rodrigo

### Stretch Goals:
- Discuss & document pros/cons and tradeoffs, if any, of using different reward estimators in this type of analysis
- Discuss concepts such as Atkinson Index and Simpsons Paradox to identify sources of inequality, including them in the analysis
- Invent wireframes for visualizations that make biased rewards clear to users, (and optionally code them in the tools)
- Come up with a conceptual definition of "robustly better policy" and "do no harm" that applies to VW/ CB policies, considering sensitive variables in the definition.

### Outcomes:
- FairLearn includes VW-based counterfactual analysis of rewards considering sensitive features,
- A co-authored blog post

### Links:
- [FairLearn](https://fairlearn.github.io/)

## 15. Reproducible and programmable feature engineering reduction
Reliable feature engineering across training and inference is a common source of bug in real world RL systems.
By making more programable feature engineering available to VW users, we save them from having this sort of issues
plus it makes for much simpler experimentation as train files don't need to be modified.

### Goals:
- Enable programmatic feature engineering to be done using CEL (Google's Common Expression Language).
- Those expressions can be saved in the model, making them transparently available during inference.
- Add a bunch of built-in functions to enable common feature engineering tasks such as interaction, binning and normalization.

### Outcomes:
- Contributions to VW that allow CEL to be used for feature engineering.

## 16. VW Parallel parsing improvements
Example parsing is an expensive part of VW training pipeline. Support for parallel parsing of text input was contributed last year, but it doesn't support the more efficient cache format.

### Goals
- Design and implement an extension to the cache file format to support efficient parallel parsing

### Outcomes
- Ability to utilize mutlicore machines more effectively when training with cache format

## 17. RL-based query planner for open-source SQL engine
Query planning with Reinforcement Learning in an active area of research and we want to enable VW to be used for it by embedding VW into a popular open source SQL engine.

### Goals
- Modify an open source engine (SQLite, MySQL or PostgreSQL) to use RLClientLib for some of the query query planning decisions.
- Enable offline experimentation by producing a large body of exploratory data against well-established benchmarks.

### Outcomes
A modified SQL engine that would enable further research on RL and Query Planning.

## 18.  VW port to WebAssembly and JavaScript API
Javascript is the most popular programing language in the world and yet it's not possible to use VW from it. WebAssembly allows running C/C++ code in the browser and is the right vehicle to bring VW there.

### Goals
The MSR team started a WebAssembly port of VW but never went beyond a prototype.
- Wrap up and merge those changes.
- Design and implement a JavaScript-centric API

### Stretch Goals:
- NPM package
- Ensure it works on non-browser environments such as node and vscode

### Outcome:
- First class support for VW from JavaScript

## 19. Support creating a reduction in Rust
A recent area of exploration we have been working on in supporting reductions implemented in languages other than C++. Rust would integrate well with C++ and VW and as such we would like it to become well supported in the ecosystem. Initial work for Rust+VW has been started here, but more work in needed on the C API and the Rust bindings consuming it.

### Goals
- Flesh out required functions in the new C API to facilitate required functionality
- Simple reduction implemented in Rust

### Stretch Goals
- NPM package.
- Support dynamic loading of the reduction

### Outcome
- Ability to define and run a reduction implemented in Rust

### Links
- https://github.com/jackgerrits/vowpalwabbit-sys-rs
- https://github.com/jackgerrits/vowpalwabbit-rs

## 20. AutoML for online learning
Hyperparameter tuning is widely used in machine learning when trying to find the optimal learning algorithm. This is usually achieved via hyperparameter sweeping and is often performed manually, while requires enough knowledge and understanding of the data and the learning algorithm at hand.

This project will focus on implementing AutoML techniques for online training in VW, focusing on the area of hyperparameter tuning.

### Goals
- Implement AutoML techniques
- Provide visualizations (or other appropriate output) that demonstrates the parameter tuning and how the model learns to perform better/worse as the parameters are tuned

### Outcomes
- PR against the vowpalwabbit repo
- wiki-page describing how to achieve auto parameter tuning

### Links
- https://www.automl.org/

## 21. Federated Residual Learning Prototype
Traditional Machine Learning requires clients to share data with a central service, which learns joint models across all clients. This results in the need for large joint models to faithfully capture all clients’ data, with large memory and inference time needs, as well as is undesirable from a privacy perspective. Simply learning local models on the clients, which preserves privacy, is also typically undesirable as each client sees only a small volume of data. The paper https://arxiv.org/abs/2003.12880 outlines a Federated Learning approach which blends local personalized models with global joint models, and achieves higher performance than purely joint or local learning approaches. This project aims to implement the algorithms laid out in the paper using VW and evaluating them at scale.

### Goals
- Client and server implementations of FedRes, as well as other popular Federated Learning algorithms.
- Study its performance using a diverse collection of datasets.

## 22. Safe Contextual Bandits
Contextual Bandit algorithms are commonly designed to maximize the expected reward over time which is the right choice in scenarios where the only cost of choosing the worst arm is increased regret. In systems settings where there's an SLA or safety constraint, avoiding bad actions is as important as learning the optimal one.
 
The goal of this project is to address those scenarios by developing a CB algorithm that takes a constraint signal together with the reward signal and trains a policy that maximizes reward subject to the probability of violating the constraint signal.
---
title: 2021 Projects
layout: rlos_page
body_class: rlos
permalink: rlos/2021/projects
---

# RL Open Source Fest Projects

See [here](/rlos/2020/projects) for last year's projects.

## 1. Raspberry Wabbit 
Recent Raspberry Pi boards are more than powerful enough to run VW for online RL learning on device.
However some infrastructure work would facilitate mass adoption.
This project would perform this infrastructure work and provide a demo application.

### Goals 
- support for audio and video featurization for VW.
  - support at least one audio and one video device.
  - support NPU featurization.
- virtual kit
  - docker container and boot image containing all code ready to go.
  - links to buy all associated hardware.
  - nicely documented hello world instructions.
 
### Stretch goals
- canonical closed-loop application
  - support for actions, GPIO or networked actuator
  - support for feedback, e.g., GPIO or networked sensor, fitbit, etc.


## 2. Python support for Variable and model introspection
Understanding how model variables influence predictions helps both troubleshooting and gaining insights into ones dataset.
This project aims at bringing those capabilities to VW's python API.

### Goals
- understand functionality of vw-varinfo2 (python implementation)
- figure out why 2 passes are needed, figure out exact dependency on audit mode
  - re-implement vw-varinfo2 using pyvw api, instead of using vw as a subprocess
  - propose and implement a proper api inside pyvw api, no more separate script
- deliver easy to use experience (this goal is unclear)
  - easy to use api to the end user (as in the user does not have to be guessing which args to use)
  - suggestion: jupyter notebook widgets to inspect individual variables and the whole model. 

### Stretch goals
- augment jupyter notebook experience for pyvw (easy stretch goal, could be also used as an intro to pyvw)
- multiclass/CB support
- figure out if some functionality can be implemented below python api, augment cpp implementation (i.e. surface info obtained from audit mode in a more direct way rather than depending on audit mode)
- weights for interaction related features

### Links
- https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Using-vw-varinfo
- https://github.com/arielf/weight-loss/blob/master/vw-varinfo2


## 3. Add extensive benchmarks to VW
VW has an experimental benchmarking solution but since it is a project where performance is central, having more extensive coverage is important.
The benchmarks will run on every code change and help contributors assess their immediate impact and long term trends.

### Goals
- Implement micro and end-to-end benchmarks for VW
  - focus on latency performance but could also consider throughput
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
Integrate VW and rlclientlib(rl_sim) with Tensorboard and TensorWatch. 
It would allow VW training to be overseen using TensorBoard / TensorWatch visualizations.

### Goals
- Integrate VW training with tensorwatch within a jupyter notebook.
- Extend VW to output tensorboard logs.
- Extend rlclientlib(rl_sim) to support tensorboard and tensorwatch in the same way.

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
- Wiki page describing how to use it.

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

## 7. Contextual Bandits Estimators in python
All of VW's estimators used by contextual bandits are implemented in C++. This makes it a lot harder to work on new ones.
The goal of this project is allow them to be implemented in python.

### Goals
- Add hooks for Python cb_type estimator
- Covert current IPS estimator to python.

### Stretch Goals
- Integrate this with VW's estimators library.

### Links
- https://github.com/VowpalWabbit/vowpal_wabbit/wiki/What-is-a-learner%3F
- https://github.com/VowpalWabbit/vowpal_wabbit/wiki/VW-Reductions-Workflows


# 8. Extensibility improvements to rlclientlib 
VW's RL client library currently has most of its extension points available only thought the C++ API.
This limits a lot of what can be done by our users. Making those extension points available in python and/or C# would make the library significantly more useful for our users.

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

## 11. Rlclientlib dataflow benchmarks
Key features of rlcientlibrary are:
- Maximize throughput 
- Minimize latency of inference calls

But so far we are not measuring it in any standardized way (and it is not trivial to do since numbers depend a lot on multiple factors like number of threads, payload size, network condition etc).
We have some pieces such as (reinforcement_learning/test_tools/sender_test)[https://github.com/VowpalWabbit/reinforcement_learning/tree/master/test_tools/sender_test]
and (reinforcement_learning/examples/test_cpp)[https://github.com/VowpalWabbit/reinforcement_learning/tree/master/examples/test_cpp] which we are using from time to time for some ad-hoc testing, but arranging it into some unified benchmarking suite which we can run regularly and track progress/regression.

### Goals
- design latency and throughput benchmarks for client library
- setup CI pipeline(s) to run the benchmarks



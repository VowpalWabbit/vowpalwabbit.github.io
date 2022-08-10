---
title: "VowpalWabbit 9.3.0 Release Notes"
layout: blog
tags: Release&nbsp;notes
description: Experimental model merging and bug fixes
author: Jack Gerrits
avatar_link: https://avatars1.githubusercontent.com/u/7558482?s=400&u=21e4cca683799d65a20a4cf3d11d0c17853ef9cb&v=4
---

<div class="blog_highlight" markdown="1">
- [GitHub release](https://github.com/VowpalWabbit/vowpal_wabbit/releases/tag/9.3.0)
- [PyPi](https://pypi.org/project/vowpalwabbit/)
</div>

[Experimental](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/experimental) support has been added for merging several compatible VW models. This has similarities to `allreduce` which allowed for several VW nodes to synchronize state to implement parallel learning. Model merging also works by taking several VW models and combining them to produce one which incorporates them all. However, unlike `allreduce` it does not do so by coordinating several parallel VW nodes via network. It does so with the model files offline. Model merging has been designed to be extensible to each reduction to incorporate a more correct representation of the state of a model and so should produce more correct results.

For now just `GD` and `CB_ADF` reductions have had merge operations defined. If a reduction defines a `save_load` function, it signals that it has state that is required for for inference or learning. Therefore, a merge operation is required for each such reduction. If the merge API is used and a reduction with `save_load` but no merge is encountered then a warning is produced. `allreduce` only ever really implemented the `GD` layer of merging though so the thinking here is that it is the same or better as the old way.

It has APIs exposed in Python, Java, C++ and a command line tool `vw-merge`.

More details can be found on the [wiki page](https://github.com/VowpalWabbit/vowpal_wabbit/wiki/Model-merging).

## Thank you

Thank you to all contributors:

- [@bassmang](https://github.com/bassmang)
- [@byronxu99](https://github.com/byronxu99)
- [@lalo](https://github.com/lalo)
- [@mrucker](https://github.com/mrucker)
- [@olgavrou](https://github.com/olgavrou)
- [@timgates42](https://github.com/timgates42)
- [@zmhammedi](https://github.com/zmhammedi)

## Features
- [feat: Added an option to freegrad to handle the case where the Lipschitz constant is known (#4053)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4053)
- [feat: [las] AAtop different approach to las SVD step (#4060)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4060)
- [feat: [las] Y matrix stored in a vw model array (#4070)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4070)
- [feat: [las] One pass SVD implementation (#4078)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4078)
- [feat: [automl] allow transforming the model to contain only champs weights (#4093)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4093)
- [feat: (experimental) Initial support of merging VW models  (#4087)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4087)
- [feat: model merging can take a base image to merge changes over (#4100)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4100)
- [feat: Implement cb adf merge (#4102)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4102)

## Fixes
- [fix: assert almost equal pytest (#4043)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4043)
- [fix: Remove git submodule update in cmake (#4048)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4048)
- [fix: [las] A made with feature values not feature weights (#4050)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4050)
- [fix: [weights] --random_weights uses seed arg (#4056)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4056)
- [fix: dict processing in pyvw on linux operating systems (#4057)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4057)
- [fix: [ci] fix pytype errors (#4063)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4063)
- [fix: Correct Feature Index Data Type (#4066)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4066)
- [fix: in WindowsSetPath, append to PATH instead of overwriting it (#4080)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4080)
- [fix: remove unused csharp variables (#4081)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4081)
- [fix: clear before reading label cache (#4095)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4095)
- [fix: cats set learn_returns_prediction correctly (#4071)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4071)

## Other changes
- [build: specify concrete vcpkg.json for action caching (#4082)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4082)
- [build: Support vcpkg manifest and cmakepreset for easy building (#4077)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4077)
- [build: use add_jar instead of create_javah for jni header generation (#4085)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4085)
- [chore: add 3.10 to macos arm build script (#4041)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4041)
- [chore: add more reporting to ep_decay (#4086)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4086)
- [chore: update readme (#4079)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4079)
- [ci: cancel previous workflows when new commits are pushed (#4099)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4099)
- [ci: ensure python tests non-interactive (#4047)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4047)
- [ci: forwards version model check (#4098)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4098)
- [ci: update macos github action to macos-11 (#4064)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4064)
- [docs: Fix a few typos (#4054)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4054)
- [refactor: [all] remove scorer from workspace (#4061)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4061)
- [refactor: [las] seperate structs per impl (#4075)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4075)
- [refactor: [las] split two impls into seperate files (#4074)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4074)
- [refactor: [las] use template for impl (#4084)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4084)
- [refactor: add one_of to search_interpolation (#4092)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4092)
- [refactor: Bump fmt and spdlog versions (#4059)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4059)
- [refactor: remove redundant set in allreduce operation (#4083)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4083)
- [refactor: Remove voidptr from merge component (#4101)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4101)
- [test: [c#] ignore test with dsjson (#4096)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4096)
- [test: print values in ep_decay (#4049)](https://github.com/VowpalWabbit/vowpal_wabbit/pull/4049)

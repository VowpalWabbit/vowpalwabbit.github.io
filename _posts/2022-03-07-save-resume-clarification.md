---
title: "Clarification on save_resume defaulting to true in 9.0.0"
layout: blog
tags:
description: More information on the same_resume change
author: Jack Gerrits
avatar_link: https://avatars1.githubusercontent.com/u/7558482?s=400&u=21e4cca683799d65a20a4cf3d11d0c17853ef9cb&v=4
---

For version 9.0.0 the [decision was made](https://github.com/VowpalWabbit/vowpal_wabbit/issues/3163) to change the default behavior of model saving to include information required to continue training from a loaded model. This was done as it seemed that most users assumed that this was already the default behavior leading to unexpected behavior. However, in particular when parsing `--invert_hash` output this change of default can be surprising to users. When `save_resume` is enabled `--invert_hash` includes the resume information in the readable format.

Therefore as of version 9.0.0 `vw` now behaves as if `--save_resume` was passed to each invocation. To use the previous default behavior pass `--predict_only_model`.

## `invert_hash` or `readable_model`

When saving a textual representation of a model in 9.0.0 with either `--invert_hash` or `--readable_model` the default format is different. It additionally includes training resumption information. We have seen people depend on the format of the `invert_hash` model. If you have a script which depends on this format you can add `--predict_only_model` to produce the old format and maintain script behavior.

If parsing the `invert_hash` contents most users may have searched for the `:0` to denote the feature section of the invert hash model. This is not in the default 9.0.0 `invert_hash` output as `:0` and `:1` actually refer to `save_resume:false` and `save_resume:true` respectively. If you depend on the format then passing `--predict_only_model` is recommended.

### Comparison

With `data.txt`:
```
0 | price:.23 sqft:.25 age:.05 2006
1 2 'second_house | price:.18 sqft:.15 age:.35 1976
0 1 0.5 'third_house | price:.53 sqft:.32 age:.87 1924
```

#### New default `invert_hash`

As of version 9.0.0 `vw -d data.txt --invert_hash model.txt` produces:

`model.txt`:
```
Version 9.0.0
Id
Min label:0
Max label:1
bits:18
lda:0
0 ngram:
0 skip:
options:
Checksum: 2704463348
:1
initial_t 0
norm normalizer 15
t 4
sum_loss 3
sum_loss_since_last_dump 1
dump_interval 6
min_label 0
max_label 1
weighted_labeled_examples 4
weighted_labels 2
weighted_unlabeled_examples 0
example_number 3
total_features 15
total_weight 3
sd::oec.weighted_labeled_examples 3
current_pass 1
l1_state 0
l2_state 1
1924:1924:-0.145249 4 1
1976:1976:0.158838 8 1
Constant:116060:0.07498 12 1
sqft:162853:0.118057 0.5896 0.32
age:165201:0.0374855 4.0076 0.87
price:229902:0.052627 1.3828 0.53
```

#### Old default `invert_hash`

Use `--predict_only_model` to get the pre 9.0.0 default.

As of version 9.0.0 `vw -d data.txt --invert_hash model.txt --predict_only_model` produces:

`model.txt`:
```
Version 9.0.0
Id
Min label:0
Max label:1
bits:18
lda:0
0 ngram:
0 skip:
options:
Checksum: 2704463348
:0
1924:1924:-0.145249
1976:1976:0.158838
Constant:116060:0.07498
sqft:162853:0.118057
age:165201:0.0374855
price:229902:0.052627
```

## Binary model saving

This also means that binary models produced with `--final_regressor`/`-f` will contain information required for resuming training. VW is able to consume this format automatically. If you have tooling which consumes binary models keep in mind this default change in format.

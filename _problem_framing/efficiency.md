---
tab: Efficient learning
title: Speed and scalability
order: 4
module_id: efficiency
---

Vowpal Wabbit handles learning problems with any number of sparse features. It is the first published tera-scale learner<sup>{% cite DBLP:journals/corr/abs-1110-4198 %}</sup> and pioneered hashing techniques<sup>{% cite Shi:2009:HKS:1577069.1755873 %} {% cite DBLP:journals/corr/abs-0902-2206%}</sup>. It features distributed, out-of-core learning to achieve scalability and keep its memory footprint bounded independent of training data.

<div class="hidden">
  {% bibliography -s apa --cited_in_order %}
</div>

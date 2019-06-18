---
layout: default
permalink: /guides/index.html
---

{% for item in site.guides %}
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
  <p><a href="{{ item.url | relative_url }}">{{ item.title }}</a></p>
{% endfor %}

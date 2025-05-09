---
title: "{{ replace .Name "-" " " | title }}"
layout: "product"
description: "Details about the {{ replace .Name "-" " " | lower }} product{{ if ne .Params.state "" }} for {{ $stateData := index site.Data.states .Params.state }}{{ $stateData.name }}{{ end }}."
date: {{ .Date }}
# product_id is now automatically derived from the filename (.File.ContentBaseName)
state: "{{ index (split .File.Dir "/") 1 }}"
draft: false
# SEO customization
seo:
  title: "{{ replace .Name "-" " " | title }}{{ if ne .Params.state "" }} - {{ $stateData := index site.Data.states .Params.state }}{{ $stateData.name }}{{ end }}"
  description: "High-quality {{ replace .Name "-" " " | lower }}{{ if ne .Params.state "" }} for {{ $stateData := index site.Data.states .Params.state }}{{ $stateData.adjective }} auto dealers{{ end }}. Fast shipping{{ if ne .Params.state "" }} {{ $stateData := index site.Data.states .Params.state }}{{ $stateData.priceSuffix }}{{ end }}."
  keywords: "{{ replace .Name "-" " " | lower }}, auto dealer supplies{{ if ne .Params.state "" }}, {{ $stateData := index site.Data.states .Params.state }}{{ $stateData.seoKeywords }}{{ end }}"
---

{{ if ne .Params.state "" }}
{{ $stateData := index site.Data.states .Params.state }}
{{ $productData := index site.Data.products .File.ContentBaseName }}

<!-- State-specific content will be automatically generated based on the state data -->
<div class="state-specific-content">
  <p>Our {{ $productData.title }} products are perfect for auto dealers in {{ $stateData.name }}. With fast shipping to {{ range $index, $city := $stateData.citiesList }}{{ if $index }}, {{ end }}{{ $city }}{{ end }} and all other locations across {{ $stateData.name }}.</p>
  
  <p>{{ $stateData.adjective }} auto dealers in the {{ range $index, $industry := $stateData.keyIndustries }}{{ if $index }}, {{ end }}{{ $industry }}{{ end }} industries trust our products for their reliability and quality.</p>
</div>
{{ end }}

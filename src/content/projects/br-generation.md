---
title: From plain English statements to valid business rules
employer: coditas
status: production
disciplines: [ai, backend]
stack: [Python, LangGraph, RAG, FastAPI, Vector DB, AI Engineering]
summary: An AI service that converts plain English statements into valid Business Rules for the client's GRC platform using a multi-node LangGraph pipeline and a RAG architecture.
highlights:
  - Designed a multi-node LangGraph pipeline with per-node metadata enrichment for BR generation.
  - Built a RAG system to retrieve the form, field, and module metadata required for valid business rule construction.
  - Reduced manual BR authoring effort by approximately 40%, dramatically accelerating developer workflow.
  - Handled the JS-to-BR conversion pipeline, including legacy JavaScript version compatibility via existing converter APIs.
metrics:
  - { value: "~40%", label: "Reduction in manual BR authoring effort", accent: true }
order: 1
---

An AI service that converts plain English statements into valid Business Rules
(BRs) for the client's GRC platform. It uses a LangGraph pipeline with multi-node
processing, where each node enriches the intermediate representation with form,
field, and module metadata.

It employs a RAG architecture to resolve the platform-specific metadata required
for valid BR output, and also handles the JS-to-BR conversion pipeline, including
legacy JavaScript version compatibility via existing converter APIs.

---
title: Cutting change history registration from hours to minutes
employer: coditas
status: production
disciplines: [ai, backend]
stack: [Python, MCP Protocol, Windsurf Workflows, Async Python, SQL, Multi-tenant DB]
summary: A custom MCP server integrated into Windsurf Workflows automates registering audit and change history for database form columns, replacing a manual process that took a customer success team member hours.
highlights:
  - Built an async MCP server with tools that execute multi-step database queries, validating column presence across Audit Tables, Default Columns Table, View Table, and Section assignments.
  - Designed dynamic multi-instance database connectivity for the MCP tools, connecting to different instance databases at runtime based on request context.
  - Wrote a Windsurf Workflow that orchestrates the MCP tools in sequence from a single plain-language user input.
  - Reduced the CSS team's time per form registration from 3-4 hours to ~7 minutes, an approximately 97% reduction in time spent.
metrics:
  - { value: "3-4 hrs to ~7 min", label: "Time per form registration, before and after" }
  - { value: "~97%", label: "Reduction in CSS team's time per form registration", accent: true }
openQuestions:
  - Number of forms onboarded so far.
  - Rough estimate of total hours saved for the CSS team since deployment.
order: 3
---

A custom MCP (Model Context Protocol) server integrated into Windsurf Workflows
to automate the registration of audit and change history for database form
columns. Previously, a customer success team member would spend 3-4 hours per
form manually querying databases, validating columns against multiple tables,
and writing SQL registration scripts. This workflow reduces that to 6-7 minutes.

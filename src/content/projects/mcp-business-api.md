---
title: Automating Business API registration end to end
employer: coditas
status: production
disciplines: [ai, backend]
stack: [Python, MCP Protocol, Windsurf Workflows, REST APIs, Jenkins]
summary: An MCP service and Windsurf Workflow that wraps a previously manual, error-prone sequence of instance commands and a Jenkins job into an automated Business API registration process.
highlights:
  - Collaborated with the client's engineering team to map and wrap instance-level CLI commands into REST APIs.
  - Built MCP tools that call these APIs in the correct sequence and verify their results.
  - Wrote a Windsurf Workflow that orchestrates the entire Business API registration process end-to-end.
  - Improved CSS team work efficiency by approximately 40% for this class of task.
metrics:
  - { value: "~40%", label: "Improvement in CSS team efficiency for this task class", accent: true }
openQuestions:
  - Average number of Business API registrations per week.
  - Estimated time saved per registration.
order: 4
---

When new forms are registered on the GRC platform, associated Business APIs must
also be registered by executing a sequence of commands on the instance followed
by a Jenkins job. This was a fully manual, error-prone process.

Built in close collaboration with the client's engineering team, this project
wraps those instance commands into internal APIs and integrates them into an MCP
service and Windsurf Workflow, automating the full registration sequence.

---
title: Bulk business rule copying without breaking the API's limits
employer: coditas
status: production
disciplines: [backend, infrastructure]
stack: [Python, Redis, RabbitMQ, WebSockets, Async Python, Concurrency Design]
summary: Backend architecture that saves generated business rules back to the client's instance through a Bulk BR API constrained to one parallel request per form, a maximum queue size, and a 100-BR-per-request limit.
highlights:
  - Implemented form-level and instance-level Redis locks to prevent concurrent duplicate API triggers for the same form and instance pair.
  - Designed a RabbitMQ consumer background processor that batches BRs into chunks of 100 or fewer, triggers the Bulk API, polls for job status, and streams progress over Redis pub-sub to WebSocket.
  - Handled all API limitations gracefully without exposing complexity to the end user, with real-time progress visible throughout.
order: 5
---

After BRs are generated, they must be saved back to the client's instance via
their Bulk BR API. This API has several hard constraints: only one parallel
request per form, a maximum queue size, a 100-BR-per-request limit, and an async
job-tracking model.

The entire backend architecture was designed to work within these constraints at
scale, using Redis locks, RabbitMQ background processors, and WebSocket progress
streaming.

---
title: Automating the multi-tenant CEC upgrade process
employer: coditas
status: production
disciplines: [backend, web]
stack: [Python, FastAPI, RabbitMQ, Redis Pub-Sub, WebSockets, SQL, ReactJS]
summary: A web application that automates the multi-tenant upgrade process for the client's GRC platform by parsing CEC customization files and presenting a diff pane across old base, customized, and new base versions.
highlights:
  - Wrote a custom CEC file parser handling 10,000+ heterogeneous objects per file.
  - Designed the SQL schema isolating project- and module-level CEC data for precise querying.
  - Implemented background task processing via a RabbitMQ consumer with async Redis pub-sub event streaming to the frontend over WebSockets.
  - Integrated live metadata API calls to the latest instance during processing to ensure freshness of object attributes.
  - Built a diff pane UI allowing users to view and reconcile changes across three versions simultaneously.
  - Reused the existing JS-to-BR conversion APIs so instances still running an older JavaScript version could be upgraded too.
metrics:
  - { value: "10,000+", label: "Objects handled per CEC file" }
openQuestions:
  - Average processing time for a typical CEC file (e.g. X seconds for ~10k objects).
  - Number of customer instances this has been used on so far.
order: 2
---

A web application that automates the painful multi-tenant upgrade process for the
client's GRC platform. When a base platform version is upgraded, all per-customer
customizations, stored as CEC files, must be compared and conflicts resolved.

This tool parses large CEC files of 10,000+ objects, stores them in a
purpose-designed SQL schema, and presents a diff pane UI showing differences
between the old base, the customer's customized version, and the new base
instance.

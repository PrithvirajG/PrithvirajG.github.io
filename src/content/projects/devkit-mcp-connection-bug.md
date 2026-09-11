---
title: Fixing a shared database connection bug before it touched every tenant
employer: coditas
status: production
disciplines: [backend, infrastructure]
stack: [Python, MCP Protocol, Multi-tenant DB]
summary: A shared MCP service used one database connection, read once at startup, for every request. In a multi-tenant platform where each request needs its own instance's database, that is a bug waiting to cross tenants. Found it and fixed it before it did.
highlights:
  - Traced a subtle bug in a shared MCP database connectivity service, it read its credentials once at startup and reused that single connection for every request instead of resolving the right instance per request.
  - Worked through the correct fix, a genuinely per-request dynamic connection, rather than a partial patch.
  - Caught and resolved early enough that no cross-tenant data exposure occurred in production.
order: 6
---

A shared MCP service that several tools depended on for instance database
connectivity had a quiet but serious bug: it read its database credentials
once at startup and reused that single connection for every request. In a
multi-tenant platform, each request needs to reach its own customer's
database, not whichever one happened to be configured first.

Traced the bug to its root and worked through the correct fix, a genuinely
per-request dynamic connection, catching and resolving it before it caused
any cross-tenant issues in production.

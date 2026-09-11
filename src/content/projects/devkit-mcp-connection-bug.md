---
title: Catching the same database bug twice in a colleague's code
employer: coditas
status: production
disciplines: [backend, infrastructure]
stack: [Python, MCP Protocol, Multi-tenant DB, Code Review]
summary: A shared MCP server for connecting to customer instance databases read its credentials once from a .env file and reused that single connection for every request, which cannot work in a multi-tenant setup. Caught it twice, once before release and once after a flawed fix reached production.
highlights:
  - A senior colleague built the MCP server other tools depend on for instance database connectivity, wiring it to one hardcoded connection read from a .env file.
  - Flagged that this breaks under multiple tenants before release, since every request needs its own instance's database, not a shared one.
  - "The fix that shipped anyway, without review, was still not dynamic: it latched onto whichever instance's request arrived first and reused that single connection for every request after."
  - Caught the same class of bug again on review of the production code, this time guiding the actual architecture change a correct per-request dynamic connection needed.
  - Caught soon enough after release to avoid the wider cross-tenant data problems a shared, wrong database connection would otherwise have caused.
order: 6
---

Another engineer's MCP server, the shared connectivity layer several tools in
this client engagement relied on, connected to a customer's database once at
startup using credentials from a `.env` file and reused that one connection
for every request. In a multi-tenant platform that is wrong by construction:
every request needs to reach its own customer's database, not whichever one
happened to be configured.

The first version was flagged before it shipped. A fix went to production
without review anyway, and it was still wrong in a subtler way: the
connection was dynamic only for the very first request, then reused for
everyone after. Reviewing the production code caught it a second time, and
that review is what shaped the actual fix, a genuinely per-request dynamic
connection, rather than another plausible-looking patch.

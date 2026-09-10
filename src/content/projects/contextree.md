---
title: Branching AI conversations into a navigable tree
employer: workshop
status: personal
stage: in-progress
private: true
disciplines: [ai, backend, web]
stack: [Next.js, NestJS, PostgreSQL, LTREE, pgvector, Redis, TypeORM, Turborepo]
summary: A chat interface that organizes conversations with multiple AI models as a hierarchical tree instead of a single linear thread, so context can be branched, compared, and reused.
highlights:
  - Uses PostgreSQL's LTREE extension to store and query the conversation hierarchy efficiently.
  - Supports comparing responses from different models against the same branch of context.
  - Built as a pnpm and Turborepo monorepo, with a NestJS API and a Next.js 15 frontend.
  - Repository is private for now.
repo: https://github.com/PrithvirajG/contextree.ai
order: 2
---

Context Tree organizes AI conversations as hierarchical nodes rather than one
long thread, so a branch of context can be forked, compared across models, or
reused elsewhere. The backend runs on NestJS with PostgreSQL's LTREE for
efficient tree queries and pgvector alongside it; the frontend is Next.js 15.

---
title: Searching your own photos by what's actually in them
employer: workshop
status: personal
stage: in-progress
disciplines: [ai, cv, backend, web]
stack: [FastAPI, React, MongoDB, Weaviate, RabbitMQ, YOLOv8, BLIP, CLIP, Docker]
summary: A local-first image search system that watches folders, runs every photo through object detection, captioning, and CLIP embeddings, and exposes keyword, semantic, and hybrid search over the results.
highlights:
  - Three independent backend processes coordinate through MongoDB and RabbitMQ, a filesystem watcher, a pipeline worker, and a FastAPI server.
  - The pipeline worker runs each image through YOLOv8 for object detection, BLIP for captioning, and CLIP for embeddings, writing outputs to MongoDB and vectors to Weaviate.
  - Everything runs on the machine it's installed on; images and model outputs never leave it.
  - A React single-page app talks to the API over HTTP and WebSockets for live job status.
repo: https://github.com/PrithvirajG/PixQuery
order: 2
---

A local-first AI image search and processing system. It watches folders of
images, runs them through detection, captioning, and embedding models, and
exposes keyword, semantic, and hybrid search through a FastAPI backend and a
React frontend, with nothing leaving the machine it runs on.

---
title: Auditing warehouse inventory changes from overhead cameras
employer: iam
status: production
disciplines: [cv, data]
stack: [Python, OpenCV, Computer Vision, MongoDB, Docker, RabbitMQ, ReactJS]
summary: An AI-powered inventory monitoring system that uses overhead CCTV cameras to automatically detect and log changes in warehouse stock, giving managers a daily audit trail of inventory movements.
highlights:
  - Processed time-interval CCTV frames captured from an elevated angle using computer vision change detection algorithms.
  - Detected inventory change events between user-specified time ranges, with percentage change estimation and section-level localization.
  - Surfaced stagnant sections (unchanged inventory) to help identify slow-moving or zero-demand goods.
  - Built and deployed the full pipeline including frontend visualization for warehouse management teams.
openQuestions:
  - The change detection algorithm or model used (e.g. frame differencing, specific deep learning model).
  - Number of warehouse clients deployed in.
  - Any inventory accuracy improvements measured.
order: 2
---

An AI-powered inventory monitoring system using overhead CCTV cameras to
automatically detect and log changes in warehouse stock. It gives warehouse
managers a high-level daily audit trail of inventory movements, including
which sections changed, by what percentage, and which goods remained
untouched.

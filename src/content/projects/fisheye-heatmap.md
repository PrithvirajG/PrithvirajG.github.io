---
title: Turning fisheye camera feeds into store traffic heatmaps
employer: iam
status: production
disciplines: [cv, data]
stack: [Python, RAPiD-CNN, Byte Tracker, Jetson Nano, OpenCV, MongoDB, ReactJS, Edge AI]
summary: An edge-deployed AI system that analyzes fisheye camera feeds in retail stores to track customer movement patterns and generate floor heatmaps for optimizing store layout.
highlights:
  - Deployed RAPiD-CNN (fisheye-optimized people detection model) on Jetson Nano for real-time frame processing at the edge.
  - Integrated the Byte Tracker algorithm for persistent per-person tracking with unique Tracker IDs across frames.
  - Stored detection metadata (bounding boxes, tracker IDs, timestamps) in MongoDB for time-range querying.
  - Built a ReactJS frontend where users select a time range, and the system maps detections onto the store floor plan to generate an animated heatmap.
  - Deployed and maintained the full pipeline in a production environment serving real retail clients.
openQuestions:
  - Number of retail stores deployed in.
  - Average frames processed per second on Jetson Nano.
  - Any business outcomes reported by clients (e.g. sales uplift from re-arranged displays).
order: 1
---

An edge-deployed AI system that analyzes fisheye camera feeds in retail
stores to track customer movement patterns and generate floor heatmaps. It
helps businesses identify high-traffic zones for optimizing product
placement, advertising, and store layout.

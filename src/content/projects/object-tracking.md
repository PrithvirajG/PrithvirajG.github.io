---
title: From a tap on screen to the drone following a target
employer: flytbase-edge
status: internal
disciplines: [robotics, cv]
stack: [Python, OpenCV, YOLOv5, CSRT / KCF, DJI SDK, Proportional Control, Edge Computing]
summary: An internal drone-based object tracking system where a user selects a target in the live video feed and the drone autonomously follows it, from selection through CV tracking to velocity commands.
highlights:
  - Evaluated YOLOv5 and SSD MobileNet for detection and re-identification but transitioned to OpenCV CSRT/KCF trackers for lower latency and edge suitability.
  - Developed a custom proportional controller converting pixel displacement of the tracked object from frame center into drone velocity commands.
  - Tightly coupled the tracking loop with the DJI drone SDK for smooth transitions between autonomous tracking and manual override.
  - Optimized for low-latency edge deployment, with a modular design that supports future swap of vision models or tracking algorithms.
openQuestions:
  - Approximate end-to-end tracking latency (e.g. Xms frame-to-command).
  - Any frame rates or hardware targets this was optimized for.
order: 2
---

An internal drone-based object tracking system where a user selects a target
in the live video feed and the drone autonomously follows it. It is a full
vision-to-control pipeline: from user selection, to CV tracker initialization,
to bounding box tracking, to pixel displacement calculation, to proportional
velocity commands sent to the drone SDK.

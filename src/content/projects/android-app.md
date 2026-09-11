---
title: A production Android app running on the drone's remote controller
employer: flytbase-edge
status: production
disciplines: [robotics, android]
stack: [Kotlin, Android Studio, DJI Mobile SDK, MQTT, AWS S3, WorkManager, Coroutines, MVVM / Hilt, Millicast]
summary: A production Kotlin Android application deployed on DJI Smart Remote Controllers for autonomous drone operations, handling control, docking, media sync, connectivity monitoring, and live video streaming.
highlights:
  - Implemented a resilient MQTT communication layer (PAHO client) with automatic reconnection, QoS handling, and message persistence for reliable operation in variable network environments.
  - Engineered a parallel media upload pipeline to AWS S3 using WorkManager and Kotlin Coroutines, with flight metadata tagging (GPS, timestamps, payload config) stored in Room (SQLite) and fault-tolerant resume on restart.
  - Built a 4G network monitoring UI with StateFlow/LiveData reactive rendering, automatic failsafe (Return-To-Home) on 4G dropout, and local connectivity metric logging.
  - Refactored the video streaming architecture for live drone feed relay to Millicast Cloud, supporting efficient 4G variable-bandwidth streaming via SharedFlow state management.
  - Followed MVVM architecture with Hilt dependency injection, and integrated Crashlytics and Firebase Analytics for production monitoring.
  - Designed and maintained CI/CD workflows for automated APK builds, code signing, and staged deployment to internal testers.
  - Fixed a critical NFZ/Geofence sync bug, previously failing about 70% of the time, by redesigning DJI hardware event handling and state propagation; post-fix success rate reached about 95%, with the remaining failures traced to DJI's own hardware rather than the FlytBase code.
metrics:
  - { value: "70 to 95%", label: "Geofence sync success rate after redesign", accent: true }
openQuestions:
  - Approximate number of enterprise customers or drone operators using this app.
  - Number of DJI drone and dock models it supports.
order: 1
---

A production Kotlin Android application deployed on DJI Smart Remote Controllers
for autonomous drone operations. It handles real-time drone control, docking
station management, cloud media sync, 4G connectivity monitoring, live video
streaming, and DJI camera operations, all integrated through the FlytBase MQTT
backend.

A critical NFZ/Geofence sync bug, previously failing about 70% of the time, was
fixed by redesigning DJI hardware event handling and state propagation; the
post-fix success rate reached about 95%, and the remaining failures traced back
to DJI's own hardware, not the FlytBase code.

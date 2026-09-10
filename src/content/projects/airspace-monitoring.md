---
title: Real-time situational awareness for drone airspace
employer: flytbase
status: production
disciplines: [robotics, backend]
stack: [Python, MQTT, CasiaG, AirSense, Real-time Systems]
summary: A cloud microservice that monitors drone airspace in real time using sensor data from CasiaG and AirSense systems to give the FlytBase platform situational awareness.
highlights:
  - Ingests live sensor feeds from CasiaG and AirSense airspace monitoring hardware.
  - Processes and propagates airspace events to the cloud platform and frontend for real-time operator awareness.
openQuestions:
  - What specific airspace events are detected (e.g. conflicting traffic, geofence breaches).
  - Any latency targets this service operates under.
order: 2
---

A cloud microservice that monitors drone airspace in real-time using sensor
data from CasiaG and AirSense systems. It provides situational awareness of the
drone's operating environment to the FlytBase platform.

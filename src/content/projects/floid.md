---
title: A safety net for indoor test flights
employer: flytbase-edge
status: internal
disciplines: [robotics, iot]
stack: [Python, Raspberry Pi, MQTT, Real-time Monitoring, IoT]
summary: A Raspberry Pi-based safety monitoring device deployed at FlytBase HQ to prevent drone crashes during indoor test flights by triggering alarms when a safety threshold is breached.
highlights:
  - Deployed on Raspberry Pi for low-cost, always-on monitoring at the test facility.
  - Monitors real-time drone telemetry for safety threshold breaches (altitude, proximity, battery, etc.).
  - Triggers physical alarm and siren outputs on breach detection for immediate human-in-the-loop response.
openQuestions:
  - Specific safety parameters monitored (altitude ceiling, minimum battery %, proximity to walls, etc.).
  - Whether this is still in active use.
order: 3
---

F.L.O.I.D. (First Line of Incident Defence) is a Raspberry Pi-based safety
monitoring device deployed at FlytBase HQ to prevent drone crashes during
indoor test flights. It continuously monitors drone telemetry and triggers
audible alarms and sirens whenever a configurable safety threshold is
breached.

---
title: One service between the drone and the cloud
employer: flytbase
status: production
disciplines: [robotics, infrastructure]
stack: [Python, asyncio, MQTT, Redis, Flask, RabbitMQ]
summary: Stateless, horizontally scalable middleware between DJI hardware and the cloud, carrying live telemetry up and control commands back down.
highlights:
  - Runs on asyncio so a slow MQTT topic never blocks a fast one.
  - Redis holds shared drone state, so any instance can answer for any aircraft.
  - Mutexes in the job layer stop two instances issuing the same command.
  - Outbound velocity commands are throttled during manual control so the hardware is never overrun.
  - Retries, circuit breakers, and metrics were in the first version, not a later patch.
metrics:
  - { value: "70 to 95%", label: "Geofence sync success after redesign", accent: true }
  - { value: "3", label: "Protocols spoken" }
openQuestions:
  - Peak MQTT messages per second.
  - Number of drone and dock units managed in production.
order: 1
---

Telemetry arrives over many MQTT topics at once and none of it can wait. The
service runs on asyncio so a slow topic never blocks a fast one, and Redis holds
the shared drone state so any instance can answer for any aircraft.

Two instances issuing the same command is how you lose a drone. Mutexes in the job
layer make that impossible, and outbound velocity commands during manual control
are throttled so the hardware is never asked to do more than it can.

It speaks MQTT to the aircraft, HTTP to the web tier, and RabbitMQ to everything
else. Retries, circuit breakers, and metrics were part of the first version, not a
later patch.

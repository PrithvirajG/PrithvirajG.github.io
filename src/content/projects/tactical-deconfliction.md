---
title: Keeping drones apart in shared airspace
employer: flytbase
status: production
disciplines: [robotics, backend]
stack: [GoLang, Drone Telemetry, Real-time Monitoring, Failsafe Systems]
summary: A GoLang-based system for monitoring multiple intra-organization drones in shared airspace and executing automated failsafe actions when deconfliction thresholds are breached.
highlights:
  - Built in GoLang for high-performance, concurrent monitoring of multiple drone telemetry streams.
  - Detects proximity and deconfliction violations across drones within the same organization's airspace.
  - Executes automated failsafe actions (e.g. hold, reroute, RTH) based on configurable threshold rules.
openQuestions:
  - Maximum number of drones monitored simultaneously.
  - The specific failsafe action types that are supported.
order: 4
---

A GoLang-based system for monitoring multiple intra-organization drones in
shared airspace and executing automated failsafe actions when deconfliction
thresholds are breached. Designed for environments where multiple drones
operate simultaneously and must avoid conflicts autonomously.

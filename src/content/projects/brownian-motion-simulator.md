---
title: Simulating a robot's random walk inside a bounded arena
employer: workshop
status: personal
disciplines: [simulation, robotics]
stack: [Python, Pygame]
summary: A Pygame simulation of a robot moving through a Brownian-motion-style random walk, rotating randomly after each collision with the arena wall, with the full path and collision statistics recorded for analysis.
highlights:
  - The robot moves in a straight line until it hits a boundary, then rotates by a random angle and continues.
  - Every run records the full path and each collision event.
  - Exports a trajectory plot, a collision statistics file, and a GIF of the run for later review.
repo: https://github.com/PrithvirajG/brownian-motion-simulator
order: 6
---

A robot moves inside a square arena, travelling in a straight line until it
hits a wall, then rotating by a random angle and continuing, the way a
particle under Brownian motion changes direction on collision. The simulator
records the full path and every collision, then exports a trajectory plot, a
statistics file, and a GIF of the run.

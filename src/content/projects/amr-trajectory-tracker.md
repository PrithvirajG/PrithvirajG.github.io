---
title: Recording and replaying a mobile robot's path in ROS 2
employer: workshop
status: personal
disciplines: [robotics]
stack: [ROS2, C++, RViz2, tf2]
summary: A ROS 2 package that records an autonomous mobile robot's trajectory from odometry, saves it to disk, and can reload and replay it in RViz for review.
highlights:
  - A saver node subscribes to /odom, buffers the trajectory, and publishes it to RViz as markers.
  - A service lets a caller save the trajectory to JSON, CSV, or YAML, optionally trimmed to the most recent N seconds.
  - A reader node loads a saved trajectory file, optionally transforms it into the odom frame with tf2, and republishes it for visualization.
repo: https://github.com/PrithvirajG/amr_trajectory_tracker
order: 6
---

A ROS 2 package built around two nodes. One tracks and buffers a robot's
trajectory from odometry and can save it to JSON, CSV, or YAML on request,
optionally limited to the most recent stretch of time. The other reads a
saved trajectory back, transforms it into the current odom frame if needed,
and republishes it so it can be visualized in RViz alongside a live run.

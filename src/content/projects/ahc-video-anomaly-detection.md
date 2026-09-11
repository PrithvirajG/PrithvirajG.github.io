---
title: Finding out why a zero-shot video anomaly detector plateaued
employer: workshop
status: personal
disciplines: [ai, cv]
stack: [Python, SigLIP2, Qwen3-VL-4B, PyTorch, Kaggle]
summary: A three-tier, zero-shot cascade for detecting eleven classes of anomaly in drone, CCTV, and dashcam footage, built at the AHC x FlytBase Visual Intelligence Hackathon with no trained weights at all.
highlights:
  - A motion gate, a frozen SigLIP2 encoder scoring frames against written rules, and a frozen Qwen3-VL-4B verifying only what survives, so the expensive model runs on roughly 13% of frames.
  - "Measured that coverage and recognition are different things: 88% of real events had a model window over them, but only 12% were given the correct class."
  - Found and reverted three plausible-looking fixes after measuring each against the actual scoring rule rather than intuition.
  - Discovered the project's own anomaly health score was inverted on three of four videos, only after finally plotting it against ground truth.
  - Reached 2.8x realtime throughput on a single T4 GPU, with 92% of wall time inside the vision-language model.
repo: https://github.com/PrithvirajG/ahc-video-anomaly-detection
order: 1
---

A cascade built to make an expensive vision-language model affordable: a cheap
motion gate and a frozen SigLIP2 encoder filter frames down to the roughly 13%
worth sending to Qwen3-VL-4B for verification. Built solo in a day at the AHC
and FlytBase Visual Intelligence Hackathon, with no trained weights anywhere
in the pipeline. The write-up documents twelve measured experiments, several
of which overturned assumptions the team had been building on.

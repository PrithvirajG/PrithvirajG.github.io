---
name: "Looking Is Not Recognising"
host: AI Hackers Collective, hosted at FlytBase
year: "September 2026"
summary: "A zero-shot cascade for real-time video anomaly detection, built in a day at a September 2026 hackathon, and twelve measured experiments on why its score plateaued instead of the fixes anyone expected."
highlights:
  - Entered to learn, not to place; a full day of building against a public leaderboard with no trained weights allowed.
  - A motion gate, a frozen SigLIP2 encoder scoring frames against written rules, and a frozen Qwen3-VL-4B verifying only what survives, so the expensive model runs on roughly 13% of frames.
  - Measured that coverage and recognition are different things, 88% of real events had a model window over them, but only 12% were given the correct class.
  - Found and reverted three plausible-looking fixes after measuring each against the actual scoring rule rather than intuition, and discovered the project's own anomaly health score was inverted on three of four videos.
  - Reached 2.8x realtime throughput on a single T4 GPU, with 92% of wall time inside the vision-language model.
stack: [Python, SigLIP2, Qwen3-VL-4B, PyTorch, Kaggle]
metrics:
  - { value: "3", label: "Cascade tiers, zero trained weights" }
  - { value: "12", label: "Measured experiment runs" }
  - { value: "2.8x", label: "Realtime throughput on one T4" }
  - { value: "37.5 / 100", label: "Blind evaluation score", accent: true }
image: /contests/anomaly-detection-cascade.png
imageCaption: The three-tier cascade, a motion gate feeding a frozen SigLIP2 encoder feeding a frozen Qwen3-VL-4B.
repo: https://github.com/PrithvirajG/ahc-video-anomaly-detection
order: 1
---

A day-long hackathon run by AI Hackers Collective at FlytBase's Pune office,
built around one question: can a small vision-language model detect what
actually matters in live drone video, in real time. The submission was a
three-tier cascade using no trained weights at all, and the write-up spends
more time on what the twelve measured runs disproved than on the leaderboard
score itself.

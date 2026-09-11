---
title: Extracting traffic insight from drone video using only its own telemetry
employer: workshop
status: personal
disciplines: [ai, cv, robotics]
stack: [Python, YOLO11s, SAHI, BoT-SORT, OSNet ReID, OSMnx, Streamlit, Canvas]
summary: Road-user trajectories and traffic insight from two 4K drone clips, projected onto real map geometry using only the aircraft's own GPS, altitude, and gimbal telemetry, with no manual survey or ground control points.
highlights:
  - Detection, tracking, classification, and ground-plane projection run end to end from raw drone video and its onboard SRT telemetry.
  - Chose the detector and tracker by measurement rather than default, a COCO-pretrained YOLO missed pedestrians and motorcycles entirely at 70 m altitude, and BoT-SORT with re-identification cut identity fragmentation to a third of a ByteTrack baseline.
  - Projected vehicle positions land within 1.15 to 1.87 metres of the correct OpenStreetMap carriageway, refined against road geometry rather than trusted outright.
  - Built a dependency-free Canvas dashboard with synchronised video, map, and analytics views, optimised after profiling found it issuing roughly 84,000 draw calls a second.
repo: https://github.com/PrithvirajG/aerial-traffic-intelligence
order: 3
---

Two 4K clips from a hovering DJI Matrice 3D over a Pune arterial road, turned
into map-native traffic data end to end: every road user detected, tracked
through occlusion, classified, and projected onto the ground plane using
nothing but the drone's own telemetry. Built at the AHC and FlytBase Visual
Intelligence Hackathon. 407,483 detections became 4,529 tracked identities,
84% of which were bound to a named OpenStreetMap lane.

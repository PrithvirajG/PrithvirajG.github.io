---
name: Aerial Traffic Intelligence
host: AI Hackers Collective, hosted at FlytBase
year: "August 2026"
summary: "Road-user trajectories and traffic insight from two 4K drone clips at an August 2026 hackathon, projected onto real map geometry using only the aircraft's own telemetry, no annotations, no ground control points, no survey."
highlights:
  - Entered to learn, not to place; four staged levels built over the hackathon against real drone footage from a hovering DJI Matrice 3D.
  - Chose the detector and tracker by measurement rather than default, a COCO-pretrained YOLO missed pedestrians and motorcycles entirely at 70 m altitude, and BoT-SORT with re-identification cut identity fragmentation to a third of a ByteTrack baseline.
  - Projected vehicle positions onto OpenStreetMap using only GPS, relative altitude, and gimbal attitude, refined against road geometry rather than trusted outright, landing within 1.15 to 1.87 metres of the correct carriageway.
  - Built a dependency-free Canvas dashboard with synchronised video, map, and analytics views, optimised after profiling found it issuing roughly 84,000 draw calls a second.
  - 294 drivable OSM links matched against the two clips, with 84% of map-bound tracks also assigned to a specific lane.
stack: [Python, YOLO11s, SAHI, BoT-SORT, OSNet ReID, OSMnx, Streamlit, Canvas]
metrics:
  - { value: "407,483", label: "Detections across four processed runs", accent: true }
  - { value: "4,529", label: "Tracked road-user identities" }
  - { value: "1.15 to 1.87 m", label: "Median distance to the nearest OSM centreline" }
  - { value: "84%", label: "Map-bound tracks also lane-assigned" }
image: /contests/aerial-traffic-detection-tracking.jpg
imageCaption: Detection and tracking on the intersection scene. Box colour is per identity, not per class, so an identity swap shows up as a colour change.
repo: https://github.com/PrithvirajG/aerial-traffic-intelligence
order: 2
---

A hackathon run by AI Hackers Collective at FlytBase, working through four
staged levels on two real 4K clips from a hovering drone: detection and
identity, classification and kinematics, aggregate traffic insight, and
finally spatial grounding onto OpenStreetMap using nothing but the aircraft's
own telemetry. The dashboard that visualises the result is dependency-free
JavaScript and Canvas, built to run entirely offline.

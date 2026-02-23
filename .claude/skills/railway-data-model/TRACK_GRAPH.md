# Track Graph Model

## Graph Structure

Tracks (Node) unify platform tracks, mainline segments, and connecting tracks into a single model. TrackConnections (Edge) represent directed connections between Tracks.

This unified model represents the following without additional concepts:
- Quadruple tracks (express/local line separation)
- Station platforms
- Branch lines and connecting tracks
- Signal stations (no platforms)
- Multiple railway lines sharing a route segment

## MVP Auto-Generation Strategy

In the MVP, users input only "double/single track" settings and the system auto-generates Tracks and TrackConnections. Users do not interact with the graph structure directly.

### Auto-generation example (double track)

Input: Yoyogi-Uehara → Higashi-Kitazawa (double track)

```
Generated Tracks:
  - Yoyogi-Uehara to Higashi-Kitazawa (outbound mainline)  lineIds: [Odakyu Odawara Line]
  - Yoyogi-Uehara to Higashi-Kitazawa (inbound mainline)   lineIds: [Odakyu Odawara Line]
  - Yoyogi-Uehara Platform 1                               stationId: Yoyogi-Uehara
  - Yoyogi-Uehara Platform 2                               stationId: Yoyogi-Uehara

Generated TrackConnections:
  - Platform 1 → Outbound mainline
  - Inbound mainline → Platform 2
  - (Similarly generated for Higashi-Kitazawa side)
```

## RailwayLine Responsibility

RailwayLine is the physical infrastructure management unit:
- Groups Tracks by line
- Each continuous segment belongs to exactly one line (only boundary Tracks/Stations are shared between lines)
- Operating patterns like the Shonan-Shinjuku Line are represented by a future "service pattern" model, not by RailwayLine

RailwayLine and DiagramView have clearly separated responsibilities: DiagramView is a display configuration that can be modified independently of infrastructure definitions.

## Station Time Lookup

Arrival/departure times at a station are retrieved by traversing `TrainSegment.trackTimes` via `trackId → Track.stationId`. A separate `StationTime` model is intentionally absent to avoid duplicating time data.

In the MVP, query cost is acceptable. Future optimization via caching is planned.

## Post-MVP Features

The following are deferred to post-MVP:
- Platform selection/editing UI
- Quadruple track, connecting track, and signal station editing UI
- Track entry permission rules (constraints on TrackConnections)
- Conflict detection (overtaking/passing violations)
- Reverse lookup cache (`trackId → Station`)

For detailed ADR: `docs/adr/004-track-graph-model.md`

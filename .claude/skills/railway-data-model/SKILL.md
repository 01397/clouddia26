---
name: railway-data-model
description: Core data model for the railway diagram editor. Use when implementing or modifying features involving tracks, stations, trains, schedules, timetables, TrackTime null rules, DiagramView, or file serialization/deserialization (.cdia format).
---

# Railway Data Model

One railway network per `RailwayFile`. Track structure uses a graph model (Track = Node, TrackConnection = Edge).

**Non-obvious distinctions:**
- **TrainSegment vs TrainService**: TrainSegment is the operational unit (conflict detection, timetable display). TrainService is the passenger-facing unit (train name/number, links multiple segments for split/join/through service).
- **Schedule**: Operation timetable variant (e.g. "Weekday", "Holiday"). Owns `TrainSegment[]` and `TrainService[]`. `RailwayLine`, `Station`, and `TrainType` are shared across Schedules (file-level).
- **DiagramView**: A display configuration defining which stations appear in the diagram. Not an MVC view.

## Basic Types

```typescript
type TimeOffset = number  // Seconds from 00:00:00. e.g. 14400 = 4:00, 86400 = 24:00
type Id = string
type Direction = 'outbound' | 'inbound'
type StopType = 'stop' | 'pass'
```

## Domains

**Infrastructure**: Track, TrackConnection, Station, RailwayLine → [reference/track-graph.md](reference/track-graph.md)
**Train Operations**: Schedule, TrainSegment, TrainService → [reference/train-model.md](reference/train-model.md)
**Display & File**: TrainType, DiagramView, DiagramDisplaySettings, FileMetadata → [reference/display.md](reference/display.md)
**All TypeScript interfaces**: → [reference/types.md](reference/types.md)

## RailwayFile (Top-level .cdia)

```typescript
interface RailwayFile {
  metadata: FileMetadata
  lines: RailwayLine[]
  stations: Station[]
  tracks: Track[]
  connections: TrackConnection[]
  trainTypes: TrainType[]
  schedules: Schedule[]        // Each Schedule owns its segments[] and services[]
  diagramViews: DiagramView[]
  displaySettings: DiagramDisplaySettings
}
```

## TrackTime Null Rules

| Track Type | entryTime | exitTime |
|---|---|---|
| Mainline Track (between stations) | null | null |
| First departure platform | null | required |
| Final arrival platform | required | null |
| Pass-through platform | optional | optional |
| Other platform | required | required |

Pass-through platforms use `optional` because passing time may affect other trains' schedules at that station.

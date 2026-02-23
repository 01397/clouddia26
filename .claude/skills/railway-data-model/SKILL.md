---
name: railway-data-model
description: Core data model for the railway diagram editor. Use when implementing or modifying features involving tracks, stations, trains, timetables, track connections, TrackTime null rules, DiagramView, or file serialization/deserialization (.rdia format).
---

# Railway Data Model

One railway network per `RailwayFile`. Track structure uses a graph model (Track = Node, TrackConnection = Edge). Trains use a two-layer model: TrainSegment (operational unit) and TrainService (passenger service unit).

## Basic Types

```typescript
type TimeOffset = number  // Seconds from 00:00:00. e.g. 14400 = 4:00, 86400 = 24:00
type Id = string
type Direction = 'outbound' | 'inbound'
type StopType = 'stop' | 'pass'
```

## Track Graph

```typescript
interface Track {
  id: Id
  name: string
  lineIds: Id[]        // Usually one line; boundary tracks for through service may belong to multiple
  stationId: Id | null // Platform tracks reference a station; mainline/connecting tracks are null
}

interface TrackConnection {
  id: Id
  fromTrackId: Id
  toTrackId: Id
}

interface Station {
  id: Id
  name: string
  kilometrage: number  // Distance from line start (km)
  trackIds: Id[]       // Platform Track IDs belonging to this station
}

interface RailwayLine {
  id: Id
  name: string
  trackIds: Id[]       // Track IDs belonging to this line
}
```

**Key design decisions:**
- Station IDs are derivable via `trackIds → Track.stationId`; `RailwayLine` stores only `trackIds`
- `Track.lineIds` is an array to support boundary tracks that belong to multiple lines in through service
- Track kind (platform/mainline/connecting) is derivable from TrackConnection topology; no separate `kind` field

For graph topology and MVP auto-generation: see [TRACK_GRAPH.md](TRACK_GRAPH.md)

## Train Model

```typescript
interface TrackTime {
  trackId: Id
  stopType: StopType
  entryTime: TimeOffset | null
  exitTime: TimeOffset | null
}

interface Destination {
  stationId: Id | null
  externalName: string | null
}

interface TrainSegment {
  id: Id
  number: string        // Operational identifier (e.g. "3001M")
  typeId: Id
  direction: Direction
  destination: Destination
  trackTimes: TrackTime[]
  note: string | null
}

interface TrainServiceSegmentRef {
  segmentId: Id
  connectionType: 'through' | 'split' | 'join'
}

interface TrainService {
  id: Id
  name: string | null    // Passenger-facing train name (e.g. "Hayabusa")
  number: string | null  // Passenger-facing ordinal (e.g. "No. 1")
  segmentRefs: TrainServiceSegmentRef[]
}
```

For split/join/through service patterns: see [TRAIN_MODEL.md](TRAIN_MODEL.md)

## TrackTime Null Rules

Enforced by validation:

| Track Type | entryTime | exitTime |
|---|---|---|
| Mainline Track (between stations) | null | null |
| First departure platform Track | null | required |
| Final arrival platform Track | required | null |
| Pass-through station platform Track | optional | optional |
| Other platform Track | required | required |

Pass-through platform tracks use `optional` because passing time may affect other trains' schedules at that station.

## Other Types

```typescript
interface TrainType {
  id: Id
  name: string       // e.g. "Express", "Local"
  shortName: string  // e.g. "Exp", "Loc"
  color: string      // CSS color
  lineStyle: 'solid' | 'dashed' | 'dotted'
  lineWidth: number
}

interface DiagramViewSection {
  lineId: Id
  stationIds: Id[]
  outboundName: string
  inboundName: string
}

interface DiagramView {
  id: Id
  name: string
  sections: DiagramViewSection[]
}

interface DiagramDisplaySettings {
  startTime: TimeOffset  // Default: 14400 (4:00)
  endTime: TimeOffset    // Default: 100800 (28:00)
}

interface FileMetadata {
  name: string
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
  version: string    // semver
}
```

## RailwayFile (Top-level)

The `.rdia` file structure — serialized directly as JSON:

```typescript
interface RailwayFile {
  metadata: FileMetadata
  lines: RailwayLine[]
  stations: Station[]
  tracks: Track[]
  connections: TrackConnection[]
  trainTypes: TrainType[]
  segments: TrainSegment[]
  services: TrainService[]
  diagramViews: DiagramView[]
  displaySettings: DiagramDisplaySettings
}
```

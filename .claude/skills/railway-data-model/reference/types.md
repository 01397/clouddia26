# TypeScript Type Definitions

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

## Train Operations

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

interface Schedule {
  id: Id
  name: string           // e.g. "Weekday", "Holiday"
  segments: TrainSegment[]
  services: TrainService[]
}
```

## Display & File

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

```typescript
interface RailwayFile {
  metadata: FileMetadata
  lines: RailwayLine[]
  stations: Station[]
  tracks: Track[]
  connections: TrackConnection[]
  trainTypes: TrainType[]
  schedules: Schedule[]
  diagramViews: DiagramView[]
  displaySettings: DiagramDisplaySettings
}
```

---
name: railway-data-model
description: Railway diagram editor core data model including Track graph topology, TrainSegment/TrainService separation, station/timetable types, TrackTime null rules, and RailwayFile structure. Use when implementing or modifying features involving tracks, stations, trains, timetables, segments, services, connections, TrackTime, time offsets, directions, stop types, destinations, DiagramView, or file serialization/deserialization (.rdia format).
---

# Railway Data Model

## Overview

1路線網を1ファイル（`RailwayFile`）で管理する。線路構造はグラフモデル（Track=Node, TrackConnection=Edge）で表現し、列車は運行単位（TrainSegment）とサービス単位（TrainService）の2層で管理する。

## Type Definitions

### Basic Types

```typescript
/** 秒オフセット（0:00:00 起点）。例: 14400 = 4:00, 86400 = 24:00 */
type TimeOffset = number

type Id = string

type Direction = 'outbound' | 'inbound'

type StopType = 'stop' | 'pass'
```

### Track Graph

Track/TrackConnectionの設計詳細は [TRACK_GRAPH.md](TRACK_GRAPH.md) を参照。

```typescript
interface Track {
  id: Id
  name: string
  /** 通常1路線に帰属。直通運転の境界Trackのみ複数 */
  lineIds: Id[]
  /** 番線Trackのみ駅を参照。駅間本線・連絡線はnull */
  stationId: Id | null
}

interface TrackConnection {
  id: Id
  fromTrackId: Id
  toTrackId: Id
}

interface Station {
  id: Id
  name: string
  /** キロ程（km）。路線始端からの距離 */
  kilometrage: number
  /** この駅に属する番線TrackのIDリスト */
  trackIds: Id[]
}

interface RailwayLine {
  id: Id
  name: string
  /** この路線に属するTrackのIDリスト */
  trackIds: Id[]
}
```

**設計判断:**
- `Track.kind` は持たない（TrackConnectionから導出可能、冗長排除）
- `RailwayLine.stationIds` は持たない（trackIds → Track.stationId から導出可能）
- `Track.lineIds` が配列な理由: 直通運転の境界Trackが複数路線に帰属するため

### Train Model

TrainSegment/TrainServiceの設計詳細は [TRAIN_MODEL.md](TRAIN_MODEL.md) を参照。

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
  number: string        // 業務識別子（例: "3001M"）
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
  name: string | null    // 旅客向け列車名（例: "はやぶさ"）
  number: string | null   // 旅客向け号数（例: "1号"）
  segmentRefs: TrainServiceSegmentRef[]
}
```

### TrackTime Null Rules

バリデーションで担保する。

| Track種別 | entryTime | exitTime |
|---|---|---|
| 駅間本線Track | null | null |
| 始発番線Track | null | 必須 |
| 終着番線Track | 必須 | null |
| 通過駅番線Track | optional | optional |
| その他の番線Track | 必須 | 必須 |

通過駅番線Trackのoptionalの理由: 通過待ちで他列車の発着が通過時刻に依存するケースがある。

### Other Types

```typescript
interface TrainType {
  id: Id
  name: string       // "特急", "準特急", "普通"
  shortName: string  // "特", "準特", "普"
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
  startTime: TimeOffset  // デフォルト: 14400 (4:00)
  endTime: TimeOffset    // デフォルト: 100800 (28:00)
}

interface FileMetadata {
  name: string
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
  version: string    // semver
}
```

### RailwayFile (Top-level)

`.rdia` ファイルの構造。このインターフェースをそのままJSONシリアライズする。

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

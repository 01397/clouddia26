# Display & File Types

## TrainType

Train category for timetable and diagram rendering. Color and line style are used when drawing train lines on the Canvas diagram.

```typescript
interface TrainType {
  id: Id
  name: string       // e.g. "Express", "Local"
  shortName: string  // e.g. "Exp", "Loc"
  color: string      // CSS color
  lineStyle: 'solid' | 'dashed' | 'dotted'
  lineWidth: number
}
```

## DiagramView

Display configuration defining which stations appear in the diagram. A DiagramView is independent of infrastructure definitions and can be modified without changing RailwayLine or Station data.

Each `DiagramViewSection` selects a subset of stations from one RailwayLine and defines the direction labels shown in the diagram.

```typescript
interface DiagramViewSection {
  lineId: Id
  stationIds: Id[]
  outboundName: string
  inboundName: string
}

interface DiagramView {
  id: Id
  name: string
  sections: DiagramViewSection[]  // Rendered top-to-bottom; multiple lines can be concatenated vertically
}
```

## DiagramDisplaySettings

Default time range for the diagram canvas. Applied to all DiagramViews in the file.

```typescript
interface DiagramDisplaySettings {
  startTime: TimeOffset  // Default: 14400 (4:00)
  endTime: TimeOffset    // Default: 100800 (28:00)
}
```

## FileMetadata

```typescript
interface FileMetadata {
  name: string
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
  version: string    // semver
}
```

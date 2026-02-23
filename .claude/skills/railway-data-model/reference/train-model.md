# Train Model (Schedule / TrainSegment / TrainService)

## Schedule Ownership

TrainSegment and TrainService are owned by `Schedule`, not by `RailwayFile` directly. Each Schedule represents one timetable variant (e.g. "Weekday", "Holiday"). `RailwayLine`, `Station`, and `TrainType` are shared across Schedules at the file level.

## Two-Layer Model

| Concept | Purpose | Identifier |
|---|---|---|
| TrainSegment | Unit for conflict detection and timetable display | Operational number (e.g. "3001M", "25M") |
| TrainService | Unit for passenger guidance and train flow | Passenger-facing name + ordinal (e.g. "Hayabusa No. 1") |

A single Train model cannot represent split/join operations, which is why the two-layer separation exists.

## Representing Split/Join

Multiple Services sharing the same Segment represent split/join operations.

### Example: Hayabusa + Komachi

```
TrainSegment A: number="3001M"  Tokyo → Morioka (coupled section)
TrainSegment B: number="3001M"  Morioka → Shin-Aomori
TrainSegment C: number="25M"    Morioka → Akita

TrainService "Hayabusa No. 1": [A(through) → B(split)]
TrainService "Komachi No. 1":  [A(through) → C(split)]
```

From Komachi's perspective, Segment A uses Hayabusa's train number "3001M" — this is correct because a different Service simply references the same Segment.

## Representing Through Service / Type Changes

A Service references multiple Segments in order, handling cases where train numbers or types change mid-route.

## connectionType Values

`TrainServiceSegmentRef.connectionType`:
- `through`: Through service or type change (same rolling stock continues)
- `split`: Split (detached from coupled train)
- `join`: Join (single train couples with another)

In the MVP, these are stored as reference information only. Validation and integration with operation models are future extensions.

## TrackTimes (Route)

A TrainSegment holds the tracks it travels through, in order, as `trackTimes: TrackTime[]`. The explicit list of visited tracks makes a separate "no intermediate stops" flag unnecessary.

## MVP Scope

- Both TrainService and TrainSegment are required from the start
- MVP functionality assumes 1:1 correspondence between Service and Segment
- Split/join and through service editing UI are deferred to post-MVP
- Boundary Station consistency validation details are determined during implementation

## Boundary Station Validation

For adjacent Segments within a Service:
- Final station of Segment A = First station of Segment B
- Final platform Track of Segment A and first platform Track of Segment B are identical or connected

For detailed ADR: `docs/adr/005-train-segment-service.md`

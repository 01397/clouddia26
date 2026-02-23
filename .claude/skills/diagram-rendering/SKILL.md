---
name: diagram-rendering
description: Canvas 2D rendering for railway diagram (train timetable graph) visualization. Use when implementing diagram views, rendering train lines (suji), hit testing for train segment interactions, coordinate transformations between TimeOffset/station indices and pixels, zoom/scroll functionality, or exporting diagram images.
---

# Diagram Rendering

## Rendering Approach

Canvas 2D handles the expected scale efficiently:
- ~1,500 trains × ~20 track segments = ~30,000 line segments
- ~100 station grid lines
- Dozens of time-axis tick marks

Canvas 2D achieves 60fps at this scale. For the rationale behind choosing Canvas 2D over SVG and WebGL, see `docs/adr/007-diagram-rendering.md`.

## Coordinate System

```typescript
interface DiagramViewport {
  startTime: TimeOffset    // Display start time
  endTime: TimeOffset      // Display end time
  pixelsPerSecond: number  // Zoom level
  pixelsPerStation: number
  offsetX: number          // Scroll offset
  offsetY: number
}

// Time → x coordinate
const timeToX = (time: TimeOffset, vp: DiagramViewport): number =>
  (time - vp.startTime) * vp.pixelsPerSecond + vp.offsetX

// x coordinate → time
const xToTime = (x: number, vp: DiagramViewport): TimeOffset =>
  (x - vp.offsetX) / vp.pixelsPerSecond + vp.startTime
```

- Horizontal axis: time (TimeOffset in seconds → px)
- Vertical axis: stations (index → px)

## Hit Testing

On click/drag start, identify the target TrainSegment from mouse coordinates using distance-to-line-segment calculation with a tolerance of a few pixels.

## Redraw Strategy

In the MVP, a single Canvas redraws the entire view on every frame.

Redraw triggers:
- Train time changes (edit operations)
- Scroll or zoom
- Selection state changes

## Post-MVP Optimizations

- Layer separation (background grid, train lines, selection highlight on separate canvases)
- OffscreenCanvas + Web Worker
- WebGL migration (if element count increases significantly)

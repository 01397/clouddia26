---
name: ui-testing-strategy
description: Testing strategy for the railway diagram editor. Use when writing or modifying tests — unit tests for pure functions, component interaction tests with Testing Library, Storybook stories for visual regression via Chromatic, or E2E tests with Playwright. Covers tool selection, file placement, and Canvas testing boundaries.
---

# UI Testing Strategy

## Test Layer Overview

| Layer | Target | Tool | When |
|---|---|---|---|
| Pure functions | Coordinate transforms, hit testing, time formatting | Vitest | Local + CI (every run) |
| React components | Interactions, state changes | Vitest + Testing Library | Local + CI (every run) |
| Canvas logic | Coordinate transforms, hit testing (extracted as pure functions) | Vitest | Local + CI (every run) |
| Visual regression | All Storybook stories | Chromatic | CI (on PR) |
| E2E | Core user flows (a few) | Playwright | CI (on PR) |
| Canvas render output | Manual visual inspection only | Storybook (manual) | — |

## Unit & Component Tests (Vitest + Testing Library)

Place test files alongside the source file:

```
src/utils/diagram/coordinate.ts
src/utils/diagram/coordinate.test.ts
```

### Pure Function Example

```typescript
// src/utils/diagram/coordinate.test.ts
describe('timeToX', () => {
  it('returns offsetX when time equals startTime', () => {
    const viewport = { startTime: 14400, pixelsPerSecond: 0.5, offsetX: 60 }
    expect(timeToX(14400, viewport)).toBe(60)
  })

  it('shifts right by pixelsPerSecond × elapsed seconds', () => {
    const viewport = { startTime: 14400, pixelsPerSecond: 0.5, offsetX: 60 }
    expect(timeToX(18000, viewport)).toBe(1860)  // 3600s × 0.5 + 60
  })
})
```

```typescript
// src/utils/diagram/hitTest.test.ts
describe('findSegmentAtPoint', () => {
  it('returns Segment within tolerance distance', () => { ... })
  it('returns null beyond tolerance distance', () => { ... })
  it('returns nearest Segment when multiple are close', () => { ... })
})
```

### Canvas Logic

Extract coordinate transforms and hit testing as pure functions and test with Vitest — no browser dependency required. Canvas pixel-level render output is covered by Storybook manual review only.

## Visual Regression (Chromatic)

Chromatic screenshots all Storybook stories and detects visual diffs on each PR. No additional test code required.

```bash
# Run in CI (GitHub Actions)
npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

## E2E Tests (Playwright)

MVP scope covers core user flows only:
- Create a new railway file, add stations and trains, and save
- Restore state from IndexedDB after page reload
- Export a file and re-import it

## Packages

```json
{
  "devDependencies": {
    "vitest": "^2.0",
    "@vitest/ui": "^2.0",
    "@testing-library/react": "^16.0",
    "@testing-library/user-event": "^14.0",
    "chromatic": "^11.0",
    "@playwright/test": "^1.40"
  }
}
```

For design decisions and evaluated alternatives: `docs/adr/009-ui-testing-strategy.md`

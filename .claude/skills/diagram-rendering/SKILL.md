---
name: diagram-rendering
description: Provides Canvas 2D rendering capabilities for visualizing railway diagrams (train timetable graphs). Use this skill for tasks such as implementing diagram views, rendering train lines (suji), performing hit testing for interactions with train segments, handling coordinate transformations between TimeOffset/station indices and pixel coordinates, managing zoom and scroll functionality, or exporting diagram images.
---

# Diagram Rendering

## 描画方式

Canvas 2D を使用。SVG（30,000 DOM要素でオーバーヘッド大）・WebGL（この規模では過剰）は却下済み。

### スケール

- 列車1,500本 × 平均20駅間 = 約30,000本の線分
- 駅グリッド線: 約100本
- 時間軸目盛り: 数十本

Canvas 2Dで60fps描画が十分可能な規模。

## 座標系

```typescript
interface DiagramViewport {
  startTime: TimeOffset   // 表示起点時刻
  endTime: TimeOffset     // 表示終点時刻
  pixelsPerSecond: number // ズームレベル
  pixelsPerStation: number
  offsetX: number         // スクロールオフセット
  offsetY: number
}

// 時刻 → x座標
const timeToX = (time: TimeOffset, vp: DiagramViewport): number =>
  (time - vp.startTime) * vp.pixelsPerSecond + vp.offsetX

// x座標 → 時刻
const xToTime = (x: number, vp: DiagramViewport): TimeOffset =>
  (x - vp.offsetX) / vp.pixelsPerSecond + vp.startTime
```

- 横軸: 時間（TimeOffset秒 → px）
- 縦軸: 駅（インデックス → px）

## Hit Testing

クリック・ドラッグ開始時にマウス座標から対象TrainSegmentを特定する。線分との距離判定（許容誤差: 数px）で実装。

## 再描画戦略

MVPでは単一Canvasで毎フレーム全体を再描画する。

再描画トリガー:
- 列車の時刻変更（編集操作）
- スクロール・ズーム
- 選択状態の変更

## 将来の最適化（MVP対象外）

- レイヤー分割（背景グリッド・列車線・選択ハイライトを別Canvas）
- OffscreenCanvas + Web Worker
- WebGL移行（描画要素数が大幅増加した場合）

詳細な経緯: `docs/adr/007-diagram-rendering.md`

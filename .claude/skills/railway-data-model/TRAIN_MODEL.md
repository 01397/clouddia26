# Train Model (TrainSegment / TrainService)

## 2層モデルの概要

| 概念 | 用途 | 識別子 |
|---|---|---|
| TrainSegment | 追い越し検知・時刻表表示の単位 | 業務識別子（例: "3001M"） |
| TrainService | 列車の流れ・旅客案内の単位 | 旅客向け列車名・号数（例: "はやぶさ1号"） |

単一の Train モデルでは分割併合を表現できないため分離している。

## 分割併合の表現

1つのSegmentを複数のServiceが共有することで表現する。

### 例: はやぶさ+こまち

```
TrainSegment A: number="3001M"  東京→盛岡（併結区間）
TrainSegment B: number="3001M"  盛岡→新青森
TrainSegment C: number="25M"    盛岡→秋田

TrainService「はやぶさ1号」: [A(through) → B(split)]
TrainService「こまち1号」:   [A(through) → C(split)]
```

こまち視点でSegment Aの列車番号は"3001M"（はやぶさ番号）だが、Serviceが異なるSegmentを参照しているだけであり整合性上問題ない。

## 直通・種別変更の表現

Serviceが複数Segmentを順序付きで参照することで表現する。途中で列車番号や種別が変わるケースに対応。

## connectionType

`TrainServiceSegmentRef.connectionType` の値:
- `through`: 直通・種別変更（同一編成が継続）
- `split`: 分割（併結列車から切り離し）
- `join`: 併合（単独列車が併結）

MVPでは参照情報として保持のみ。バリデーションや行路モデルとの連携は将来拡張。

## TrackTimes（走行経路）

TrainSegmentは走行したTrackを `trackTimes: TrackTime[]` として走行順に持つ。OuDia的な「経由なし」フラグは不要（どのTrackを通ったかが明示されるため）。

## MVP方針

- TrainServiceとTrainSegmentは両方必須
- MVPでは1:1対応を前提とした機能のみ提供
- 分割併合・直通の編集UIは将来拡張で解放
- Service内の境界Station整合性バリデーションは実装フェーズで詳細決定

## 境界Stationのバリデーション方針

Service内で隣接するSegment間の整合性:
- Segment Aの終着駅 = Segment Bの始発駅
- Segment Aの終着番線Track と Segment Bの始発番線Trackが同一または接続関係にある

詳細な経緯: `docs/adr/005-train-segment-service.md`

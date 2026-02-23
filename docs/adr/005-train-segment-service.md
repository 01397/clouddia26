# ADR-005: 列車モデルの設計（TrainSegment / TrainService）

**日付**: 2026-02-22
**ステータス**: Accepted

---

## コンテキスト

鉄道ダイヤエディタでは、以下の複雑な列車運行パターンを表現する必要がある。

- **分割併合**: 東京発はやぶさ+こまちは盛岡で分割。併結区間はどちらかの列車番号で管理される
- **途中駅での列車情報変更**: 種別変更・直通による会社跨ぎ。通常列車番号が変わる
- **将来拡張**: 行路（車両運用）モデルで「別列車か継続運転か」を明示できる構造

単一の `Train` モデルではこれらを表現できない。

---

## 検討した選択肢

### 案A: 単一Trainモデルで区間ごとに属性を変更

1本のTrainが途中で種別・番号を変えられるよう、属性をリスト構造で持つ。

- Pros: モデルが1つでシンプル
- Cons: 分割併合（1区間を複数列車が共有）を表現できない。モデルが複雑化する

**却下。**

### 案B: TrainSegment / TrainService の2層モデル ✅

運行単位（TrainSegment）とサービス単位（TrainService）を分離する。

- Pros: 分割併合・直通・種別変更をすべて表現できる。各Segmentは純粋な走行データとして独立
- Cons: モデルが2層になる

**採用。**

---

## 決定事項

### TrainSegment（運行単位）

追い越し検知・時刻表表示の単位。業務識別子としての列車番号を持つ。他のSegmentを直接参照しない。

### TrainService（サービス単位）

旅客向けの列車名・号数を持ち、複数のTrainSegmentを順序付きでリンクする。分割併合では1つのSegmentを複数のServiceが共有できる。

### 分割併合の表現例（はやぶさ+こまち）

```
TrainSegment A: number="3001M"  東京→盛岡
TrainSegment B: number="3001M"  盛岡→新青森
TrainSegment C: number="25M"    盛岡→秋田

TrainService「はやぶさ1号」: [A(through) → B(split)]
TrainService「こまち1号」:   [A(through) → C(split)]
```

### 列車番号の帰属

列車番号（業務識別子）はTrainSegmentに、旅客向け列車名・号数はTrainServiceに持たせる。こまち視点でSegment Aの番号が"3001M"であることは、Serviceが異なるSegmentを参照しているだけであり整合性上問題ない。

### connectionType

`through`（直通・種別変更）、`split`（分割）、`join`（併合）の3値。MVPでは参照情報として保持のみ。

---

## 境界Station/Trackのバリデーション方針

Service内で隣接するSegmentの境界:
- Segment Aの終着駅 = Segment Bの始発駅
- Segment Aの終着番線Track と Segment Bの始発番線Trackが同一または接続関係にある

MVPではバリデーションの実装を含め、詳細は実装フェーズで決定する。

---

## MVP方針

- TrainServiceとTrainSegmentは両方必須
- MVPでは1:1対応を前提とした機能提供のみ
- 分割併合・直通の編集UIは将来拡張で解放

---

## 結果

**ポジティブ**: 分割併合・直通・種別変更を統一構造で表現、TrainSegmentが純粋な走行データとして独立、将来の行路モデルへの拡張パスが明確

**ネガティブ**: 2層モデルのためシンプルな路線でもService定義が必要、Segment-Service間の整合性バリデーションが必要

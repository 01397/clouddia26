---
name: railway-domain
description: Japanese railway domain glossary mapping Japanese concepts to English type names and identifiers. Use when naming variables, types, interfaces, functions, or components related to railway concepts such as train types, track structures, timetables, operations, stations, diagrams, or any railway-specific terminology.
---

# Railway Domain Glossary

## Infrastructure

| 日本語 | English Identifier | 説明 |
|--------|-------------------|------|
| 路線 | `RailwayLine` | 物理インフラの管理単位 |
| 駅 | `Station` | 旅客が乗降する施設 |
| 線路・番線 | `Track` | 駅間本線・番線・連絡線の統一表現 |
| 線路接続 | `TrackConnection` | Track間の有向接続 |
| キロ程 | `kilometrage` | 路線始端からの距離（km） |
| 複線 | double track | 上下線が別の線路を走る区間 |
| 単線 | single track | 上下線が同じ線路を共有する区間 |
| 複々線 | quadruple track | 急行線・緩行線など4本の線路がある区間 |
| 連絡線 | connecting track | 別路線への乗り入れ経路 |
| 信号場 | signal station | 番線を持たない通過ポイント |

## Train Operations

| 日本語 | English Identifier | 説明 |
|--------|-------------------|------|
| 列車種別 | `TrainType` | 急行・普通などの分類。色・線種を持つ |
| 列車番号 | `TrainSegment.number` | 業務識別子（例: "3001M", "25M"） |
| 列車名 | `TrainService.name` | 旅客向け愛称（例: "はやぶさ"） |
| 号数 | `TrainService.number` | 旅客向け号数（例: "1号"） |
| 上り | `inbound` | 起点方面への運行 |
| 下り | `outbound` | 終点方面への運行 |
| 停車 | `stop` | StopType。駅に停まる |
| 通過 | `pass` | StopType。駅を通過する |
| 行先 | `Destination` | 列車の終着駅 |
| 直通運転 | through service | 路線をまたいで連続運行 |
| 分割 | `split` | 併結列車の切り離し |
| 併合（併結） | `join` | 別列車の連結 |

## Timetable & Diagram

| 日本語 | English Identifier | 説明 |
|--------|-------------------|------|
| ダイヤグラム | diagram | 時間×駅の2次元グラフ |
| スジ | train line (in diagram) | ダイヤグラム上の列車を表す線 |
| 時刻表 | timetable | 駅別・列車別の発着時刻一覧 |
| 着時刻 | `entryTime` | 駅への到着時刻（TrackTime） |
| 発時刻 | `exitTime` | 駅からの出発時刻（TrackTime） |
| 表示起点 | `startTime` | ダイヤグラムの表示開始時刻。デフォルト4:00 |

## Service & Operations

| 日本語 | English Identifier | 説明 |
|--------|-------------------|------|
| 運行単位 | `TrainSegment` | 追い越し検知・時刻表表示の単位 |
| サービス単位 | `TrainService` | 旅客案内の単位。Segmentをリンク |
| 運用（行路） | Operation (将来) | 車両単位の1日の運用計画 |
| 経路ビュー | `DiagramView` | 表示用の駅列定義 |

## File

| 日本語 | English Identifier | 説明 |
|--------|-------------------|------|
| 路線ファイル | `RailwayFile` | 1路線網を1ファイルで管理 |
| ファイル拡張子 | `.rdia` | Railway Diagram の略 |

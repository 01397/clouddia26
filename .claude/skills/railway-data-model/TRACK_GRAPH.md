# Track Graph Model

## グラフ構造

駅構内番線・駅間本線・連絡線をすべて `Track`（Node）で統一表現し、`TrackConnection`（Edge）で有向接続を管理する。

この統一モデルにより、以下を追加概念なしに表現できる:
- 複々線（急行線・緩行線）
- 駅構内の番線
- 分岐・連絡線
- 信号場
- 駅間に複数路線を経由するケース

## MVP実装方針

MVPではユーザーに「複線/単線」の設定のみを入力させ、TrackとTrackConnectionを自動生成する。グラフ構造をユーザーに意識させない。

### 自動生成例（複線）

入力: 代々木上原 → 東北沢（複線）

```
自動生成されるTrack:
  - 代々木上原〜東北沢（下り本線）  lineIds: [小田急小田原線]
  - 代々木上原〜東北沢（上り本線）  lineIds: [小田急小田原線]
  - 代々木上原・1番線              stationId: 代々木上原
  - 代々木上原・2番線              stationId: 代々木上原

自動生成されるTrackConnection:
  - 代々木上原1番線 → 下り本線
  - 上り本線 → 代々木上原2番線
  - （以下同様に東北沢側も生成）
```

## RailwayLine の責務

RailwayLineは物理インフラの管理単位:
- Trackを路線単位でグループ管理する入れ物
- 連続区間の重複は許容しない（境界Track/Stationの共有のみ）
- 湘南新宿ラインのような運転系統はRailwayLineではなく将来の系統モデルで表現する

RailwayLineとDiagramViewの責務は明確に分離されている。DiagramViewは表示設定であり、インフラ定義とは独立して柔軟に変更できる。

## 駅時刻の取得方法

「ある駅での着発時刻」は TrainSegment.trackTimes から `trackId → Track.stationId` を辿って取得する。StationTimeのような別モデルは持たない（時刻情報の二重管理を避けるため）。

MVPではクエリコストを許容し、将来的にキャッシュで最適化する。

## MVPで先送りにする機能

- 番線の明示的な入力・編集UI
- 複々線・連絡線・信号場の入力UI
- Track間の進入可否ルール（TrackConnectionへの制約付与）
- 競合検出（追い越し・すれ違い違反）
- `trackId → Station` 逆引きキャッシュ

詳細な経緯: `docs/adr/004-track-graph-model.md`

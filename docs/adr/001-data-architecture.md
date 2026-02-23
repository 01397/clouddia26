# ADR-001: データ処理アーキテクチャの全体方針

**日付**: 2026-02-21
**ステータス**: Accepted

---

## コンテキスト

複雑なデータモデル（駅、列車、時刻表、運用グループ）を扱うWebアプリケーションにおいて、データ保持・処理の方針を決定する必要がある。

スケール要件:
- 列車数: 3,000（同時表示 最大1,500）
- 駅数: 100
- 想定デバイス: iPhone 17 (A19), MacBook Air (M4)

---

## 検討した選択肢

20以上のアプローチを検討し、以下3つのカテゴリに整理した。

**A群: データ保持場所**
1. メモリ (JSON)
2. IndexedDB
3. SQLite WASM
4. FileSystem Access API

**B群: 状態管理パターン**
1. Class-based OOP
2. Immutable + State Management
3. Event Sourcing
4. Proxy-based Reactive

**C群: 高度な機能**
1. CRDT（共同編集）
2. Web Worker（並列処理）
3. Virtual DOM的アプローチ（仮想化）

---

## 決定事項

```
メモリ(Immutable State) + IndexedDB(バックアップ) + 仮想化
├─ 状態管理: Zustand + Immer（メモリ上で完結）
├─ 永続化: idb-keyval（JSON丸ごと保存）
├─ 描画: react-window（仮想スクロール）
└─ 将来拡張: WebSocket（共同編集）
```

### 永続化戦略

- `idb-keyval`（~600 bytes）で単一キーに全状態をJSON保存
- Zustand persistミドルウェアによる自動保存・復元
- Key-Value的な細かい管理は不要
- データサイズ: 3,000列車で約5MB（IndexedDBの制限内で余裕）

---

## 理論的根拠

**メモリ + IndexedDB分離**: 状態管理と永続化が独立し、アーキテクチャがシンプルになる。IndexedDBは純粋なバックアップであり、アプリケーション動作中の状態管理には関与しない。

**仮想化**: 1,500列車の同時表示には必須。react-windowで表示領域のみレンダリング。

---

## 却下した選択肢とその理由

| 選択肢 | 却下理由 |
|--------|---------|
| SQLite WASM | 初期化コスト（数百ms）とメモリオーバーヘッド（2-3MB）が不要 |
| FileSystem Access API | 共同編集への拡張困難、ブラウザサポート限定的 |
| Event Sourcing | 規模に対して過剰、初期ロードがボトルネック |
| CRDT | 共同編集が低優先度のため現時点では不要 |

---

## 優先度

| 要件 | 重要度 | 対応方針 |
|-----|-------|---------|
| オフライン対応 | 高 | IndexedDB永続化 |
| パフォーマンス | 中 | メモリ操作 + 仮想化 |
| Undo/Redo | 中 | Zustand middleware (zundo) |
| 共同編集 | 低 | 将来拡張（WebSocket想定） |
| OuDia互換 | 低 | 独自データストア許容 |

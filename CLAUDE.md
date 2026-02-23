# Railway Diagram Editor

鉄道ダイヤグラムエディタ（Web SPA）。架空鉄道の時刻表・ダイヤグラムを作成するツール。

## Tech Stack

- Vite + React + TypeScript
- pnpm（パッケージマネージャ）
- Zustand + Immer（状態管理）
- Canvas 2D（ダイヤグラム描画）
- CSS Modules + clsx（スタイリング）
- @base-ui-components/react（ヘッドレスUIライブラリ）
- Storybook 8（コンポーネントカタログ）

初期段階では破壊的変更が多く見込まれるため、導入を必須とせず効果が高い場合に限り採用

- idb-keyval（IndexedDBバックアップ）
- zundo（Undo/Redo）
- react-window（仮想スクロール）
- Vitest + @testing-library/react（ユニット・コンポーネントテスト）
- Playwright（E2Eテスト）
- Chromatic（ビジュアルリグレッションテスト）

## Core Concepts

- **Track**: 駅間本線・番線・連絡線の統一モデル（グラフのNode）
- **TrackConnection**: Track間の有向接続（グラフのEdge）
- **TrainSegment**: 運行単位。列車番号・時刻・走行経路を持つ
- **TrainService**: サービス単位。複数Segmentをリンクし列車名を持つ
- **DiagramView**: 表示用の駅列定義。複数路線を縦に連結できる

## Conventions

- 時刻: 0:00:00起点の秒オフセット（integer）。例: 14400 = 4:00
- ID: string型
- ファイル形式: `.rdia`（RailwayFileインターフェースのJSONシリアライズ）
- 状態管理: Zustandストアがメモリ上で完結。IndexedDBはバックアップのみ
- ビュー管理: 状態駆動（URLルーティング不要）

## Architecture Decisions

設計判断の詳細な経緯は `docs/adr/` に記録されている。
**設計変更を提案する前に、関連するADRを必ず確認すること。**
既に検討・却下された案が記録されている。

| ADR | 概要 |
|-----|------|
| ADR-001 | データ処理アーキテクチャ（メモリ + IndexedDB + 仮想化） |
| ADR-002 | 状態管理（Zustand + Immer） |
| ADR-003 | プロジェクト構成（React + Vite） |
| ADR-004 | 線路グラフモデル（Track/TrackConnection） |
| ADR-005 | 列車モデル（TrainSegment/TrainService分離） |
| ADR-006 | ファイルフォーマット（JSON, .rdia） |
| ADR-007 | ダイヤグラム描画（Canvas 2D） |
| ADR-008 | UIコンポーネントとスタイリング（CSS Modules + Base UI + Storybook） |
| ADR-009 | UIテスト戦略（Vitest + Chromatic + Playwright） |

## Project Structure

```
src/
├── components/
│   ├── diagram/        # ダイヤグラムビュー（Canvas）
│   ├── timetable/      # 時刻表ビュー
│   ├── operations/     # 運用表ビュー
│   └── common/         # 共通コンポーネント
├── stores/             # Zustand stores
├── types/              # TypeScript型定義
└── utils/              # ユーティリティ
```

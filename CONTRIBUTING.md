# Contributing Guide

このドキュメントは、`clouddia26` での開発時に使う **ブランチ戦略** と **コミットメッセージ規約** を定義します。

## 1. ブランチ戦略

### 基本方針

- `main` は常にデプロイ可能な状態を保つ。
- 日々の開発は `main` から分岐したトピックブランチで行う。
- 変更は Pull Request（PR）で `main` に取り込む。

### ブランチ種別

- `feature/<short-description>`
  - 新機能開発。
  - 例: `feature/add-station-editor`
- `fix/<short-description>`
  - バグ修正。
  - 例: `fix/diagram-grid-overflow`
- `chore/<short-description>`
  - 依存更新・設定変更・リファクタリングなど。
  - 例: `chore/update-oxlint-config`
- `docs/<short-description>`
  - ドキュメントのみの変更。
  - 例: `docs/add-branching-policy`

### 運用ルール

- ブランチは1つの目的に絞る（機能追加と無関係な整形を混ぜない）。
- 長寿命ブランチは避け、短いサイクルでPRを作る。
- PR作成前に `main` を取り込み、コンフリクトを解消する。
  - 推奨: `git rebase origin/main`
- マージ方式は原則 **Squash and merge**（履歴を読みやすく保つため）。

## 2. コミットメッセージ規約

### 形式

以下の Conventional Commits 形式を採用します。

```text
type(scope): summary
```

- `type`: 変更の種類（必須）
- `scope`: 変更対象（任意）
- `summary`: 1行要約（必須）

### type の一覧

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `refactor`: 振る舞いを変えないコード整理
- `test`: テスト追加・修正
- `chore`: 雑務（依存更新、CI設定、ツール更新など）

### 記述ルール

- `summary` は命令形で簡潔に書く。
- 先頭は小文字で開始する（`feat:` など）。
- 可能であれば 72 文字以内。
- 必要なら空行を入れて本文に背景・影響範囲を追記する。

### 例

```text
feat(editor): add train line drag interaction
fix(timetable): prevent NaN when station list is empty
docs(contributing): document branch strategy and commit conventions
chore(deps): bump vite to latest patch
```

## 3. PR作成時のチェック（推奨）

- `pnpm lint`
- `pnpm build`

加えて、UI変更がある場合はスクリーンショットを添付して、意図した表示になっていることを確認してください。

---
name: ui-testing-strategy
description: Testing strategy for the railway diagram editor. Use when writing or modifying tests—unit tests for pure functions, component interaction tests with Testing Library, Storybook stories for visual regression via Chromatic, or E2E tests with Playwright. Covers what to test with which tool, file placement, and Canvas testing boundaries.
---

# UI Testing Strategy

## Overview

```
           [E2E]
        Playwright
     コアフロー数本のみ
    ─────────────────────
      [ビジュアルリグレッション]
           Chromatic
        Storiesが自動でテスト対象
    ─────────────────────────────
         [ユニット・コンポーネント]
         Vitest + Testing Library
       純粋関数・コンポーネント動作
```

## テスト対象の分担

| レイヤー | テスト対象 | ツール | 実行タイミング |
|---|---|---|---|
| 純粋関数 | 座標変換・hitテスト・時刻フォーマット等 | Vitest | ローカル + CI（毎回） |
| Reactコンポーネント | インタラクション・状態変化 | Vitest + Testing Library | ローカル + CI（毎回） |
| ビジュアル差分 | StorybookのStories全件 | Chromatic | CI（PR時） |
| E2E | コアユーザーフロー（数本） | Playwright | CI（PR時） |
| Canvasロジック | 座標変換・hitテスト（純粋関数として切り出し） | Vitest | ローカル + CI（毎回） |
| Canvas描画結果 | 目視確認のみ（自動テスト対象外） | Storybook（手動） | — |

## 1. ユニット・コンポーネントテスト: Vitest + Testing Library

### ファイル配置

テストファイルはテスト対象と同階層に置く。

```
src/utils/diagram/coordinate.ts
src/utils/diagram/coordinate.test.ts
```

### 純粋関数の例

```typescript
// src/utils/diagram/coordinate.test.ts
describe('timeToX', () => {
  it('表示起点時刻はoffsetXと一致する', () => {
    const viewport = { startTime: 14400, pixelsPerSecond: 0.5, offsetX: 60 }
    expect(timeToX(14400, viewport)).toBe(60)
  })

  it('1時間後（3600秒後）は pixelsPerSecond × 3600 分だけ右にずれる', () => {
    const viewport = { startTime: 14400, pixelsPerSecond: 0.5, offsetX: 60 }
    expect(timeToX(18000, viewport)).toBe(1860)
  })
})
```

```typescript
// src/utils/diagram/hitTest.test.ts
describe('findSegmentAtPoint', () => {
  it('許容誤差内の座標でSegmentを返す', () => { ... })
  it('許容誤差外の座標でnullを返す', () => { ... })
  it('複数Segmentが近接する場合、最も近いものを返す', () => { ... })
})
```

### Canvas ロジックの扱い

Canvas描画結果（ピクセル単位）は自動テスト対象外。座標変換・hitテスト等のコアロジックは**Pure Functionとして切り出し**、ブラウザ依存なしにVitestでテストする。

## 2. ビジュアルリグレッション: Chromatic

StorybookのStories全件のスクリーンショットをPR単位でビジュアル差分検出する。追加のテストコードは不要。

```bash
# CI（GitHub Actions）でのChromatic実行
npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

## 3. E2E: Playwright

MVPフェーズでは対象をコアユーザーフローのみに絞る。

**MVP対象フロー（例）:**

- 路線ファイルを新規作成し、駅と列車を追加して保存できる
- ページリロード後にIndexedDBから状態が復元される
- ファイルをエクスポートし、再インポートできる

## 採用パッケージ

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

## 却下済みの選択肢

- **Jest**: Vite環境での設定（babel-jest等）コストが高い
- **Storybook Interaction Tests（PlayFunction）**: CIでPlaywright依存とStorybook起動が必要になり重い
- **ローカルスクリーンショット比較（reg-suit等）**: ストレージ・差分レポートサーバーの運用コストが過剰
- **Playwright の `toHaveScreenshot`**: ページ単位の比較でコンポーネント単位の差分検出に不向き
- **Cypress**: TypeScriptサポート・Vite統合・マルチブラウザ対応でPlaywrightが優れる

詳細な経緯: `docs/adr/009-ui-testing-strategy.md`

# ADR-009: UIテスト戦略

**日付**: 2026-02-23
**ステータス**: Accepted

---

## コンテキスト

鉄道ダイヤグラムエディタのUIは性質が異なる2種類のコンポーネントで構成される。

- **通常のReactコンポーネント**: Button、Input、モーダル、時刻入力フォームなど
- **Canvasダイヤグラム**: 座標変換・hitテスト・描画ロジックを持つ命令的な描画

この2種類でテストの適切な手法が異なるため、それぞれに対してテスト戦略を決定する必要がある。

以下の方針のもとで選定を行う。

- 技術スタックはVite + React + TypeScriptで確定している（ADR-003）
- 個人〜小規模チームでの運用を想定し、CI/CD管理コストを最小化したい
- MVPフェーズではテストの費用対効果を優先する

---

## 決定事項

### テストの全体像

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

---

### 1. ユニット・コンポーネントテスト: Vitest + Testing Library

**Vitest + @testing-library/react を採用する。**

**対象:**

- 純粋関数（座標変換・hitテスト・時刻フォーマット等）
- Reactコンポーネントのインタラクション（クリック・入力・状態変化）

**採用理由:**

Viteスタックと統合済みであり、追加設定コストが最小。JestベースのAPIと互換性があるため移行コストも低い。

**Jestを採用しなかった理由:**

Vite環境でのJest設定（babel-jest等）は相性が悪くコストが高い。Vitestは同等の機能をViteネイティブに提供する。

**実装例（純粋関数）:**

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

**Storybook Interaction Tests（PlayFunction）を採用しなかった理由:**

CIでの実行にPlaywright依存が生じ、Storybook自体の起動も必要になる。シンプルなコンポーネントテストはVitestで完結させる方が軽量。

### 2. ビジュアルリグレッションテスト: Chromatic

**Chromatic を採用する。**

Storybookの各Storyのスクリーンショットを撮影してPR単位でビジュアル差分を検出する。

**採用理由:**

- Storybookと完全統合されており、追加のテストコードが不要
- PRのGitHub Checks上でdiffを視覚的に確認・承認できる
- 個人・小規模チームには無料枠（5,000スナップショット/月）で十分

**ローカルスクリーンショット比較（reg-suit等）を採用しなかった理由:**

スクリーンショットのストレージ管理・差分レポートサーバーの運用コストが個人プロジェクトには過剰。Chromaticはその全てをSaaSとして提供する。

**Playwrightのビジュアル比較（`toHaveScreenshot`）を採用しなかった理由:**

ページ単位での比較となりコンポーネント単位の差分検出に向かない。Storybookとの統合がない分、管理単位が粗くなる。

**運用:**

```bash
# CI（GitHub Actions）でのChromatic実行
npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

### 3. E2Eテスト: Playwright

**Playwright を採用する。**

MVPフェーズでは対象を絞り、コアのユーザーフローのみをカバーする。

**MVP対象フロー（例）:**

- 路線ファイルを新規作成し、駅と列車を追加して保存できる
- ページリロード後にIndexedDBから状態が復元される
- ファイルをエクスポートし、再インポートできる

**CypressではなくPlaywrightを採用した理由:**

- TypeScriptのファーストクラスサポート
- Viteとの統合が良好（`@playwright/test` のみで完結）
- 複数ブラウザ対応（Chrome/Firefox/Safari）が標準搭載
- CIでの実行速度が速い

---

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

---

## テスト対象の分担まとめ

| レイヤー | テスト対象 | ツール | 実行タイミング |
|---|---|---|---|
| 純粋関数 | 座標変換・hitテスト・時刻フォーマット等 | Vitest | ローカル + CI（毎回） |
| Reactコンポーネント | インタラクション・状態変化 | Vitest + Testing Library | ローカル + CI（毎回） |
| ビジュアル差分 | StorybookのStories全件 | Chromatic | CI（PR時） |
| E2E | コアユーザーフロー（数本） | Playwright | CI（PR時） |
| Canvasロジック | 座標変換・hitテスト（純粋関数として切り出し） | Vitest | ローカル + CI（毎回） |
| Canvas描画結果 | 目視確認のみ（自動テスト対象外） | Storybook（手動） | — |

---

## 結果

**ポジティブ:**

- VitestはViteスタックと統合済みで追加設定コストが最小
- CanvasロジックをPure Functionとして切り出すことで、ブラウザ依存なしにテストできる
- Chromaticによりストーリー単位のビジュアルリグレッションがPRフローに自然に組み込まれる
- PlaywrightによりE2Eを最小限のコストで担保できる

**ネガティブ:**

- Canvas描画結果の自動テストは行わない。ピクセル単位の描画バグは目視確認に依存する
- Chromaticは外部SaaSへの依存となる（無料枠超過時は課金が発生する）

---

## 未決事項（実装フェーズで決定）

- GitHub Actionsのワークフロー設計（Chromatic・Playwrightのジョブ分割方針）
- Playwrightのテストデータ管理（テスト用`.cdia`ファイルのfixture配置）
- Vitestのカバレッジレポート設定とカバレッジ目標の設定
- Canvas描画のビジュアルテスト自動化の将来的な検討（OffscreenCanvas + スナップショット比較）

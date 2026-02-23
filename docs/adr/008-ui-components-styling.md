# ADR-008: UIコンポーネントとスタイリング設計

**日付**: 2026-02-23
**ステータス**: Accepted

---

## コンテキスト

鉄道ダイヤグラムエディタのUI実装にあたり、スタイリング方式・コンポーネント設計・デザイントークン管理・コンポーネントカタログの方針を決定する必要がある。

以下の要件・制約のもとで選定を行う。

- MUIのような「厚い」UIフレームワークは避け、スタイルを自前で管理したい
- アクセシビリティ（WAI-ARIA、キーボード操作）はライブラリに委譲したい
- Canvasダイヤグラムとスタイル値（色など）を共有する仕組みが必要
- コーディングエージェント（Claude Code等）との相性も考慮する
- Storybookによるコンポーネントの独立開発・視覚的確認環境を整備したい

---

## 決定事項

### 1. スタイリング方式: CSS Modules

**CSS Modules を採用する。**

**却下した選択肢:**

- **Tailwind CSS**: AIエージェントとの相性はJSXに情報が集約される点で優れるが、`data-state`属性への対応でクラス名が長くなりがち。このアプリのように多状態なアプリケーションUIでは保守性が低下するリスクがある
- **CSS-in-JS（styled-components等）**: ランタイムコストが発生する。このアプリはパフォーマンス要件があるため除外
- **素のCSS**: グローバルスコープによる命名衝突リスクがあり、規模が大きくなるにつれて管理が困難になる

**CSS Modulesを採用した理由:**

- コンポーネントスコープが自動で付与され、命名衝突が発生しない
- CSS変数（デザイントークン）との親和性が高い
- `[data-state="open"]` などのBase UI属性セレクタを自然な記法で扱える
- 既存のCSS知識がそのまま活きる

**ファイル配置**: コンポーネントと同階層に置く

```
src/components/
  common/
    Button/
      Button.tsx
      Button.module.css
      index.ts
    Input/
      ...
  diagram/
    TrainLine/
      TrainLine.tsx
      TrainLine.module.css
```

**命名規則**: コンポーネントスコープを前提にシンプルに保つ。BEM記法は不要

```css
/* Button.module.css */
.root { }       /* ルート要素 */
.primary { }    /* バリアント */
.disabled { }   /* 状態 */
```

```tsx
// Button.tsx
import styles from './Button.module.css'
import clsx from 'clsx'

<button className={clsx(styles.root, styles[variant], {
  [styles.disabled]: disabled,
})} />
```

### 2. ヘッドレスUIライブラリ: Base UI

**Base UI（@base-ui-components/react）を採用する。**

アクセシビリティ（WAI-ARIA）・キーボード操作・フォーカス管理・`data-state`属性の付与をライブラリに委譲し、スタイルは完全に自前で管理する。

**Base UIとCSS Modulesの組み合わせ例:**

```css
/* Popover.module.css */
.trigger[data-popup-open] {
  background: var(--color-surface-hover);
}

.popup[data-open] {
  opacity: 1;
}

.popup[data-closed] {
  opacity: 0;
}

[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
```

**Radix UIを採用しなかった理由:**

Base UIはMUIチームが開発するより後発のライブラリであり、CSS Modulesとの統合が設計レベルで考慮されている。APIの一貫性も高く、長期的なメンテナンスへの信頼性も十分と判断した。

### 3. デザイントークン管理: CSS変数

**CSS変数でトークンを定義し、Canvasダイヤグラム描画値との共有を可能にする。**

```css
/* src/styles/tokens.css（グローバルに読み込む） */
:root {
  /* Color */
  --color-primary:          #1a56db;
  --color-surface:          #ffffff;
  --color-surface-hover:    #f3f4f6;
  --color-surface-overlay:  #f9fafb;
  --color-border:           #e5e7eb;
  --color-text-primary:     #111827;
  --color-text-secondary:   #6b7280;
  --color-text-disabled:    #9ca3af;

  /* Spacing (4px base) */
  --spacing-1:  4px;
  --spacing-2:  8px;
  --spacing-3:  12px;
  --spacing-4:  16px;
  --spacing-6:  24px;
  --spacing-8:  32px;

  /* Typography */
  --font-size-xs:       11px;
  --font-size-sm:       12px;
  --font-size-base:     14px;
  --font-size-lg:       16px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold:   700;

  /* Border */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* Z-index */
  --z-dropdown: 100;
  --z-modal:    200;
  --z-toast:    300;
}
```

**Canvasダイヤグラム側からのCSS変数参照:**

```typescript
// src/utils/designTokens.ts
const style = getComputedStyle(document.documentElement)

export const tokens = {
  colorBorder:       style.getPropertyValue('--color-border').trim(),
  colorTextPrimary:  style.getPropertyValue('--color-text-primary').trim(),
  // 注: 列車種別の色はデータモデル（TrainType.color）から取得するためここには含めない
}
```

### 4. コンポーネントカタログ: Storybook 8

**Storybook 8（Vite統合）を採用する。**

StoriesはコンポーネントJSXファイルと同階層に配置し、管理の局所性を高める。

```
src/components/
  common/
    Button/
      Button.tsx
      Button.module.css
      Button.stories.tsx
```

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  args: {
    children: 'ボタン',
    variant: 'primary',
    disabled: false,
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {}
export const Disabled: Story = { args: { disabled: true } }
```

**Canvasコンポーネントの扱い:**

ダイヤグラム描画（Canvas）はStorybookでの自動テスト対象外とし、モックデータを用いた目視確認に留める。座標変換・hitテストなどのコアロジックはVitest（ADR-009参照）でテストする。

---

## 採用パッケージ

```json
{
  "dependencies": {
    "@base-ui-components/react": "latest",
    "clsx": "^2.0"
  },
  "devDependencies": {
    "@storybook/react-vite": "^8.0",
    "@storybook/addon-essentials": "^8.0"
  }
}
```

---

## 結果

**ポジティブ:**

- Base UIによってアクセシビリティ対応コストをライブラリに委譲できる
- CSS Modulesによりスタイルのスコープが保証され、規模が大きくなっても命名衝突が発生しない
- CSS変数を橋渡しにすることで、CSSとCanvasのJS描画値を一元管理できる
- StorybookによりコンポーネントをUIから独立して開発・確認できる

**ネガティブ:**

- コンポーネントごとに `.tsx` と `.module.css` の2ファイルが生じ、AIエージェントがスタイル編集時に複数ファイルを参照する必要がある
- Base UIはTailwind前提のドキュメントサンプルが多く、CSS Modulesでの実装例を自前で整備する必要がある

---

## 未決事項（実装フェーズで決定）

- ダークモードのサポート範囲（`@media (prefers-color-scheme)` vs 手動切り替え）
- フォントの選定（日本語フォントを明示的に指定するか、システムフォントに委ねるか）
- アイコンライブラリの選定（Lucide React等）
- ダイヤグラムCanvasのStories化の方針（モックデータでの描画確認の粒度）

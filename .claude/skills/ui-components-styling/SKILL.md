---
name: ui-components-styling
description: UI component architecture and styling conventions for the railway diagram editor. Use when implementing or modifying React components, writing CSS Modules, using Base UI headless components, applying design tokens (CSS variables), or setting up Storybook stories. Covers file layout, class naming, data-state selectors, and Canvas/CSS token sharing.
---

# UI Components & Styling

## Overview

スタイリング: CSS Modules。アクセシビリティ: Base UI（@base-ui-components/react）に委譲。デザイントークン: CSS変数で一元管理し、Canvas描画値と共有する。コンポーネントカタログ: Storybook 8。

## ファイル配置

コンポーネントと同階層に `.tsx` / `.module.css` / `.stories.tsx` を並べる。

```
src/components/
  common/
    Button/
      Button.tsx
      Button.module.css
      Button.stories.tsx
      index.ts
  diagram/
    TrainLine/
      TrainLine.tsx
      TrainLine.module.css
```

## CSS Modules 命名規則

BEM不要。コンポーネントスコープを前提にシンプルに保つ。

```css
/* Button.module.css */
.root     { }   /* ルート要素 */
.primary  { }   /* バリアント */
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

## Base UI との組み合わせ

Base UIは `data-state` / `data-open` / `data-disabled` などの属性を自動付与する。CSS Modulesのセレクタで直接スタイルを当てる。

```css
/* Popover.module.css */
.trigger[data-popup-open] {
  background: var(--color-surface-hover);
}

.popup[data-open]   { opacity: 1; }
.popup[data-closed] { opacity: 0; }

[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
```

## デザイントークン（CSS変数）

`src/styles/tokens.css` をグローバルに読み込む。

```css
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

### Canvas側からのトークン参照

```typescript
// src/utils/designTokens.ts
const style = getComputedStyle(document.documentElement)

export const tokens = {
  colorBorder:      style.getPropertyValue('--color-border').trim(),
  colorTextPrimary: style.getPropertyValue('--color-text-primary').trim(),
  // 注: 列車種別の色はデータモデル（TrainType.color）から取得するためここには含めない
}
```

## Storybook Stories

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

CanvasダイヤグラムコンポーネントはStorybookでモックデータを用いた目視確認に留める（自動テスト対象外）。

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

## 却下済みの選択肢

- **Tailwind CSS**: 多状態UIでクラス名が長くなり保守性が低下するリスク
- **CSS-in-JS**: ランタイムコストがあり、パフォーマンス要件と相反する
- **素のCSS**: グローバルスコープの命名衝突リスク
- **Radix UI**: Base UIはCSS Modulesとの統合が設計レベルで考慮されており、APIの一貫性も高い

詳細な経緯: `docs/adr/008-ui-components-styling.md`

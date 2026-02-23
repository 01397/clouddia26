---
name: ui-components-styling
description: UI component architecture and styling conventions for the railway diagram editor. Use when implementing or modifying React components, writing CSS Modules, integrating Base UI headless components, applying design tokens (CSS variables), or setting up Storybook stories.
---

# UI Components & Styling

## Approach

- **Styling**: CSS Modules (component-scoped, no global naming conflicts)
- **Accessibility**: Delegated to Base UI (`@base-ui-components/react`) headless components
- **Design tokens**: CSS custom properties defined in `src/styles/tokens.css`, shared between CSS and Canvas rendering
- **Component catalog**: Storybook 8

For the full token reference: see [TOKENS.md](TOKENS.md)

## File Layout

Place `.tsx`, `.module.css`, and `.stories.tsx` alongside each component:

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

## CSS Modules Naming

Use simple, flat class names within component scope — no BEM required:

```css
/* Button.module.css */
.root     { }   /* Root element */
.primary  { }   /* Variant */
.disabled { }   /* State */
```

```tsx
// Button.tsx
import styles from './Button.module.css'
import clsx from 'clsx'

<button className={clsx(styles.root, styles[variant], {
  [styles.disabled]: disabled,
})} />
```

## Base UI Integration

Base UI automatically applies `data-state`, `data-open`, `data-disabled`, etc. attributes. Use attribute selectors in CSS Modules to style these states:

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

## Sharing Design Tokens with Canvas

```typescript
// src/utils/designTokens.ts
const style = getComputedStyle(document.documentElement)

export const tokens = {
  colorBorder:      style.getPropertyValue('--color-border').trim(),
  colorTextPrimary: style.getPropertyValue('--color-text-primary').trim(),
  // Train type colors come from TrainType.color in the data model, not from tokens
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
    children: 'Button',
    variant: 'primary',
    disabled: false,
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {}
export const Disabled: Story = { args: { disabled: true } }
```

Canvas diagram components use Storybook for manual visual inspection with mock data. Automated pixel-level testing for Canvas output is handled via separate means.

## Packages

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

For design decisions and evaluated alternatives: `docs/adr/008-ui-components-styling.md`

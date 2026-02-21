# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Railway Diagram Editor — Vite 7 + React 19 + TypeScript, targeting the browser.

## Commands

```bash
pnpm dev          # Vite dev server (port 5173)
pnpm build        # tsgo -b type-check, then vite build → dist/
pnpm lint         # oxlint (with type-aware rules and type-checking)
pnpm format       # oxfmt . (Prettier-compatible formatter)
pnpm preview      # preview the production build locally
```

## Toolchain

Vite 7 + React 19 + TypeScript, with the following tools:


- `oxlint`: Linter. Config in `oxlint.json`. Plugins: `react`, `typescript`. Type-aware rules enabled. Type-checking via tsgo.
- `oxfmt` | Formatter (Prettier-compatible, zero-config). Configured as the VS Code default formatter via `oxc.oxc-vscode`. |

## TypeScript

Uses project references (`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`). `tsgo -b` resolves references. `erasableSyntaxOnly: true` is enabled — avoid TypeScript-only runtime constructs (enums, namespaces, parameter properties).

## Package manager

`pnpm` only. esbuild build scripts are approved via `pnpm.onlyBuiltDependencies` in `package.json`.

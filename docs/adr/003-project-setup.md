# ADR-003: プロジェクト構成の選定（React + Vite）

**日付**: 2026-02-21
**ステータス**: Accepted

---

## コンテキスト

鉄道ダイヤグラムエディタをフロントエンド完結で開発するにあたり、適切なプロジェクト構成を選定する必要がある。将来的なデスクトップ版（Electron/Tauri）への拡張も視野に入れつつ、現時点ではWeb版を優先する。

---

## 検討した選択肢

| 選択肢 | HMR | バンドルサイズ | ルーティング | デスクトップ移行 | 評価 |
|--------|-----|--------------|------------|--------------|------|
| **React + Vite** | ★★★★★ | ★★★★★ | 手動/不要 | ★★★★★ (Tauri) | **採用** |
| Next.js (App Router) | ★★★☆☆ | ★★★☆☆ | 自動 | ★★★☆☆ (Electron) | 過剰 |
| Remix | ★★★☆☆ | ★★★☆☆ | 自動 | ★★★☆☆ | 学習コスト高 |
| Vite + Electron | ★★★★★ | N/A | 手動 | ★★★★★ | 配布が複雑 |
| Vite + Tauri | ★★★★★ | N/A | 手動 | ★★★★★ | 段階的移行向き |

---

## 決定事項

**React + Vite** を採用。

---

## 理論的根拠

### ビュー管理

鉄道ダイヤエディタは「モード」ベースのアプリケーション。URLベースのルーティングは不要で、状態駆動のビュー切り替えが適切。

```typescript
const useViewStore = create<ViewState>((set) => ({
  currentView: 'list' | 'editor',
  editorMode: 'diagram' | 'timetable' | 'operations',
  // ...
}))
```

Next.jsのファイルベースルーティングはこの用途には過剰。

### デスクトップ版への段階的移行

ViteはTauriと公式統合されており、既存のViteプロジェクトにTauriを追加するだけで移行可能。Next.js + Electronの場合はSSR無効化が必要でNext.jsの利点が失われる。

### 不要な機能の排除

Next.jsの以下の機能は本プロジェクトでは不要:
- SSR/SSG（オフライン前提のSPA）
- API Routes（フロントエンド完結）
- 画像最適化（ダイヤグラムは動的生成）

---

## 将来の拡張パス

1. **Phase 1: Web版**（現在）— React + Vite
2. **Phase 2: PWA化** — vite-plugin-pwa
3. **Phase 3: デスクトップ版** — Tauri追加、抽象化レイヤーでプラットフォーム差分を吸収

```typescript
// utils/platform.ts
export const openFile = async (): Promise<File> => {
  if (window.__TAURI__) {
    return await tauriOpenFile()
  } else {
    return await webOpenFile()
  }
}
```

---

## 結果

**ポジティブ**: 最速の開発体験、最小バンドルサイズ、デスクトップ移行容易、URLとの同期不要

**ネガティブ**: ファイルベースルーティングがない（手動管理）、Next.jsのような規約がない（自由度高）

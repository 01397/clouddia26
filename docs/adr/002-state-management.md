# ADR-002: 状態管理ライブラリの選定（Zustand + Immer）

**日付**: 2026-02-21
**ステータス**: Accepted

---

## コンテキスト

3,000列車 × 平均10駅 = 30,000の時刻エントリを含む複雑なデータ構造を、効率的かつ保守性高く管理する必要がある。

---

## 検討した選択肢

| ライブラリ | バンドルサイズ | 開発者体験 | TypeScript | 評価 |
|-----------|--------------|----------|-----------|------|
| Redux Toolkit + Immer | ~60KB | ★★★☆☆ | ★★★★★ | ボイラープレート多い |
| **Zustand + Immer** | **~17KB** | **★★★★★** | **★★★★★** | **採用** |
| Jotai + Immer | ~3KB | ★★★☆☆ | ★★★★★ | 設計自由度高すぎ |
| MobX | ~50KB | ★★★☆☆ | ★★★☆☆ | デコレータ問題 |
| Class-based (素のReact) | 0KB | ★★☆☆☆ | ★★★★★ | 車輪の再発明 |

---

## 決定事項

**Zustand + Immer** を採用。

---

## 理論的根拠

### パフォーマンス最適化

セレクタによる細粒度の購読がデフォルトで効率的に動作し、3,000列車規模でも不要な再レンダリングを防げる。

```typescript
const train = useTrainStore(state => state.trains[trainId])
```

### Immerによる直感的な更新

ネストしたオブジェクトの更新がmutableな記法で書けるが、内部的にはimmutable。

```typescript
const useTrainStore = create<TrainState>()(
  immer((set) => ({
    trains: {},
    updateDepartureTime: (trainId, stationId, time) =>
      set((state) => {
        state.trains[trainId].timetable[stationId].departure = time
      }),
  }))
)
```

### バンドルサイズ

Zustand ~3KB + Immer ~14KB = **~17KB**（Redux Toolkit ~60KBの1/3以下）

### Undo/Redo

zundoミドルウェアでImmerと組み合わせた履歴管理が可能。

```typescript
import { temporal } from 'zundo'

const useTrainStore = create<TrainState>()(
  temporal(immer((set) => ({ /* ... */ })))
)
```

### 複数ストア・外部アクセス

```typescript
// ストア分割が容易
const useStationStore = create(...)
const useTrainStore = create(...)
const useUIStore = create(...)

// React外部からのアクセス（Web Worker対応）
const state = useTrainStore.getState()
```

### IndexedDBとの統合

```typescript
import { persist, createJSONStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'

const useTrainStore = create<TrainState>()(
  persist(
    immer((set) => ({ /* ... */ })),
    {
      name: 'railway-diagram',
      storage: createJSONStorage(() => ({
        getItem: async (name) => (await get(name)) || null,
        setItem: async (name, value) => { await set(name, value) },
        removeItem: async (name) => { await del(name) },
      })),
    }
  )
)
```

---

## 結果

**ポジティブ**: 開発速度向上、バグ削減（immutable安全性）、パフォーマンス担保、拡張性

**ネガティブ**: Redux DevToolsほど洗練されたデバッグツールがない、コミュニティサイズがReduxより小さい

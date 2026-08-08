# Kroose Music

A Win10-style local music player built with Vue 3 + Electron + TypeScript. Supports normal music libraries (mp3/flac/wav) and "asmr" album folders, with lyrics, cover-art main-color theming, and a frameless window.

## Project

- Stack: Electron 35 + electron-vite, Vue 3 (`<script setup lang="ts">`), Pinia (setup stores) + pinia-plugin-persist, vue-router (hash history), SCSS, better-sqlite3, sharp, music-metadata, jschardet + iconv-lite, hotkeys-js, eventemitter3. `"type": "module"`; TS via Node16 moduleResolution, legacy decorators (`experimentalDecorators`) enabled for the main process.
- Entry points: main process `src/main/index.ts`; renderer `src/renderer/src/main.ts`; preload `src/preload/index.mjs`.
- No test suite and no linter config in the repo.

## Commands

- `npm run gen:ipc` — scan `@Ipc`/`@IpcEvent` decorators and regenerate `src/preload/ipc.gen.mjs` + `ipc.gen.d.ts` (run after touching any module)
- `npm run dev` — gen:ipc + dev with hot reload (electron-vite dev -w)
- `npm run typecheck` — gen:ipc + `tsc` (node) + `vue-tsc` (web)
- `npm run build` — typecheck + electron-vite build → `out/`
- `npm run build:win` / `build:mac` / `build:linux` — package with electron-builder
- `npm run pre` — preview build output
- Native deps (better-sqlite3) are rebuilt via `postinstall` (`electron-builder install-app-deps`); npm mirror config lives in `.npmrc`.

## Architecture

- **Main-process module system** (`src/main/modules/`): `KModule` is a plain abstract base — `namespace`, optional `onReady`/`onQuit`, `getMod()` for cross-module deps. IPC calls are declared with the `@Ipc()` decorator from `src/main/utils/ipc.ts` (method name = channel name, no args). Push events: each module file declares an `interface Events { 事件名: (args) => void }` (JSDoc included) and fires them via `getMod(KWindowManager).sendToRenderer<Events>({ channel: '事件名', data: [...] })` — event name and arg types are checked against that interface. Event channels are the bare event name (no namespace prefix) and must be globally unique — `gen:ipc` fails on duplicates. `KModuleManager.init()` reads the decorator metadata (`getIpcMethods`) and registers each channel as `ipcMain.handle('<namespace>:<channel>', ...)`. New features = add a module class, append it to the `mods` array in `modules/index.ts`, mark methods with `@Ipc()`, then run `npm run gen:ipc`.
  - `KMusicDatabase` (`namespace 'db'`) — better-sqlite3, WAL mode; tables `library`, `curlist`, plus one table per library named by its numeric libID. Two library modes: `normal` (music rows) vs `asmr` (album rows). Emits `transCreateCommonLib` progress via `getMod(KWindowManager).sendToRenderer<Events>({ channel: 'transCreateCommonLib', data: [inserted, total] })`.
  - `KMusicMetadata` (`'info'`) — music-metadata tags, .lrc/.vtt lyric parsing with encoding detection, median-cut cover main color (sharp + color).
  - `KMusicScanner` (`'scan'`) — recursive file scans, directory structure (`getDirStruc`), `showItemInFolder`.
  - `KWindowManager` (`'win'`) — file/dir dialogs, window controls (`sendToRenderer` backs `KModule.send`); creates `KMusicWindow` (frameless BrowserWindow, `contextIsolation: false`, `nodeIntegration: true`, `webSecurity: false`).
- **Preload** (`src/preload/`): `ipc.gen.mjs` is build-time generated — a static `api` object with `key: (...args) => ipcRenderer.invoke('<ns>:<key>', ...args)` per channel and a paired `on<Event>(cb)` / `off<Event>(cb)` per event that pass through to `ipcRenderer.on` / `ipcRenderer.removeListener` directly (the callback is a native listener: first arg is `IpcRendererEvent`). `index.mjs` synchronously imports it and `contextBridge.exposeInMainWorld('api', api)`. Types come from generated `ipc.gen.d.ts` (`API`), referenced by `index.d.ts`; JSDoc from the source methods is preserved so editors show it on `window.api.<ns>.<fn>()`.
- **Renderer** (`src/renderer/src/`):
  - Pages: `PBar` (title/nav/music bars + drawer), `PLibrary`, `PLike`, `PList`, `PSearch`, `PSetting`, `PDetail` (lyrics view).
  - Components: `KLibList` (virtualized list), `KDialog`, `KDropdown`, `KSelect`, `KSlider`, `KImage`, `KSetting`; custom directives `Menu` (`v-ctx-menu` right-click) and `Tooltip` (`v-tooltip`) — both emit through the event bus.
  - Stores (Pinia, `getXxxManager()` accessors): `KAudioManager` (HTMLAudioElement wrapper), `KSessionManager` (queue + loop modes), `KInfoManager` (tags/lyrics/color), `KLibraryManager` (curLibs/curItems), `KUIManager` (UI flags). Persist via `pinia-plugin-persist` with explicit `paths`.
  - `utils/EventUtil.ts` — typed eventemitter3 `bus` + `Events` enum (stores/UI communicate via `bus.on/emit`, not direct imports).
  - `services/hotkey.ts` — hotkeys-js bindings (space, arrows, ctrl+m, f5, f12 …).

## Conventions

- Naming: main-process modules/classes and UI components get `K` prefix (`KModule`, `KMusicBar`, `KLibList`); pages get `P` prefix (`PLibrary`); Pinia stores are exposed as `getXxxManager()` with store id `store-xxx`.
- Shared interfaces (`ILibItem`, `ILibMusic`, `ILibAlbum`, `ILibrary`, `IDir`, `ILyric`, `LibMode`, `AudioState`…) are **global** (declared in `src/renderer/src/types/index.d.ts`, no imports needed; also included in `tsconfig.node.json`). Enums live in `src/renderer/src/types/Enum.ts`.
- Main modules: IPC methods carry `@Ipc()` (no argument — method name **is** the channel name, so name them for the renderer, e.g. `addLibrary`), keep their JSDoc (becomes renderer hover text), and are **not** `private`. Push events: declare an `interface Events` in the module file (event name → `(args) => void` signature with JSDoc); fire via `getMod(KWindowManager).sendToRenderer<Events>({ channel: '事件名', data: [...] })` — name/args are type-checked against that interface. Event channels are the bare event name, globally unique (enforced by `gen:ipc`). Imported TS modules use `.js` extensions (Node16 ESM).
- Renderer: `<script setup lang="ts">`; Vue APIs, components, and directives are **auto-imported/auto-registered** (unplugin-auto-import + unplugin-vue-components; generated dts in `src/types/`), so do not add manual component imports. Path alias `@renderer/*` → `src/renderer/src/*`.
- IPC calls: `await window.api.<ns>.<fn>(...)`. Push events: register the listener on component `onMounted` and remove it on `onUnmounted` (paired `window.api.<ns>.on<Event>(cb)` / `off<Event>(cb)`, same `cb` reference; the callback receives `(event: IpcRendererEvent, ...data)`).
- Generated artifacts (`src/preload/ipc.gen.mjs`, `ipc.gen.d.ts`, `src/types/auto-imports.d.ts`, `src/types/components.d.ts`) are committed; regenerate with `npm run gen:ipc` after changing decorators or the `Events` interface.
- Styles: scoped SCSS; root class named after the component; shared vars from `@renderer/assets/var.module.scss` (`$music-hei`, …), `k-scrollbar` mixin from `@renderer/assets/style.scss`. 2-space indent, LF (`.editorconfig`).
- Comments are in Chinese (JSDoc style on exports); console diagnostics use English messages like `xxx failed: <detail>`.
- Runtime data is redirected to `<app>/data/userData` (dev: repo `data/`, prod: next to the exe) in `src/main/index.ts`; dev DB path is `<repo>/data/userData/KrooseDB.db`.

## Notes

(Add project-specific gotchas here as they surface.)

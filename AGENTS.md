# Repository Guidelines

## Project Structure & Module Organization

- Source lives in `src/`:
  - `src/app/main` (Electron main process)
  - `src/app/preload` (context bridge, `electronAPI.ts`)
  - `src/app/renderer` (Vue 3 UI, components in `components/`)
- Shared utilities: `src/utils/`, domain libs: `src/lib/`, types: `src/types/`.
- Static assets: `public/assets/`. Built‑in widgets and config: `public/widgets/` + `public/widgets/widgets.json` (update when adding a widget). Example: add `public/widgets/my widget/` and append an entry in `widgets.json` with size/position fields.
- Build/packaging config: `forge.config.ts`, `vite.*.config.ts`, Tailwind: `tailwind.config.js`.

## Build, Test, and Development Commands

- `npm install` — install dependencies.
- `npm start` — run app in dev with Vite HMR + Electron Forge.
- `npm run make` — create installers/bundles for the host OS.
- `npm run package` — package app without creating installers.
- `npm run publish` — publish via GitHub (used by CI on tags `v*`).
- `npm run lint` — ESLint for TS/JS.

CI: Push/PR runs `.github/workflows/build.yml`. Tags `v*` trigger publish.

## Coding Style & Naming Conventions

- Language: TypeScript (strict). Lint with ESLint (`@typescript-eslint`, import rules). Fix issues before PR.
- Format with Prettier 3 (honor repo config). Keep Vue components PascalCase (e.g., `Navbar.vue`), variables/function names camelCase, constants UPPER_SNAKE_CASE.
- Place shared types in `src/types/`. Keep renderer‑safe code out of `main`.

## Testing Guidelines

- No formal test suite yet. Prefer adding: Vitest (renderer/utils) and lightweight smoke tests for `main`/preload.
- Suggested layout: `src/**/__tests__` or `tests/`.
- Ensure `npm start` works locally and core flows are exercised.

## Commit & Pull Request Guidelines

- Use Conventional Commits when possible: `feat:`, `fix:`, `chore:`, `docs:` (e.g., `feat(renderer): add settings menu`).
- Keep subjects imperative and ≤72 chars. Reference issues (`#123`).
- PRs: clear description, reproduction/testing notes, and screenshots/GIFs for UI changes. Require `npm run lint` clean and a local `npm run make` sanity check.

## Security & Configuration Tips

- Do not expose Node APIs directly to the renderer; route via preload (`src/app/preload/`).
- Do not commit secrets. Releases use `GITHUB_TOKEN` in CI only.

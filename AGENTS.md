# Repository Guidelines

## Project Structure & Module Organization

The repository hosts two deliverables under `apps/`: the Electron desktop app in `apps/desktop` and the documentation site in `apps/web`. Desktop code lives in `apps/desktop/src`, split into `app` (widgets, Vue components) and `lib/utils` for shared helpers; build tooling and config files sit alongside (`forge.config.ts`, `vite.*.config.ts`). Static assets reside in `apps/desktop/public`, and distributables land in `apps/desktop/out` after packaging. The VitePress docs are authored in `apps/web/docs`, with entry points `index.md` and `index.ts`.

## Build, Test, and Development Commands

From `apps/desktop`, install dependencies (`npm install`) and launch the Electron dev environment with `npm run start`. Produce installable bundles via `npm run make`; `npm run package` creates unpackaged artifacts, while `npm run publish` targets Forge’s GitHub publisher. Formatting and linting use Biome: `npm run format` rewrites code style, `npm run lint` applies lint fixes under `src/`. For the docs site, `cd apps/web` and run `npm install` (or `bun install` if Bun is preferred), then `npm run docs:dev` for local preview, `npm run docs:build` for static output.

## Coding Style & Naming Conventions

TypeScript and Vue files follow Biome defaults (2-space indentation, semicolons omitted). Keep Vue single-file components in PascalCase (`WeatherWidget.vue`) and export utilities with camelCase names. Tailwind classes should be composed declaratively rather than inlined style attributes. Honor the existing module boundaries: UI logic stays in `app/components`, data fetching in `lib` helpers, and shared types under `types/`.

## Testing Guidelines

Automated tests are not yet in place; prioritize manual verification before opening a PR. Smoke-test widgets by running `npm run start`, exercising window controls, widget drag/drop, and RSS refresh. For docs changes, confirm the navigation and code blocks render via `npm run docs:dev`. When adding tests, colocate them next to the target module (e.g., `app/widgets/WidgetName.spec.ts`) and align names with the component or service under test.

## Commit & Pull Request Guidelines

Recent commits mix short placeholders with Conventional Commit style (`feat(web): ...`). Move fully to `type(scope): summary` (e.g., `fix(desktop): guard null config`) to keep history searchable. Group related changes; avoid “.” messages. Each PR should include: a concise summary of the change, testing notes (commands run or scenarios exercised), references to linked issues, and screenshots or short clips for UI updates. Ensure lint/format commands pass before requesting review and flag any follow-up work explicitly in the description.

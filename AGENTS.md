# AGENTS.md

- This is a single-package Bun project; work from the repository root and use `bun`, not npm or yarn.
- The package entrypoint is `index.ts`; the current implementation is only a Bun CLI scaffold.
- Install dependencies with `bun install`; commit changes to `package.json` and `bun.lock` together when dependencies change.
- Run the CLI with `bun run index.ts`.
- Typecheck with `bunx tsc --noEmit`; `tsconfig.json` enables strict checking and does not emit files.
- There are currently no package scripts, tests, lint configuration, or CI workflows; do not assume those checks exist.
- The intended feature direction and Open-Meteo API examples are documented in `README.md`; keep runtime behavior consistent with that CLI design.

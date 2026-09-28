# AGENTS.md

Personal finance dashboard. Next.js 16 (App Router) + React 19, TypeScript strict, Tailwind v4. The "database" is a **Google Sheet**; only the Transactions feature is actually wired to it — every other page reads static fixtures from `lib/mock-data.ts`.

## Commands

```bash
npm run dev      # next dev
npm run build    # next build
npx tsc --noEmit # the ONLY real typecheck
```

- **There is no test suite, no CI, no pre-commit hooks, no eslint config.** `npm run lint` is a dead script (`eslint` is not even installed) — don't rely on it or try to "fix" it unless asked.
- **`next build` does not typecheck**: `next.config.mjs` sets `typescript.ignoreBuildErrors: true`. A green build says nothing about types. Always run `npx tsc --noEmit`.
- Baseline is currently **0 type errors** and the build prerenders `/transactions` against the real sheet. Keep it that way.
- `npm run build` is the only check that exercises the RSC serialization boundary — a 200 in dev is not enough (see the plain-objects rule below).

## Architecture

Each feature is a module with four layers. **Dependencies point inward only**: `presentation → application → domain`, with `infrastructure` implementing `domain` ports. Nothing inside a module may import an outer layer of that module.

```
modules/<feature>/
  domain/          entities, enums, dto, repositories/  (ports/interfaces — zero framework imports)
  application/     usecases/                            (business rules, depend only on domain)
  infrastructure/  repositories/, services/, mappers/   (adapters + external APIs)
  presentation/    actions/, components/, hooks/, schemas/  (server actions, React, zod)
modules/shared/    cross-feature kernel: domain/, application/, presentation/
```

- `app/` is a **thin delivery layer**: routes and API handlers only. Feature logic lives in `modules/`. A page may import from a module, never the reverse — `modules/**` must not import from `@/app`.
- `components/` holds only cross-feature UI: `ui/` (shadcn, do not restructure), `layout/`, `providers/`, `shared/`, `dashboard/` (mock-only overview widgets).
- `config/env.ts` is the **only** place allowed to read `process.env`; import `env` from it.
- There is no DI container. Usecases are constructed at the call site with `new SomeUseCase(new GoogleSheetTransactionRepository())` — the composition root is the server action or API route.
- File naming: `PascalCase` for classes/components, `use-camelCase` for hooks, `kebab-case` for schemas/dto. Use `@/` aliases everywhere; relative `./` only for siblings in the same directory.

### RSC serialization trap

Data returned by a server component and passed into a client component **must be plain objects**. `SheetTransactionMapper.fromSheetToDomain` deliberately returns object literals rather than `new Transaction(...)`; instantiating the class there breaks the build with *"Only plain objects ... can be passed to Client Components"*. Client-side rehydration goes through the `Transaction.fromJson` factory instead.

## Google Sheet is the data store

- Data tab columns are positional: `A=id, B=date, C=description, D=amount, E=type, F=category, G=user`.
- **Pagination is implemented in Sheet formulas, not in JS.** `GoogleSheetTransactionRepository.getTransactions` writes `page` → `pagination!I1`, `size` → `pagination!I2`, then reads the pre-sliced window `pagination!A2:G`. The spreadsheet must have a `pagination` tab; changing page size or pagination logic means changing sheet formulas too.
- `totalPage` comes from a full `A:A` read, so every page request costs 2 Sheets API calls.
- Create appends to range `B:G` with a leading `null` for the id column (the sheet generates it).
- `type` must be exactly `INCOME` / `EXPENSE` (`domain/enums.ts`); the zod schema enforces it and types it as `TypeTransaction`.

### Env / credentials

`.env` and `finance-logs-google.json` are gitignored but present locally. Required vars: `PIN` (login PIN), `SHEETID` (spreadsheet id), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`. All are surfaced through `config/env.ts`.

### Search is not implemented

`useTransactions` sends `q` and `type` to `/api/transactions`, but the route and `GetTransactions` ignore them — **the search box and type filter do nothing**. Only `page` / `offset` (→ `size`) have an effect. The transactions table's search input also has its `onChange` commented out. Don't assume search works; implementing it means adding filter support in the use case and the sheet query.

## Conventions

- Server actions live in `modules/<feature>/presentation/actions/` and return the `ResponseMaker` envelope (`{ status, message, errors, data, values }`).
- `app/(dashboard)/transactions/page.tsx` wraps the create action in an inline `"use server"` closure to hand it to a client `useActionState` form. Follow that pattern for new forms.
- Writes go through `revalidatePath` **and** an explicit client `refreshTable()` — intentional double refresh; removing one causes a stale table.
- Zod schema per write use case; `amount` is coerced by stripping non-digits from the raw form string.
- User-facing copy, validation messages, and code comments are in **Indonesian**. Match that when editing existing files.

## Auth is a stub

Login validates `PIN` in a server action, but on success `AuthProvider` just writes `{ id: "usr_demo", name }` to `localStorage["finance.auth.user"]`. `ProtectedShell` is a client-side redirect only. No session, no middleware, no server-side route protection — `/api/*` is fully public. `/settings` is therefore unreachable from the sidebar (no nav entry).

## UI components

`components/ui/*` is shadcn on the **`base-nova` registry over `@base-ui/react`, not Radix**. Apis differ from the common shadcn docs: `Button` takes `render={<Link …/>}` and `nativeButton={false}`, icons use `data-icon="inline-start"`. Copy from existing files in `components/ui/` rather than from upstream shadcn snippets. Add new primitives with `npx shadcn@latest add <name>` (aliases defined in `components.json`). Leave `components/ui/**` paths alone — the shadcn CLI rewrites them.

## Misc

- Dev is meant to be hit from a phone over LAN (`allowedDevOrigins: ["192.168.1.7"]`, standalone PWA manifest in `app/manifest.ts`). Change that IP if your network differs.
- `images.unoptimized: true` — no image optimization pipeline.
- Path alias is `@/*` → repo root (not `src/`).
- History uses conventional commits (`feat:`, `fix:`, `chore:`) on feature branches; no PR automation exists.

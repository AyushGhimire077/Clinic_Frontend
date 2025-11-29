# Copilot / AI agent instructions for Clinic_Frontend

This file gives concise, actionable knowledge to make an AI coding agent immediately productive in this repository.

1. Project overview
   - React + TypeScript app built with Vite. Entry is `src/main.tsx` and pages live under `src/pages/`.
   - UI libraries: MUI (`@mui/material`), Tailwind (via `@tailwindcss/vite`) and React Icons.
   - State: lightweight stores use `zustand` (look for `store.ts` files under feature folders).
   - Routing: `react-router-dom@7` (check `src/main.tsx` and `src/pages/*` for route setup).

2. Key integration points
   - Backend base URL comes from `import.meta.env.VITE_BACKEND_DEV_HOST`. See `src/component/global/config.ts`.
   - HTTP: two Axios instances are created:
     - `axios_no_auth` for public endpoints
     - `axios_auth` for authenticated requests (token must be injected at callsite)
     - Both use `withCredentials: true` (server is expected to support cookie CORS/session behavior).
   - Authentication: `react-cookie` + `jwt-decode` are used. Helpers live in `src/component/global/config.ts` (`getTokenFromCookies`, `getDecodedToken`, `getUsernameFromCookies`).

3. Developer workflows (exact commands)
   - Start dev server (hot reload): `npm run dev` (runs `vite`).
   - Build for production: `npm run build` (runs `tsc -b && vite build`). Note TypeScript project references are used; respect `tsconfig.app.json` and `tsconfig.node.json`.
   - Preview production build: `npm run preview`.
   - Lint: `npm run lint` (uses eslint configured in `eslint.config.js`).

4. Conventions & patterns to follow
   - File layout: `src/component/*` contains reusable components; `src/pages/*` contains routes and page-level logic.
   - Store naming: feature state files are named `store.ts` (examples under `src/pages/patient/componet/helper/store.ts` and `src/pages/staff/componet/staff/helper/store.ts`).
   - Interface files: `interface.ts` files next to components define local types (see `src/component/global/interface.ts`). Use them rather than introducing new ad-hoc types.
   - Small but important typo: several folders are named `componet` (missing an 'n'). Preserve existing paths when editing; consider normalizing with a separate refactor PR.
   - Component names: some components use snake/underscore in filenames (e.g., `Add_Patient.tsx`). Follow existing naming in adjacent files.

5. Common edit examples (explicit, local)
   - Adding an authenticated API call:
     - Import `axios_auth` from `src/component/global/config.ts`.
     - Read token via `getTokenFromCookies()` and set `axios_auth.defaults.headers.common.Authorization = 'Bearer '+token` before the request or attach via an interceptor at module init.
   - Reading the current user email:
     - Call `getUsernameFromCookies()` from `src/component/global/config.ts`.

6. What to avoid / known constraints
   - Do not assume a JSON-only auth header flow—the code uses cookies and `withCredentials: true`. Changing auth flow requires coordinating backend CORS and cookie settings.
   - Tests: there is no test runner configured. Add tests only with guidance; prefer minimal, focused unit tests (Jest or vitest) and update package.json scripts.

7. Files to inspect when working on a feature
   - `package.json` — scripts and major deps
   - `vite.config.ts` — plugins (React + Tailwind)
   - `src/component/global/config.ts` — axios instances & auth helpers (critical)
   - `src/pages/*`, `src/component/*` — for UI and routing patterns

8. If you modify build or env usage
   - Update `README.md` and mention `VITE_BACKEND_DEV_HOST` usage. Provide `.env` examples when adding or changing env vars.

If anything above is unclear or you want the agent to follow a stricter style (rename `componet` folders, add tests, or inject axios interceptors centrally), tell me which changes you prefer and I will update this file accordingly.

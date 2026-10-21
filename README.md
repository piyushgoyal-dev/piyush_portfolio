# Piyush Goyal — Portfolio

A résumé portfolio with one route per section (`/`, `/about`, `/experience`, `/projects`, `/skills`, `/contact`). Each page fits one screen, so the window never scrolls, and a floating icon navbar moves between them. Built with **Vite + React 18 + TypeScript**, **Tailwind CSS v4** and **framer-motion**, set up in shadcn's folder structure.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run typecheck  # TypeScript only
```

## Editing content

- **`src/data/resume.ts`** holds all résumé content: profile, email, phone, LinkedIn/GitHub, about text, experience, projects (`liveUrl` / `githubUrl`) and skills. Empty URLs hide their links.
- **`src/App.tsx`** holds the hero text, the routes and the navbar icons.
- **`src/routes.ts`** sets the page order, which the navbar and the top bar's "Next" link both follow.

Put these files in `public/`:
- `public/resume.pdf`, used by the "Résumé" link
- `public/piyush.jpg`, used as the social-share preview image

## Project structure (shadcn)

```
components.json              shadcn config (aliases: @/components, @/components/ui)
src/components/ui/           shadcn-style UI components — prisma-hero.tsx, futuristic-nav.tsx
src/components/sections/     About, Experience, Projects, Skills, Contact (one page each)
src/components/layout/       Page shell (fits a page to the screen) + top bar with page counter
src/index.css                Tailwind entry + theme (`--color-primary`) + noise texture
```

`components/ui` is where the shadcn CLI installs components. Keeping that folder means `npx shadcn@latest add <component>` and copy-pasted components (which import from `@/components/ui/...`) work without edits.

## Deploy on Vercel

Import the GitHub repo on vercel.com and choose the **Vite** framework preset. No other settings are needed. `vercel.json` already rewrites every route to `index.html`, so links like `/projects` work when someone opens them directly or refreshes the page.

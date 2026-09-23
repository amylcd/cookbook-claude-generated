# My Cookbook

A personal recipe dashboard — browse recipes in a filterable grid, filter by tags or by base (rice/potato/bread/pasta), add/edit recipes with a simple form, and check off ingredients and steps while cooking.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + SQLite (via the `@prisma/adapter-libsql` driver adapter) for storage

## Getting Started

Install dependencies and set up the database:

```bash
npm install
npx prisma migrate dev
npm run db:seed   # optional: adds a few sample recipes
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Data model

Recipes live in `prisma/schema.prisma` (SQLite, `prisma/dev.db`). Each recipe has a title, description, ingredients, steps, an optional base (Rice/Potato/Bread/Pasta, used for filtering), prep/cook time, servings, an optional source URL and image URL, and any number of tags used for filtering on the dashboard.

Ingredient quantities are entered as free text and should be in metric units (g/ml/°C) — cups are fine as an exception, but avoid other imperial units (tbsp, tsp, °F, oz, lb).

## Checking off items while cooking

The recipe detail page renders ingredients and steps as checklists — check items off as you go. Progress is saved to `localStorage` per recipe, so a refresh won't lose your place, and a "Reset checklist" link appears once you've checked something.

## Project structure

- `src/app/page.tsx` — dashboard (grid + tag/base filters)
- `src/app/recipes/[id]/page.tsx` — recipe detail view
- `src/app/recipes/new` and `src/app/recipes/[id]/edit` — add/edit forms
- `src/lib/recipes.ts` — data access layer
- `src/lib/actions.ts` — server actions for create/update/delete
- `src/lib/constants.ts` — shared option lists (e.g. `BASE_OPTIONS`)
- `src/components/Checklist.tsx` — client-side checkbox list with `localStorage` persistence

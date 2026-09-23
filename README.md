# My Cookbook

A personal recipe dashboard — browse recipes in a filterable grid, filter by tags or by base (rice/potato/bread/pasta/sweet/sauce/soup), import a recipe automatically from a link, add/edit recipes with a simple form, and check off ingredients and steps while cooking.

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

Recipes live in `prisma/schema.prisma` (SQLite, `prisma/dev.db`). Each recipe has a title, description, ingredients, steps, an optional base (Rice/Potato/Bread/Pasta/Sweet/Sauce/Soup, used for filtering — see `BASE_OPTIONS` in `src/lib/constants.ts`), prep/cook time, servings, an optional source URL and image URL, and any number of tags used for filtering on the dashboard.

Tags are freeform and can accumulate unused entries over time (e.g. after editing a recipe's tags); the dashboard has a "Reset unused tags" button that deletes any tag not attached to a recipe.

Ingredient quantities are entered as free text and should be in metric units (g/ml/°C) — cups are fine as an exception, but avoid other imperial units (tbsp, tsp, °F, oz, lb).

## Checking off items while cooking

The recipe detail page renders ingredients and steps as checklists — check items off as you go. Progress is saved to `localStorage` per recipe, so a refresh won't lose your place, and a "Reset checklist" link appears once you've checked something.

## Importing a recipe from a link

The add/edit recipe form has an "Import from a link" box. Paste a URL and it fetches the page and reads the `Recipe` structured data (JSON-LD/schema.org) that most recipe sites already publish for Google's rich results, then auto-fills title, description, ingredients, steps, prep/cook time, servings, image, tags, and a best-guess base. Pages without that structured data (or that block scraping) will show an error and fall back to manual entry.

## Project structure

- `src/app/page.tsx` — dashboard (grid + tag/base filters)
- `src/app/recipes/[id]/page.tsx` — recipe detail view
- `src/app/recipes/new` and `src/app/recipes/[id]/edit` — add/edit forms
- `src/lib/recipes.ts` — data access layer
- `src/lib/actions.ts` — server actions for create/update/delete
- `src/lib/recipeImport.ts` — server action that fetches a URL and parses its `Recipe` JSON-LD
- `src/lib/constants.ts` — shared option lists (e.g. `BASE_OPTIONS`)
- `src/components/Checklist.tsx` — client-side checkbox list with `localStorage` persistence
- `src/components/RecipeForm.tsx` — add/edit form, including the URL import UI

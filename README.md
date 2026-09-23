# My Cookbook

A personal recipe dashboard — browse recipes in a filterable grid, filter by tags, and add/edit recipes with a simple form.

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

Recipes live in `prisma/schema.prisma` (SQLite, `prisma/dev.db`). Each recipe has a title, description, ingredients, steps, prep/cook time, servings, an optional source URL and image URL, and any number of tags used for filtering on the dashboard.

## Project structure

- `src/app/page.tsx` — dashboard (grid + tag filter)
- `src/app/recipes/[id]/page.tsx` — recipe detail view
- `src/app/recipes/new` and `src/app/recipes/[id]/edit` — add/edit forms
- `src/lib/recipes.ts` — data access layer
- `src/lib/actions.ts` — server actions for create/update/delete

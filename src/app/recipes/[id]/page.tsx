import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe, linesToList } from "@/lib/recipes";
import { deleteRecipeAction } from "@/lib/actions";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipeId = Number.parseInt(id, 10);
  if (Number.isNaN(recipeId)) notFound();

  const recipe = await getRecipe(recipeId);
  if (!recipe) notFound();

  const ingredients = linesToList(recipe.ingredients);
  const steps = linesToList(recipe.steps);
  const boundDelete = deleteRecipeAction.bind(null, recipe.id);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <Link
          href="/"
          className="w-fit text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to cookbook
        </Link>

        {recipe.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="aspect-video w-full rounded-xl object-cover"
          />
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                {recipe.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/recipes/${recipe.id}/edit`}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
            >
              Edit
            </Link>
            <form action={boundDelete}>
              <button
                type="submit"
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-600 dark:border-red-900 dark:text-red-400 dark:hover:border-red-400"
              >
                Delete
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          {recipe.prepMinutes != null && <span>Prep: {recipe.prepMinutes} min</span>}
          {recipe.cookMinutes != null && <span>Cook: {recipe.cookMinutes} min</span>}
          {recipe.servings != null && <span>Servings: {recipe.servings}</span>}
          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              Source
            </a>
          )}
        </div>

        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/?tag=${encodeURIComponent(tag.name)}`}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="mb-3 font-medium text-zinc-950 dark:text-zinc-50">
              Ingredients
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              {ingredients.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-medium text-zinc-950 dark:text-zinc-50">
              Steps
            </h2>
            <ol className="flex flex-col gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 font-medium text-zinc-400 dark:text-zinc-600">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { getAllTags, getRecipes } from "@/lib/recipes";
import { resetUnusedTagsAction } from "@/lib/actions";
import { BASE_OPTIONS } from "@/lib/constants";

function buildHref(params: { tag?: string; base?: string }) {
  const query = new URLSearchParams();
  if (params.tag) query.set("tag", params.tag);
  if (params.base) query.set("base", params.base);
  const qs = query.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; base?: string }>;
}) {
  const { tag, base } = await searchParams;
  const [recipes, tags] = await Promise.all([
    getRecipes(tag, base),
    getAllTags(),
  ]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            My Cookbook
          </h1>
          <Link
            href="/recipes/new"
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            + New Recipe
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ tag })}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              !base
                ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
            }`}
          >
            All
          </Link>
          {BASE_OPTIONS.map((option) => (
            <Link
              key={option}
              href={buildHref({ tag, base: option })}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                base === option
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
              }`}
            >
              {option}
            </Link>
          ))}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildHref({ base })}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                !tag
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
              }`}
            >
              All
            </Link>
            {tags.map((t) => (
              <Link
                key={t.id}
                href={buildHref({ tag: t.name, base })}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  tag === t.name
                    ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                    : "border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
                }`}
              >
                {t.name}
              </Link>
            ))}
            <form action={resetUnusedTagsAction} className="ml-1">
              <button
                type="submit"
                className="rounded-full border border-dashed border-zinc-300 px-3 py-1 text-sm text-zinc-500 transition-colors hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
                title="Remove tags that aren't used by any recipe"
              >
                Reset unused tags
              </button>
            </form>
          </div>
        )}

        {recipes.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              {tag && base
                ? `No recipes tagged "${tag}" with a ${base} base yet.`
                : tag
                  ? `No recipes tagged "${tag}" yet.`
                  : base
                    ? `No recipes with a ${base} base yet.`
                    : "No recipes yet."}
            </p>
            <Link
              href="/recipes/new"
              className="text-sm font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
            >
              Add your first recipe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
              const totalMinutes =
                (recipe.prepMinutes ?? 0) + (recipe.cookMinutes ?? 0);
              return (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex aspect-video items-center justify-center bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-700">
                    {recipe.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🍽️</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="font-medium text-zinc-950 group-hover:underline dark:text-zinc-50">
                      {recipe.title}
                    </h2>
                    {(totalMinutes > 0 || recipe.base) && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {totalMinutes > 0 ? `${totalMinutes} min` : ""}
                        {recipe.servings
                          ? ` · ${recipe.servings} servings`
                          : ""}
                        {recipe.base
                          ? `${totalMinutes > 0 ? " · " : ""}${recipe.base}`
                          : ""}
                      </p>
                    )}
                    {recipe.tags.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        {recipe.tags.map(({ tag: t }) => (
                          <span
                            key={t.id}
                            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

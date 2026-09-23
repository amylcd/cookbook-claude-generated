import Link from "next/link";
import { notFound } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import { getRecipe } from "@/lib/recipes";
import { updateRecipeAction } from "@/lib/actions";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipeId = Number.parseInt(id, 10);
  if (Number.isNaN(recipeId)) notFound();

  const recipe = await getRecipe(recipeId);
  if (!recipe) notFound();

  const boundUpdate = updateRecipeAction.bind(null, recipe.id);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <Link
          href={`/recipes/${recipe.id}`}
          className="w-fit text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to recipe
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Recipe
        </h1>
        <RecipeForm
          action={boundUpdate}
          submitLabel="Save Changes"
          initialValues={{
            title: recipe.title,
            description: recipe.description ?? "",
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            prepMinutes: recipe.prepMinutes,
            cookMinutes: recipe.cookMinutes,
            servings: recipe.servings,
            sourceUrl: recipe.sourceUrl ?? "",
            imageUrl: recipe.imageUrl ?? "",
            tags: recipe.tags.map(({ tag }) => tag.name).join(", "),
          }}
        />
      </main>
    </div>
  );
}

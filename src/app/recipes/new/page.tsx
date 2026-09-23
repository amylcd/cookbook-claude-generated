import Link from "next/link";
import RecipeForm from "@/components/RecipeForm";
import { createRecipeAction } from "@/lib/actions";

export default function NewRecipePage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <Link
          href="/"
          className="w-fit text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to cookbook
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          New Recipe
        </h1>
        <RecipeForm action={createRecipeAction} submitLabel="Save Recipe" />
      </main>
    </div>
  );
}

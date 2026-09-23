"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createRecipe,
  deleteRecipe,
  tagsToList,
  updateRecipe,
} from "@/lib/recipes";

function toIntOrNull(value: FormDataEntryValue | null): number | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function readRecipeForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    ingredients: String(formData.get("ingredients") ?? "").trim(),
    steps: String(formData.get("steps") ?? "").trim(),
    prepMinutes: toIntOrNull(formData.get("prepMinutes")),
    cookMinutes: toIntOrNull(formData.get("cookMinutes")),
    servings: toIntOrNull(formData.get("servings")),
    sourceUrl: String(formData.get("sourceUrl") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    tags: tagsToList(String(formData.get("tags") ?? "")),
  };
}

export async function createRecipeAction(formData: FormData) {
  const input = readRecipeForm(formData);
  if (!input.title) {
    throw new Error("Title is required");
  }
  const recipe = await createRecipe(input);
  revalidatePath("/");
  redirect(`/recipes/${recipe.id}`);
}

export async function updateRecipeAction(id: number, formData: FormData) {
  const input = readRecipeForm(formData);
  if (!input.title) {
    throw new Error("Title is required");
  }
  await updateRecipe(id, input);
  revalidatePath("/");
  revalidatePath(`/recipes/${id}`);
  redirect(`/recipes/${id}`);
}

export async function deleteRecipeAction(id: number) {
  await deleteRecipe(id);
  revalidatePath("/");
  redirect("/");
}

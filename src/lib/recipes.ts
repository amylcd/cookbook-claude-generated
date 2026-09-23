import { prisma } from "@/lib/prisma";

export function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function tagsToList(text: string): string[] {
  return text
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function getRecipes(tagFilter?: string, baseFilter?: string) {
  return prisma.recipe.findMany({
    where: {
      ...(tagFilter ? { tags: { some: { tag: { name: tagFilter } } } } : {}),
      ...(baseFilter ? { base: baseFilter } : {}),
    },
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecipe(id: number) {
  return prisma.recipe.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });
}

interface RecipeInput {
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  base: string;
  prepMinutes: number | null;
  cookMinutes: number | null;
  servings: number | null;
  sourceUrl: string;
  imageUrl: string;
  tags: string[];
}

async function connectTags(tags: string[]) {
  return Promise.all(
    tags.map((name) =>
      prisma.tag.upsert({
        where: { name },
        create: { name },
        update: {},
      })
    )
  );
}

export async function createRecipe(input: RecipeInput) {
  const tags = await connectTags(input.tags);
  return prisma.recipe.create({
    data: {
      title: input.title,
      description: input.description || null,
      ingredients: input.ingredients,
      steps: input.steps,
      base: input.base || null,
      prepMinutes: input.prepMinutes,
      cookMinutes: input.cookMinutes,
      servings: input.servings,
      sourceUrl: input.sourceUrl || null,
      imageUrl: input.imageUrl || null,
      tags: { create: tags.map((tag) => ({ tagId: tag.id })) },
    },
  });
}

export async function updateRecipe(id: number, input: RecipeInput) {
  const tags = await connectTags(input.tags);
  return prisma.recipe.update({
    where: { id },
    data: {
      title: input.title,
      description: input.description || null,
      ingredients: input.ingredients,
      steps: input.steps,
      base: input.base || null,
      prepMinutes: input.prepMinutes,
      cookMinutes: input.cookMinutes,
      servings: input.servings,
      sourceUrl: input.sourceUrl || null,
      imageUrl: input.imageUrl || null,
      tags: {
        deleteMany: {},
        create: tags.map((tag) => ({ tagId: tag.id })),
      },
    },
  });
}

export async function deleteRecipe(id: number) {
  return prisma.recipe.delete({ where: { id } });
}

export async function deleteUnusedTags() {
  const result = await prisma.tag.deleteMany({
    where: { recipes: { none: {} } },
  });
  return result.count;
}

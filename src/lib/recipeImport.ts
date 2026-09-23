"use server";

export interface ImportedRecipe {
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  prepMinutes: number | null;
  cookMinutes: number | null;
  servings: number | null;
  imageUrl: string;
  tags: string;
}

function parseIsoDurationToMinutes(duration: unknown): number | null {
  if (typeof duration !== "string") return null;
  const match = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(duration);
  if (!match) return null;
  const days = Number(match[1] ?? 0);
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  const total = days * 24 * 60 + hours * 60 + minutes;
  return total > 0 ? total : null;
}

function textFromInstructions(instructions: unknown): string {
  if (!instructions) return "";
  if (typeof instructions === "string") return instructions.trim();
  if (Array.isArray(instructions)) {
    return instructions
      .map((step) => {
        if (typeof step === "string") return step.trim();
        if (step && typeof step === "object") {
          const obj = step as Record<string, unknown>;
          if (typeof obj.text === "string") return obj.text.trim();
          if (Array.isArray(obj.itemListElement)) {
            return textFromInstructions(obj.itemListElement);
          }
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  if (typeof instructions === "object") {
    const obj = instructions as Record<string, unknown>;
    if (Array.isArray(obj.itemListElement)) {
      return textFromInstructions(obj.itemListElement);
    }
  }
  return "";
}

function firstString(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return firstString(value[0]);
  if (value && typeof value === "object" && "url" in (value as Record<string, unknown>)) {
    return firstString((value as Record<string, unknown>).url);
  }
  return "";
}

function findRecipeNode(node: unknown): Record<string, unknown> | null {
  if (!node) return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findRecipeNode(item);
      if (found) return found;
    }
    return null;
  }
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const type = obj["@type"];
    const types = Array.isArray(type) ? type : [type];
    if (types.includes("Recipe")) return obj;
    if (obj["@graph"]) return findRecipeNode(obj["@graph"]);
  }
  return null;
}

export async function importRecipeFromUrl(url: string): Promise<ImportedRecipe> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http(s) links are supported.");
  }

  const res = await fetch(parsed.toString(), {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; CookbookImporter/1.0)" },
  });
  if (!res.ok) {
    throw new Error(`Couldn't fetch that page (${res.status}).`);
  }
  const html = await res.text();

  const scripts = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];

  let recipe: Record<string, unknown> | null = null;
  for (const script of scripts) {
    try {
      const json = JSON.parse(script[1].trim());
      recipe = findRecipeNode(json);
      if (recipe) break;
    } catch {
      // ignore malformed JSON-LD blocks
    }
  }

  if (!recipe) {
    throw new Error("No recipe data found on that page.");
  }

  const ingredients = Array.isArray(recipe.recipeIngredient)
    ? (recipe.recipeIngredient as unknown[]).filter(
        (i): i is string => typeof i === "string"
      )
    : [];

  const yieldValue = Array.isArray(recipe.recipeYield)
    ? recipe.recipeYield[0]
    : recipe.recipeYield;
  const servingsMatch =
    typeof yieldValue === "string" ? yieldValue.match(/\d+/) : null;
  const servings =
    typeof yieldValue === "number"
      ? yieldValue
      : servingsMatch
        ? Number(servingsMatch[0])
        : null;

  const keywords = recipe.keywords;
  const keywordList = Array.isArray(keywords)
    ? keywords
    : typeof keywords === "string"
      ? keywords.split(",")
      : [];
  const tags = [recipe.recipeCategory, recipe.recipeCuisine, ...keywordList]
    .flat()
    .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    .map((t) => t.trim())
    .slice(0, 5)
    .join(", ");

  return {
    title: typeof recipe.name === "string" ? recipe.name.trim() : "",
    description:
      typeof recipe.description === "string" ? recipe.description.trim() : "",
    ingredients: ingredients.map((i) => i.trim()).filter(Boolean).join("\n"),
    steps: textFromInstructions(recipe.recipeInstructions),
    prepMinutes: parseIsoDurationToMinutes(recipe.prepTime),
    cookMinutes: parseIsoDurationToMinutes(recipe.cookTime),
    servings,
    imageUrl: firstString(recipe.image),
    tags,
  };
}

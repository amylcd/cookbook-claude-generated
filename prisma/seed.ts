import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const recipes = [
  {
    title: "Weeknight Tomato Pasta",
    description: "A fast, reliable pasta for busy evenings.",
    ingredients: [
      "400g spaghetti",
      "2 tbsp olive oil",
      "3 cloves garlic, sliced",
      "1 can crushed tomatoes",
      "1/2 tsp chili flakes",
      "Salt and pepper",
      "Fresh basil",
      "Parmesan, grated",
    ].join("\n"),
    steps: [
      "Bring a large pot of salted water to a boil and cook spaghetti until al dente.",
      "Heat olive oil in a pan, add garlic and chili flakes, cook until fragrant.",
      "Add crushed tomatoes, season with salt and pepper, simmer 10 minutes.",
      "Toss the drained pasta into the sauce.",
      "Serve topped with basil and parmesan.",
    ].join("\n"),
    prepMinutes: 10,
    cookMinutes: 20,
    servings: 4,
    sourceUrl: "",
    imageUrl: "",
    tags: ["italian", "dinner", "quick", "vegetarian"],
  },
  {
    title: "Sheet Pan Chicken & Veggies",
    description: "One pan, minimal cleanup, big flavor.",
    ingredients: [
      "4 chicken thighs",
      "2 cups broccoli florets",
      "1 red bell pepper, sliced",
      "2 tbsp olive oil",
      "1 tsp paprika",
      "1 tsp garlic powder",
      "Salt and pepper",
    ].join("\n"),
    steps: [
      "Preheat oven to 220°C (425°F).",
      "Toss chicken and vegetables with olive oil and spices on a sheet pan.",
      "Roast for 25-30 minutes until chicken is cooked through and vegetables are tender.",
    ].join("\n"),
    prepMinutes: 10,
    cookMinutes: 30,
    servings: 4,
    sourceUrl: "",
    imageUrl: "",
    tags: ["dinner", "healthy", "meal-prep"],
  },
  {
    title: "Classic Pancakes",
    description: "Fluffy weekend breakfast staple.",
    ingredients: [
      "1 1/2 cups flour",
      "3 1/2 tsp baking powder",
      "1 tsp salt",
      "1 tbsp sugar",
      "1 1/4 cups milk",
      "1 egg",
      "3 tbsp melted butter",
    ].join("\n"),
    steps: [
      "Whisk together flour, baking powder, salt, and sugar.",
      "In another bowl, whisk milk, egg, and melted butter.",
      "Combine wet and dry ingredients until just mixed (lumps are fine).",
      "Cook 1/4 cup portions on a hot, greased griddle until bubbles form, then flip.",
    ].join("\n"),
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    sourceUrl: "",
    imageUrl: "",
    tags: ["breakfast", "vegetarian", "quick"],
  },
];

async function main() {
  for (const recipe of recipes) {
    const { tags, ...data } = recipe;
    const tagRecords = await Promise.all(
      tags.map((name) =>
        prisma.tag.upsert({ where: { name }, create: { name }, update: {} })
      )
    );
    await prisma.recipe.create({
      data: {
        ...data,
        description: data.description || null,
        sourceUrl: data.sourceUrl || null,
        imageUrl: data.imageUrl || null,
        tags: { create: tagRecords.map((tag) => ({ tagId: tag.id })) },
      },
    });
  }
  console.log(`Seeded ${recipes.length} recipes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

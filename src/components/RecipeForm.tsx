"use client";

import { useRef, useState, useTransition } from "react";
import { BASE_OPTIONS } from "@/lib/constants";
import { importRecipeFromUrl } from "@/lib/recipeImport";

type RecipeFormValues = {
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
  tags: string;
};

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50";
const labelClass =
  "text-sm font-medium text-zinc-700 dark:text-zinc-300";

export default function RecipeForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initialValues?: Partial<RecipeFormValues>;
  submitLabel: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [importUrl, setImportUrl] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, startImport] = useTransition();

  function setFieldValue(name: string, value: string) {
    const field = formRef.current?.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.value = value;
    }
  }

  function handleImport() {
    const url = importUrl.trim();
    if (!url) return;
    setImportError(null);
    startImport(async () => {
      try {
        const data = await importRecipeFromUrl(url);
        setFieldValue("title", data.title);
        setFieldValue("description", data.description);
        setFieldValue("ingredients", data.ingredients);
        setFieldValue("steps", data.steps);
        setFieldValue("sourceUrl", url);
        if (data.prepMinutes != null)
          setFieldValue("prepMinutes", String(data.prepMinutes));
        if (data.cookMinutes != null)
          setFieldValue("cookMinutes", String(data.cookMinutes));
        if (data.servings != null)
          setFieldValue("servings", String(data.servings));
        if (data.imageUrl) setFieldValue("imageUrl", data.imageUrl);
        if (data.tags) setFieldValue("tags", data.tags);

        const haystack = `${data.title} ${data.ingredients}`.toLowerCase();
        const baseGuess = BASE_OPTIONS.find((option) =>
          haystack.includes(option.toLowerCase())
        );
        if (baseGuess) {
          const radios = formRef.current?.elements.namedItem("base");
          if (radios instanceof RadioNodeList) {
            for (const radio of Array.from(radios)) {
              if (radio instanceof HTMLInputElement) {
                radio.checked = radio.value === baseGuess;
              }
            }
          }
        }
      } catch (err) {
        setImportError(
          err instanceof Error ? err.message : "Couldn't import that recipe."
        );
      }
    });
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
        <label className={labelClass} htmlFor="importUrl">
          Import from a link
        </label>
        <div className="flex gap-2">
          <input
            id="importUrl"
            type="url"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleImport();
              }
            }}
            className={inputClass}
            placeholder="https://example.com/some-recipe"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting || !importUrl.trim()}
            className="shrink-0 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
          >
            {isImporting ? "Importing…" : "Import"}
          </button>
        </div>
        {importError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {importError} You can still fill in the fields below by hand.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initialValues?.title}
          className={inputClass}
          placeholder="Grandma's Lasagna"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <input
          id="description"
          name="description"
          defaultValue={initialValues?.description}
          className={inputClass}
          placeholder="A short note about this recipe"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="prepMinutes">
            Prep (min)
          </label>
          <input
            id="prepMinutes"
            name="prepMinutes"
            type="number"
            min={0}
            defaultValue={initialValues?.prepMinutes ?? undefined}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="cookMinutes">
            Cook (min)
          </label>
          <input
            id="cookMinutes"
            name="cookMinutes"
            type="number"
            min={0}
            defaultValue={initialValues?.cookMinutes ?? undefined}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="servings">
            Servings
          </label>
          <input
            id="servings"
            name="servings"
            type="number"
            min={0}
            defaultValue={initialValues?.servings ?? undefined}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="ingredients">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          required
          rows={6}
          defaultValue={initialValues?.ingredients}
          className={inputClass}
          placeholder={
            "One per line, in metric, e.g.\n300g flour\n5g salt\n(cups are fine too, e.g. 2 cups milk)"
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Base</span>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-600 transition-colors has-checked:border-zinc-950 has-checked:bg-zinc-950 has-checked:text-white dark:border-zinc-700 dark:text-zinc-400 dark:has-checked:border-zinc-50 dark:has-checked:bg-zinc-50 dark:has-checked:text-zinc-950">
            <input
              type="radio"
              name="base"
              value=""
              defaultChecked={!initialValues?.base}
              className="sr-only"
            />
            None
          </label>
          {BASE_OPTIONS.map((option) => (
            <label
              key={option}
              className="cursor-pointer rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-600 transition-colors has-checked:border-zinc-950 has-checked:bg-zinc-950 has-checked:text-white dark:border-zinc-700 dark:text-zinc-400 dark:has-checked:border-zinc-50 dark:has-checked:bg-zinc-50 dark:has-checked:text-zinc-950"
            >
              <input
                type="radio"
                name="base"
                value={option}
                defaultChecked={initialValues?.base === option}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="steps">
          Steps
        </label>
        <textarea
          id="steps"
          name="steps"
          required
          rows={8}
          defaultValue={initialValues?.steps}
          className={inputClass}
          placeholder={"One step per line"}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="tags">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={initialValues?.tags}
          className={inputClass}
          placeholder="comma-separated, e.g. italian, dinner, vegetarian"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="sourceUrl">
            Source URL
          </label>
          <input
            id="sourceUrl"
            name="sourceUrl"
            type="url"
            defaultValue={initialValues?.sourceUrl}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="imageUrl">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={initialValues?.imageUrl}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 self-start rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {submitLabel}
      </button>
    </form>
  );
}

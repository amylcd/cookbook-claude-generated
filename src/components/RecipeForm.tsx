type RecipeFormValues = {
  title: string;
  description: string;
  ingredients: string;
  steps: string;
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
  return (
    <form action={action} className="flex flex-col gap-5">
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
          placeholder={"One per line, e.g.\n2 cups flour\n1 tsp salt"}
        />
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

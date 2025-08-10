"use client";
import clsx from "clsx";

const CATEGORIES = [
  { key: "gym", label: "Gym" },
  { key: "yoga", label: "Yoga" },
  { key: "crossfit", label: "CrossFit" },
  { key: "pilates", label: "Pilates" },
  { key: "martial_arts", label: "Martial Arts" },
  { key: "dance", label: "Dance" },
  { key: "boxing", label: "Boxing" },
  { key: "climbing", label: "Climbing" },
  { key: "swimming", label: "Swimming" },
];

export type CategoryKey = typeof CATEGORIES[number]["key"];

export function CategoryPills({
  selected,
  onToggle,
}: {
  selected: Set<CategoryKey>;
  onToggle: (key: CategoryKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const active = selected.has(c.key as CategoryKey);
        return (
          <button
            key={c.key}
            onClick={() => onToggle(c.key as CategoryKey)}
            className={clsx(
              "px-3 py-1 rounded-full text-sm border",
              active ? "bg-black text-white border-black" : "bg-white text-black border-neutral-300"
            )}
            aria-pressed={active}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}



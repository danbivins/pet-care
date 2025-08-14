"use client";
import clsx from "clsx";
import { Heart, Scissors, Home, GraduationCap, User, AlertTriangle } from "lucide-react";

const CATEGORIES = [
  { key: "veterinary", label: "Veterinarian", Icon: Heart },
  { key: "grooming", label: "Grooming", Icon: Scissors },
  { key: "boarding", label: "Boarding", Icon: Home },
  { key: "training", label: "Training", Icon: GraduationCap },
  { key: "sitting", label: "Pet Sitting", Icon: User },
  { key: "emergency", label: "Emergency", Icon: AlertTriangle },
];

export type CategoryKey = typeof CATEGORIES[number]["key"];

export function CategoryPills({
  selected,
  onToggle,
}: {
  selected: Set<CategoryKey>;
  onToggle: (key: CategoryKey) => void;
}) {
  const chipBg = ["bg-[var(--chip-1)]", "bg-[var(--chip-2)]", "bg-[var(--chip-3)]", "bg-[var(--chip-4)]", "bg-[var(--chip-5)]", "bg-[var(--chip-6)]"];
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c, idx) => {
        const active = selected.has(c.key as CategoryKey);
        const Icon = c.Icon as any;
        return (
          <button
            key={c.key}
            onClick={() => onToggle(c.key as CategoryKey)}
            className={clsx(
              "chip inline-flex items-center gap-2 border",
              active
                ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                : clsx(chipBg[idx % chipBg.length], "text-black border-neutral-200")
            )}
            aria-pressed={active}
          >
            <Icon size={16} />
            {c.label}
          </button>
        );
      })}
    </div>
  );
}



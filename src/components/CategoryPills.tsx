"use client";
import clsx from "clsx";
import { Dumbbell, Activity, Shield, Music, Hand, Mountain, Waves, Leaf, Sparkles } from "lucide-react";

const CATEGORIES = [
  { key: "gym", label: "Gym", Icon: Dumbbell },
  { key: "yoga", label: "Yoga", Icon: Leaf },
  { key: "crossfit", label: "CrossFit", Icon: Activity },
  { key: "pilates", label: "Pilates", Icon: Sparkles },
  { key: "martial_arts", label: "Martial Arts", Icon: Shield },
  { key: "dance", label: "Dance", Icon: Music },
  { key: "boxing", label: "Boxing", Icon: Hand },
  { key: "climbing", label: "Climbing", Icon: Mountain },
  { key: "swimming", label: "Swimming", Icon: Waves },
];

export type CategoryKey = typeof CATEGORIES[number]["key"];

export function CategoryPills({
  selected,
  onToggle,
}: {
  selected: Set<CategoryKey>;
  onToggle: (key: CategoryKey) => void;
}) {
  const chipBg = ["bg-[var(--chip-1)]", "bg-[var(--chip-2)]", "bg-[var(--chip-3)]"];
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



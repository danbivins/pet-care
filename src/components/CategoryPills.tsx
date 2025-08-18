"use client";

export const CATEGORIES = [
  {
    key: "veterinary",
    label: "Veterinarian",
    icon: "🏥",
    description: "Veterinary care and medical services"
  },
  {
    key: "grooming",
    label: "Grooming",
    icon: "✂️",
    description: "Pet grooming and hygiene services"
  },
  {
    key: "boarding",
    label: "Boarding",
    icon: "🏨",
    description: "Pet boarding and daycare facilities"
  },
  {
    key: "pet_trainers",
    label: "Pet Trainers",
    icon: "🎓",
    description: "Professional pet training services"
  },
  {
    key: "pet_sitters",
    label: "Pet Sitters",
    icon: "🏠",
    description: "In-home pet sitting services"
  },
  {
    key: "dog_walkers",
    label: "Dog Walkers",
    icon: "🦮",
    description: "Professional dog walking services"
  },
  {
    key: "emergency",
    label: "Emergency",
    icon: "🚨",
    description: "Emergency veterinary care"
  },
  {
    key: "pet_cremation",
    label: "Pet Cremation",
    icon: "🕯️",
    description: "Pet cremation and memorial services"
  }
];

export type CategoryKey = typeof CATEGORIES[number]["key"];

interface CategoryPillsProps {
  selectedCategories: Set<string>;
  onCategoryToggle: (category: string) => void;
  className?: string;
}

export function CategoryPills({ selectedCategories, onCategoryToggle, className = "" }: CategoryPillsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {CATEGORIES.map((category) => (
        <button
          key={category.key}
          onClick={() => onCategoryToggle(category.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            selectedCategories.has(category.key)
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
          }`}
          aria-pressed={selectedCategories.has(category.key)}
          title={category.description}
        >
          <span className="text-lg" aria-hidden="true">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
}



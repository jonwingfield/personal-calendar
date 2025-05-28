export interface Category {
  id: string;
  label: string;
  colorClass: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'training',
    label: 'Training',
    colorClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'school',
    label: 'School',
    colorClass: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    id: 'personal',
    label: 'Personal',
    colorClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 'other',
    label: 'Other',
    colorClass: 'bg-gray-100 text-gray-800 border-gray-200',
  },
];

// Create a lookup object for easy access by category id
export const CATEGORY_COLORS: Record<string, string> = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category.colorClass;
    return acc;
  },
  {} as Record<string, string>
);

// Default category for new tasks
export const DEFAULT_CATEGORY = 'personal'; 
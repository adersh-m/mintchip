const CATEGORIES = ['All', 'Food', 'Travle', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'];
export type Category = typeof CATEGORIES[number];

interface CategoryFilterProps {
    value: Category;
    onChange: (value: Category) => void;
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as Category)}
            className="border rounded p-1"
        >
            {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
        </select>
    );
}
import React from "react";


interface MonthPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
    const options = React.useMemo(() => {
        const months: string[] = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(month.toLocaleString('default', { month: 'long', year: 'numeric' }));
        }
        return months;
    }, []);

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded p-1"
        >
            {options.map((month, index) => (
                <option key={index} value={month}>
                    {month}
                </option>
            ))}
        </select>
    );  
}
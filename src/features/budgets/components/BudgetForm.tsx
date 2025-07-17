import { useState } from "react";
import { useCreateBudgetMutation } from "../api";
import type { Budget } from "../types";

interface BudgetFormProps {
    month: string;
    onChangeMonth: (month: string) => void;
}

export default function BudgetForm({ month, onChangeMonth }: BudgetFormProps) {
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');

    const [createBudget, { isLoading, isError, error }] = useCreateBudgetMutation();

    const isValid = category.trim() !== '' && Number(limit) > 0 && month !== '';

    let errorMessage: string = '';
    if (isError) {
        if ('status' in error) {
            if (error.status === 'FETCH_ERROR' || error.status === 'PARSING_ERROR') {
                errorMessage = error.error;
            } else {
                errorMessage =
                    typeof error.data === 'string'
                        ? error.data
                        : JSON.stringify(error.data) || 'Server error';
            }
        } else {
            errorMessage = error.message || 'An unexpected error occurred';
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid) return;

        try {
            await createBudget({
                category: category.trim(),
                amount: Number(limit),
                month
            } as Omit<Budget, 'id'>).unwrap();
            
            // Reset form on success
            setCategory('');
            setLimit('');
        } catch {
            // Error is handled by the mutation state
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {isError && (
                <div role="alert" className="text-red-500">
                    Error: {errorMessage}
                </div>
            )}
            
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <input
                    id="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Food, Transport, Entertainment"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
                    Budget Limit
                </label>
                <input
                    id="limit"
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="Enter budget amount"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                    Month
                </label>
                <input
                    id="month"
                    type="month"
                    value={month}
                    onChange={(e) => onChangeMonth(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Adding Budget...' : 'Add Budget'}
            </button>
        </form>
    );
}

import { useGetBudgetsQuery } from '../api';
import Spinner from '../../../components/Spinner';
import type { Budget } from '../types';

interface BudgetListProps {
    monthIso: string; // Format: YYYY-MM
}

export default function BudgetList({ monthIso }: BudgetListProps) {
    const {
        data: budgets = [],
        isLoading,
        isError,
        error,
    } = useGetBudgetsQuery(monthIso);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        let errorMessage: string = '';

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

        return (
            <div className="text-red-500" role="alert">
                Error: {errorMessage}
            </div>
        );
    }

    if (!budgets || budgets.length === 0) {
        return (
            <div className="text-gray-500 text-center py-8">
                No budgets found for this month.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
                Budgets for {monthIso}
            </h3>
            <ul className="divide-y divide-gray-200">
                {budgets.map((budget: Budget) => (
                    <li key={budget.id} className="py-4 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                                {budget.category}
                            </span>
                            {budget.spent !== undefined && (
                                <span className="text-sm text-gray-500">
                                    Spent: ₹{budget.spent.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-medium text-green-600">
                                ₹{budget.amount.toFixed(2)}
                            </span>
                            {budget.spent !== undefined && (
                                <span className="text-xs text-gray-500">
                                    {budget.spent > budget.amount ? 'Over budget' : 'Remaining: ₹' + (budget.amount - budget.spent).toFixed(2)}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

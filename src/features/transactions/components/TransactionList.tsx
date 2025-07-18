import { useGetTransactionsQuery } from '../api';
import Spinner from '../../../components/Spinner'; // Assuming you have a Spinner component
import type { Transaction } from '../types';
import { filterTransactions } from '../utils';

interface TransactionListProps {
    monthIso: string;
    category: string;
}

export default function TransactionList({ monthIso, category }: TransactionListProps) {
    
    const {
        data = [],
        isLoading,
        isError,
        error,
    } = useGetTransactionsQuery(monthIso);
    const filteredTransactions = filterTransactions(data, monthIso, category);

    if (isLoading) {
        return <Spinner />; // Assuming you have a Spinner component for loading state
    }

    if (isError) {
        let errorMessage: string = '';

        // RTK Query “baseQuery” errors can be one of several shapes:
        if ('status' in error) {
            // FetchBaseQueryError
            // { status: number; data: unknown }  OR
            // { status: 'FETCH_ERROR'; error: string }  OR
            // { status: 'PARSING_ERROR'; originalStatus: number; data: unknown; error: string }
            if (error.status === 'FETCH_ERROR' || error.status === 'PARSING_ERROR') {
                errorMessage = error.error;
            } else {
                // assume server returned some data message
                errorMessage =
                    typeof error.data === 'string'
                        ? error.data
                        : JSON.stringify(error.data) || 'Server error';
            }
        } else {
            // SerializedError from a thrown exception
            errorMessage = error.message || 'An unexpected error occurred';
        }

        return <div className='text-red-500'>Error: {errorMessage}</div>; // Display error message if the query fails
    }

    if (!filteredTransactions || filteredTransactions.length === 0) {
        return <div className='text-gray-500'>No transactions found for this month.</div>;
    }

    return (
        <ul>
            {filteredTransactions.map((tx: Transaction) => (
                <li key={tx.id} className="py-2 border-b">
                    <span className="font-semibold">{tx.date}</span> — {tx.category}:{' '}
                    <span className="text-green-600">₹{tx.amount}</span>
                </li>
            ))}
        </ul>
    )
}
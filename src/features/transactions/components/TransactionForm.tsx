import { useState } from "react";
import { useCreateTransactionMutation } from "../api";
import type { Transaction } from "../types";

export default function TransactionForm() {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [wallet, setWallet] = useState<'cash' | 'card'>('cash');
    const [note, setNote] = useState('');

    const [createTransaction, { isLoading, isError, error }] = useCreateTransactionMutation();

    const valid = Number(amount) > 0 && date && category;
    let errorMessage: string = '';
    if (isError) {
        if ('status' in error) {
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
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!valid) return;

        try {
            await createTransaction({
                amount: Number(amount),
                date,
                category,
                wallet,
                note: note || undefined
            } as Omit<Transaction, 'id'>).unwrap();
            
            // Reset form on success
            setAmount('');
            setDate('');
            setCategory('');
            setWallet('cash');
            setNote('');
        } catch {
            // Error is handled by RTK Query
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
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount
                </label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                />
            </div>
            
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                </label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                />
            </div>
            
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
                    required
                />
            </div>
            
            <div>
                <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
                    Wallet
                </label>
                <select
                    id="wallet"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value as 'cash' | 'card')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                </select>
            </div>
            
            <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                    Note
                </label>
                <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add any additional notes..."
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            
            <button
                type="submit"
                disabled={!valid || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Adding Transaction...' : 'Add Transaction'}
            </button>
        </form>
    );
}
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

        await createTransaction({
            amount: Number(amount),
            date,
            category,
            wallet,
            note: note || undefined
        } as Omit<Transaction, 'id'>).unwrap();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            {isError && <div role="alert" className="text-red-500">Error: {errorMessage}</div>}
            <label>Amount
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            </label>
            <label>Date
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>Category
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
            </label>
            <label>Wallet
                <select value={wallet} onChange={(e) => setWallet(e.target.value as 'cash' | 'card')}>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                </select>
            </label>
            <label>Note
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note"></textarea>
            </label>
            <button type="submit" disabled={!valid || isLoading} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                {isLoading ? 'Adding...' : 'Add Transaction'}
            </button>

        </form>
    );
}
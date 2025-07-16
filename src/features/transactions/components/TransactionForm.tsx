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

    const handleSubmit = async (e: React.FormEvent) => {
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
            setAmount('');
            setDate('');
            setCategory('');
            setWallet('cash');
            setNote('');
        } catch (err) {
            console.error("Failed to create transaction:", err);
        }
    };

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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {isError && (
                <div className="text-red-500">Error: {errorMessage || 'Failed to create transaction'}</div>
            )}
            <div>
                <label className="block mb-1">Amount</label>
                <input name="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
            </div>
            <div>
                <label className="block mb-1">Date</label>
                <input name="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
            </div>
            <div>
                <label className="block mb-1">Category</label>
                <input name="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
            </div>
            <div>
                <label className="block mb-1">Wallet</label>
                <select name="wallet"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value as 'cash' | 'card')}
                    className="border p-2 w-full"
                >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                </select>
            </div>
            <div>
                <label className="block mb-1">Note (optional)</label>
                <textarea name="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            <button type="submit"
                disabled={!valid || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
                {isLoading ? 'Adding...' : 'Add Transaction'}
            </button>
        </form>
    );
}
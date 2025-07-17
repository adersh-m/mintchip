import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../../features/transactions/components/CategoryFilter";
import MonthPicker from "../../features/transactions/components/MonthPicker";
import TransactionList from "../../features/transactions/components/TransactionList";
import TransactionForm from "../../features/transactions/components/TransactionForm";

export default function TransactionsPage() {
    const [params, setParams] = useSearchParams();
    const month = params.get('month') || new Date().toISOString().slice(0, 7);
    const category = params.get('category') || 'All';

    const updatedMonth = (newMonth: string) => {
        setParams((prev) => {
            prev.set('month', newMonth);
            return prev;
        });
    }

    const updatedCategory = (newCategory: string) => {
        setParams((prev) => {
            prev.set('category', newCategory);
            return prev;
        });
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Transaction</h1>
                <TransactionForm />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
                <div className="flex gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Month</label>
                        <MonthPicker value={month} onChange={updatedMonth} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
                        <CategoryFilter value={category} onChange={updatedCategory} />
                    </div>
                </div>
                <TransactionList monthIso={month} category={category} />
            </div>
        </div>
    )
}
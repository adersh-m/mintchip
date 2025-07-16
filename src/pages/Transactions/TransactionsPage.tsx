import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../../features/transactions/components/CategoryFilter";
import MonthPicker from "../../features/transactions/components/MonthPicker";
import TransactionList from "../../features/transactions/components/TransactionList";

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
        <div className="space-y-4">
            <div className="flex gap-2">
                <MonthPicker value={month} onChange={updatedMonth} />
                <CategoryFilter value={category} onChange={updatedCategory} />
            </div>
            <TransactionList monthIso={month} category={category} />
        </div>
    )
}
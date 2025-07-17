import { useSearchParams } from "react-router-dom";
import BudgetForm from "../features/budgets/components/BudgetForm";
import BudgetList from "../features/budgets/components/BudgetList";

export default function BudgetPage() {
    const [params, setParams] = useSearchParams();
    const month = params.get("month") || new Date().toISOString().slice(0, 7);

    const handleChangeMonth = (month: string) => {
        setParams((prev) => {
            prev.set("month", month);
            return prev;
        });
    }
    
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Budget for {month}</h1>
                <BudgetForm month={month} onChangeMonth={handleChangeMonth} />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Overview</h2>
                <BudgetList monthIso={month} />
            </div>
        </div>
    );
}
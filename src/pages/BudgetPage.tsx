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
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold">Budget for {month}</h1>
            <BudgetForm month={month} onChangeMonth={handleChangeMonth} />
            <BudgetList monthIso={month} />
        </div>
    );
}
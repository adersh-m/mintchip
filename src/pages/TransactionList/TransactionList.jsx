import { useAppSelector } from '../../app/hooks';
import { selectAllTransactions } from '../../features/transactions/transactionsSlice';

export function TransactionList() {
    const transactions = useAppSelector(selectAllTransactions);

    return (
        <ul>
            {transactions.map((transaction) => (
                <li key={transaction.id}>
                    <span>{transaction.date}</span>
                    <span>{transaction.amount}</span>
                    <span>{transaction.description}</span>
                </li>
            ))}     
        </ul>
    )
}
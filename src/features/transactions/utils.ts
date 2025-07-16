import type { Transaction } from './types';

export function filterTransactions(
    tsx: Transaction[],
    monthIso: string,
    category: string,  
): Transaction[] {
    return tsx.filter((tx) => {
        const monthMatch = tx.date.startsWith(monthIso);
        const categoryMatch = category === 'All' || tx.category === category;
        return monthMatch && categoryMatch;
    })
}
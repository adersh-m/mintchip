export interface Transaction {
    id: string;
    amount: number;
    category: string;
    date: string;
    note?: string;
    wallet: 'cash' | 'card'
}
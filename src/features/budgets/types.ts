export interface Budget {
    id: string;
    category: string;
    amount: number;
    month: string; // Format: YYYY-MM
    spent?: number; // Current spending in this category for the month
}

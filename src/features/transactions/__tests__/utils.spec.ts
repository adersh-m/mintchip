import { describe, it, expect } from "vitest";
import { filterTransactions } from "../utils";
import type { Transaction } from "../types";

const sample: Transaction[] = [
    { id: "1", amount: 100, category: "Food", date: "2023-10-01", wallet: "cash" },
    { id: "2", amount: 200, category: "Travel", date: "2023-10-02", wallet: "card" },
    { id: "3", amount: 150, category: "Bills", date: "2023-10-03", wallet: "cash" },
    { id: "4", amount: 300, category: "Entertainment", date: "2023-10-04", wallet: "card" },
    { id: "5", amount: 250, category: "Shopping", date: "2023-10-05", wallet: "cash" },
];

describe("filterTransactions", () => {
    it('filters by month and category', () => {
        const result = filterTransactions(sample, "2023-10", "Food");
        expect(result).toEqual([
            { id: "1", amount: 100, category: "Food", date: "2023-10-01", wallet: "cash" }
        ]);
    });
    it('returns all transactions for "All" category', () => {
        const result = filterTransactions(sample, "2023-10", "All");
        expect(result).toEqual(sample);
    });
    it('returns empty array for no matches', () => {
        const result = filterTransactions(sample, "2023-10", "NonExistent");
        expect(result).toEqual([]);
    });
});
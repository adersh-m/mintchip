import { describe, expect, it, } from "vitest";
import transactionReducer, { selectAllTransactions } from "../transactionsSlice";
import { store } from "../../../app/store";
import { transactionAdded } from "../transactionsSlice";

describe('transactions slice', () => {
    it('starts with an empty state', () => {
        const initialState = transactionReducer(undefined, { type: 'init' });
        expect(initialState.ids.length).toBe(0);
    });
});

test('selectAllTransactions picks up added items', () => {
    store.dispatch(
        transactionAdded({ amount: 100, category: 'Food', date: '2023-10-01', wallet: 'card' })
    );

    const all = selectAllTransactions(store.getState());
    expect(all).toHaveLength(1);
    expect(all[0].amount).toBe(100);
});
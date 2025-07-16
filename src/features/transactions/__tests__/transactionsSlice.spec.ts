import { describe, expect, it } from "vitest";
import transactionReducer from "../transactionsSlice";

describe('transactions slice', () => {
    it('starts with an empty state', () => {
        const initialState = transactionReducer(undefined, { type: 'init' });
        expect(initialState.ids.length).toBe(0);
    });
});
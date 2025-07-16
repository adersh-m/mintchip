import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import type { Transaction } from "./types";
import type { RootState } from "../../app/store";

const adapter = createEntityAdapter<Transaction>({
    sortComparer: (a,b) => b.date.localeCompare(a.date),
});

export const transactionSlice = createSlice({
    name: "transactions",
    initialState: adapter.getInitialState(),
    reducers: {
        transactionAdded: {
            reducer: adapter.addOne,
            prepare: (data: Omit<Transaction, 'id'>) => ({
                payload: {id: nanoid(), ...data},
            }),
        },
        transactionUpdated: adapter.updateOne,
        transactionDeleted: adapter.removeOne,
    },
});

export const {
    transactionAdded,
    transactionUpdated,
    transactionDeleted,
} = transactionSlice.actions;

export default transactionSlice.reducer;

export const transactionSelectors = adapter.getSelectors<RootState>((s) => s.transactions);
import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import type { Budget } from "./types";
import type { RootState } from "../../app/store";

const adapter = createEntityAdapter<Budget>({
    sortComparer: (a, b) => b.month.localeCompare(a.month) || a.category.localeCompare(b.category),
});

export const budgetSlice = createSlice({
    name: "budgets",
    initialState: adapter.getInitialState(),
    reducers: {
        budgetAdded: {
            reducer: adapter.addOne,
            prepare: (data: Omit<Budget, 'id'>) => ({
                payload: { id: nanoid(), ...data },
            }),
        },
        budgetUpdated: adapter.updateOne,
        budgetDeleted: adapter.removeOne,
    },
});

export const {
    budgetAdded,
    budgetUpdated,
    budgetDeleted,
} = budgetSlice.actions;

export const {
    selectAll: selectAllBudgets,
    selectById: selectBudgetById,
    selectIds: selectBudgetIds,
    selectEntities: selectBudgetEntities,
} = adapter.getSelectors<RootState>((s) => s.budgets);

export default budgetSlice.reducer;

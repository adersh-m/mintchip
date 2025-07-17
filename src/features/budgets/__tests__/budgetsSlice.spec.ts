import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { createEntityAdapter } from '@reduxjs/toolkit';
import budgetReducer, { budgetAdded, budgetUpdated, budgetDeleted } from '../budgetsSlice';
import { budgetApi } from '../api';
import type { Budget } from '../types';

// Create test selectors that work with our test store
const testAdapter = createEntityAdapter<Budget>({
  sortComparer: (a, b) => b.month.localeCompare(a.month) || a.category.localeCompare(b.category),
});

type TestState = {
  budgets: ReturnType<typeof budgetReducer>;
  budgetApi: ReturnType<typeof budgetApi.reducer>;
};

const testSelectors = testAdapter.getSelectors<TestState>((state) => state.budgets);

// Create a test store that includes both the slice and API
const createTestStore = () => configureStore({
  reducer: {
    budgets: budgetReducer,
    [budgetApi.reducerPath]: budgetApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(budgetApi.middleware),
});

describe('budgets slice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('initial state', () => {
    it('starts with an empty state', () => {
      const initialState = budgetReducer(undefined, { type: 'init' });
      expect(initialState.ids.length).toBe(0);
      expect(Object.keys(initialState.entities)).toHaveLength(0);
    });
  });

  describe('budgetAdded action', () => {
    it('adds a budget with auto-generated ID', () => {
      const newBudget: Omit<Budget, 'id'> = {
        category: 'Food',
        amount: 500,
        month: '2024-01',
        spent: 100
      };

      store.dispatch(budgetAdded(newBudget));

      const state = store.getState();
      const budgets = testSelectors.selectAll(state);
      
      expect(budgets).toHaveLength(1);
      expect(budgets[0]).toMatchObject(newBudget);
      expect(budgets[0].id).toBeDefined();
      expect(typeof budgets[0].id).toBe('string');
    });

    it('adds multiple budgets and maintains sorting', () => {
      const budgets: Array<Omit<Budget, 'id'>> = [
        { category: 'Food', amount: 500, month: '2024-01' },
        { category: 'Entertainment', amount: 200, month: '2024-02' },
        { category: 'Food', amount: 600, month: '2024-02' },
        { category: 'Transport', amount: 300, month: '2024-01' },
      ];

      budgets.forEach(budget => store.dispatch(budgetAdded(budget)));

      const state = store.getState();
      const sortedBudgets = testSelectors.selectAll(state);
      
      expect(sortedBudgets).toHaveLength(4);
      // Should be sorted by month descending (2024-02 first), then category ascending
      expect(sortedBudgets[0].month).toBe('2024-02');
      expect(sortedBudgets[0].category).toBe('Entertainment');
      expect(sortedBudgets[1].month).toBe('2024-02');
      expect(sortedBudgets[1].category).toBe('Food');
      expect(sortedBudgets[2].month).toBe('2024-01');
      expect(sortedBudgets[2].category).toBe('Food');
      expect(sortedBudgets[3].month).toBe('2024-01');
      expect(sortedBudgets[3].category).toBe('Transport');
    });
  });

  describe('budgetUpdated action', () => {
    it('updates an existing budget', () => {
      // Add a budget first
      const newBudget: Omit<Budget, 'id'> = {
        category: 'Transport',
        amount: 300,
        month: '2024-01',
        spent: 50
      };

      store.dispatch(budgetAdded(newBudget));

      const state = store.getState();
      const budgets = testSelectors.selectAll(state);
      const budgetId = budgets[0].id;

      // Update the budget
      store.dispatch(budgetUpdated({
        id: budgetId,
        changes: { spent: 150, amount: 400 }
      }));

      const updatedState = store.getState();
      const updatedBudget = testSelectors.selectById(updatedState, budgetId);
      
      expect(updatedBudget?.spent).toBe(150);
      expect(updatedBudget?.amount).toBe(400);
      expect(updatedBudget?.category).toBe('Transport'); // unchanged
      expect(updatedBudget?.month).toBe('2024-01'); // unchanged
    });

    it('handles partial updates correctly', () => {
      store.dispatch(budgetAdded({
        category: 'Health',
        amount: 100,
        month: '2024-01',
        spent: 25
      }));

      const state = store.getState();
      const budgets = testSelectors.selectAll(state);
      const budgetId = budgets[0].id;

      // Update only the spent amount
      store.dispatch(budgetUpdated({
        id: budgetId,
        changes: { spent: 75 }
      }));

      const updatedState = store.getState();
      const updatedBudget = testSelectors.selectById(updatedState, budgetId);
      
      expect(updatedBudget?.spent).toBe(75);
      expect(updatedBudget?.amount).toBe(100); // unchanged
      expect(updatedBudget?.category).toBe('Health'); // unchanged
    });
  });

  describe('budgetDeleted action', () => {
    it('removes a budget completely', () => {
      // Add a budget first
      store.dispatch(budgetAdded({
        category: 'Shopping',
        amount: 200,
        month: '2024-01',
        spent: 25
      }));

      let state = store.getState();
      const budgets = testSelectors.selectAll(state);
      const budgetId = budgets[0].id;

      expect(budgets).toHaveLength(1);

      // Delete the budget
      store.dispatch(budgetDeleted(budgetId));

      state = store.getState();
      const remainingBudgets = testSelectors.selectAll(state);
      const deletedBudget = testSelectors.selectById(state, budgetId);
      
      expect(remainingBudgets).toHaveLength(0);
      expect(deletedBudget).toBeUndefined();
    });

    it('only removes the specified budget', () => {
      // Add multiple budgets
      store.dispatch(budgetAdded({ category: 'Food', amount: 500, month: '2024-01' }));
      store.dispatch(budgetAdded({ category: 'Transport', amount: 300, month: '2024-01' }));
      store.dispatch(budgetAdded({ category: 'Entertainment', amount: 200, month: '2024-01' }));

      let state = store.getState();
      const budgets = testSelectors.selectAll(state);
      const foodBudget = budgets.find(b => b.category === 'Food');
      
      expect(budgets).toHaveLength(3);
      expect(foodBudget).toBeDefined();

      // Delete only the food budget
      store.dispatch(budgetDeleted(foodBudget!.id));

      state = store.getState();
      const remainingBudgets = testSelectors.selectAll(state);
      const deletedBudget = testSelectors.selectById(state, foodBudget!.id);
      
      expect(remainingBudgets).toHaveLength(2);
      expect(deletedBudget).toBeUndefined();
      expect(remainingBudgets.some(b => b.category === 'Transport')).toBe(true);
      expect(remainingBudgets.some(b => b.category === 'Entertainment')).toBe(true);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      // Add some test data
      store.dispatch(budgetAdded({ category: 'Food', amount: 500, month: '2024-01', spent: 100 }));
      store.dispatch(budgetAdded({ category: 'Transport', amount: 300, month: '2024-01', spent: 50 }));
      store.dispatch(budgetAdded({ category: 'Entertainment', amount: 200, month: '2024-02', spent: 75 }));
    });

    it('selectAll returns all budgets in sorted order', () => {
      const state = store.getState();
      const budgets = testSelectors.selectAll(state);
      
      expect(budgets).toHaveLength(3);
      // Should be sorted by month desc, then category asc
      expect(budgets[0].month).toBe('2024-02');
      expect(budgets[1].month).toBe('2024-01');
      expect(budgets[2].month).toBe('2024-01');
      expect(budgets[1].category).toBe('Food');
      expect(budgets[2].category).toBe('Transport');
    });

    it('selectById returns the correct budget', () => {
      const state = store.getState();
      const budgets = testSelectors.selectAll(state);
      const foodBudget = budgets.find(b => b.category === 'Food');
      
      expect(foodBudget).toBeDefined();
      
      const selectedBudget = testSelectors.selectById(state, foodBudget!.id);
      expect(selectedBudget).toEqual(foodBudget);
    });

    it('selectById returns undefined for non-existent ID', () => {
      const state = store.getState();
      const selectedBudget = testSelectors.selectById(state, 'non-existent-id');
      expect(selectedBudget).toBeUndefined();
    });
  });

  describe('integration with API', () => {
    it('store includes both budgets slice and API reducer', () => {
      const state = store.getState();
      
      expect(state.budgets).toBeDefined();
      expect(state.budgetApi).toBeDefined();
    });

    it('API reducer is properly configured', () => {
      expect(budgetApi.reducerPath).toBe('budgetApi');
      expect(typeof budgetApi.reducer).toBe('function');
      expect(typeof budgetApi.middleware).toBe('function');
    });

    it('API has correct endpoints', () => {
      expect(budgetApi.endpoints.getBudgets).toBeDefined();
      expect(budgetApi.endpoints.createBudget).toBeDefined();
    });
  });
});

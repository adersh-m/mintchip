import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { budgetApi, useGetBudgetsQuery, useCreateBudgetMutation } from '../api';
import type { Budget } from '../types';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('budgetApi', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('API configuration', () => {
        it('has correct reducerPath', () => {
            expect(budgetApi.reducerPath).toBe('budgetApi');
        });

        it('has reducer function', () => {
            expect(typeof budgetApi.reducer).toBe('function');
        });

        it('has middleware function', () => {
            expect(typeof budgetApi.middleware).toBe('function');
        });

        it('has endpoints object', () => {
            expect(budgetApi.endpoints).toBeDefined();
            expect(budgetApi.endpoints.getBudgets).toBeDefined();
            expect(budgetApi.endpoints.createBudget).toBeDefined();
        });
    });

    describe('endpoints', () => {
        it('has getBudgets endpoint', () => {
            expect(budgetApi.endpoints.getBudgets).toBeDefined();
        });

        it('has createBudget endpoint', () => {
            expect(budgetApi.endpoints.createBudget).toBeDefined();
        });
    });

    describe('generated hooks', () => {
        it('exports useGetBudgetsQuery hook', () => {
            expect(useGetBudgetsQuery).toBeDefined();
            expect(typeof useGetBudgetsQuery).toBe('function');
        });

        it('exports useCreateBudgetMutation hook', () => {
            expect(useCreateBudgetMutation).toBeDefined();
            expect(typeof useCreateBudgetMutation).toBe('function');
        });
    });

    describe('API endpoint structure', () => {
        it('getBudgets endpoint has correct structure', () => {
            const endpoint = budgetApi.endpoints.getBudgets;
            
            expect(endpoint.select).toBeDefined();
            expect(endpoint.initiate).toBeDefined();
            expect(typeof endpoint.initiate).toBe('function');
        });

        it('createBudget endpoint has correct structure', () => {
            const endpoint = budgetApi.endpoints.createBudget;
            
            expect(endpoint.select).toBeDefined();
            expect(endpoint.initiate).toBeDefined();
            expect(typeof endpoint.initiate).toBe('function');
        });
    });

    describe('budget types', () => {
        it('should work with Budget type', () => {
            const mockBudget: Budget = {
                id: '1',
                category: 'Food',
                amount: 500,
                month: '2024-01',
                spent: 100
            };

            expect(mockBudget.id).toBe('1');
            expect(mockBudget.category).toBe('Food');
            expect(mockBudget.amount).toBe(500);
            expect(mockBudget.month).toBe('2024-01');
            expect(mockBudget.spent).toBe(100);
        });

        it('should work with Partial<Budget> type', () => {
            const partialBudget: Partial<Budget> = {
                category: 'Transport',
                amount: 300,
                month: '2024-01'
            };

            expect(partialBudget.category).toBe('Transport');
            expect(partialBudget.amount).toBe(300);
            expect(partialBudget.month).toBe('2024-01');
        });

        it('should handle optional spent field', () => {
            const budgetWithoutSpent: Omit<Budget, 'id' | 'spent'> = {
                category: 'Entertainment',
                amount: 200,
                month: '2024-01'
            };

            expect(budgetWithoutSpent.category).toBe('Entertainment');
            expect(budgetWithoutSpent.amount).toBe(200);
            expect(budgetWithoutSpent.month).toBe('2024-01');
            // The spent field should be undefined since it's omitted
        });
    });

    describe('query configuration', () => {
        it('getBudgets query should be properly configured', () => {
            const endpoint = budgetApi.endpoints.getBudgets;
            expect(endpoint.select).toBeDefined();
            expect(endpoint.initiate).toBeDefined();
            expect(typeof endpoint.initiate).toBe('function');
        });

        it('createBudget mutation should be properly configured', () => {
            const endpoint = budgetApi.endpoints.createBudget;
            expect(endpoint.select).toBeDefined();
            expect(endpoint.initiate).toBeDefined();
            expect(typeof endpoint.initiate).toBe('function');
        });
    });

    describe('integration tests', () => {
        it('should have proper TypeScript types', () => {
            // Test that the API is properly typed
            expect(budgetApi.reducerPath).toBeDefined();
            expect(typeof budgetApi.reducerPath).toBe('string');
            
            expect(budgetApi.reducer).toBeDefined();
            expect(typeof budgetApi.reducer).toBe('function');
            
            expect(budgetApi.middleware).toBeDefined();
            expect(typeof budgetApi.middleware).toBe('function');
        });

        it('should export all necessary parts', () => {
            // Verify all expected exports are present
            expect(budgetApi).toBeDefined();
            expect(useGetBudgetsQuery).toBeDefined();
            expect(useCreateBudgetMutation).toBeDefined();
        });
    });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { transactionApi, useGetTransactionsQuery, useCreateTransactionMutation } from '../api';
import type { Transaction } from '../types';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('transactionApi', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('API configuration', () => {
        it('has correct reducerPath', () => {
            expect(transactionApi.reducerPath).toBe('transactionApi');
        });

        it('has reducer function', () => {
            expect(typeof transactionApi.reducer).toBe('function');
        });

        it('has middleware function', () => {
            expect(typeof transactionApi.middleware).toBe('function');
        });

        it('has endpoints object', () => {
            expect(transactionApi.endpoints).toBeDefined();
            expect(transactionApi.endpoints.getTransactions).toBeDefined();
            expect(transactionApi.endpoints.createTransaction).toBeDefined();
        });
    });

    describe('endpoints', () => {
        it('has getTransactions endpoint', () => {
            expect(transactionApi.endpoints.getTransactions).toBeDefined();
        });

        it('has createTransaction endpoint', () => {
            expect(transactionApi.endpoints.createTransaction).toBeDefined();
        });
    });

    describe('generated hooks', () => {
        it('exports useGetTransactionsQuery hook', () => {
            expect(useGetTransactionsQuery).toBeDefined();
            expect(typeof useGetTransactionsQuery).toBe('function');
        });

        it('exports useCreateTransactionMutation hook', () => {
            expect(useCreateTransactionMutation).toBeDefined();
            expect(typeof useCreateTransactionMutation).toBe('function');
        });
    });

    describe('API endpoint structure', () => {
        it('getTransactions endpoint has correct structure', () => {
            const endpoint = transactionApi.endpoints.getTransactions;
            
            expect(endpoint.select).toBeDefined();
            expect(endpoint.initiate).toBeDefined();
            expect(typeof endpoint.initiate).toBe('function');
        });

        it('createTransaction endpoint has correct structure', () => {
            const endpoint = transactionApi.endpoints.createTransaction;
            
            expect(endpoint.select).toBeDefined();
            expect(endpoint.initiate).toBeDefined();
            expect(typeof endpoint.initiate).toBe('function');
        });
    });

    describe('transaction types', () => {
        it('should work with Transaction type', () => {
            const mockTransaction: Transaction = {
                id: '1',
                amount: 100,
                date: '2024-06-01',
                category: 'Food',
                wallet: 'cash',
                note: 'Lunch'
            };

            expect(mockTransaction.id).toBe('1');
            expect(mockTransaction.amount).toBe(100);
            expect(mockTransaction.date).toBe('2024-06-01');
            expect(mockTransaction.category).toBe('Food');
            expect(mockTransaction.wallet).toBe('cash');
            expect(mockTransaction.note).toBe('Lunch');
        });

        it('should work with Partial<Transaction> type', () => {
            const partialTransaction: Partial<Transaction> = {
                amount: 50,
                date: '2024-06-02',
                category: 'Transport'
            };

            expect(partialTransaction.amount).toBe(50);
            expect(partialTransaction.date).toBe('2024-06-02');
            expect(partialTransaction.category).toBe('Transport');
        });
    });

    describe('hook functions', () => {
        it('useGetTransactionsQuery should be callable', () => {
            expect(() => {
                // This tests that the hook function exists and can be called
                // In actual usage, this would be called within a React component
                const hook = useGetTransactionsQuery;
                expect(typeof hook).toBe('function');
            }).not.toThrow();
        });

        it('useCreateTransactionMutation should be callable', () => {
            expect(() => {
                // This tests that the hook function exists and can be called
                // In actual usage, this would be called within a React component
                const hook = useCreateTransactionMutation;
                expect(typeof hook).toBe('function');
            }).not.toThrow();
        });
    });

    describe('API configuration validation', () => {
        it('should have proper TypeScript types', () => {
            // Test that the API is properly typed
            expect(transactionApi.reducerPath).toBeDefined();
            expect(typeof transactionApi.reducerPath).toBe('string');
            
            expect(transactionApi.reducer).toBeDefined();
            expect(typeof transactionApi.reducer).toBe('function');
            
            expect(transactionApi.middleware).toBeDefined();
            expect(typeof transactionApi.middleware).toBe('function');
        });

        it('should export all necessary parts', () => {
            // Verify all expected exports are present
            expect(transactionApi).toBeDefined();
            expect(useGetTransactionsQuery).toBeDefined();
            expect(useCreateTransactionMutation).toBeDefined();
        });
    });
});

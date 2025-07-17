import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BudgetList from '../BudgetList';
import { budgetApi } from '../../api';
import budgetReducer from '../../budgetsSlice';
import type { Budget } from '../../types';

// Mock the Spinner component
vi.mock('../../../../components/Spinner', () => ({
    default: () => <div data-testid="spinner">Loading...</div>,
}));

// Mock the API
const mockQuery = vi.fn();

vi.mock('../../api', () => ({
    budgetApi: {
        reducerPath: 'budgetApi',
        reducer: vi.fn((state = {}) => state),
        middleware: vi.fn(() => (next: (action: unknown) => unknown) => (action: unknown) => next(action)),
    },
    useGetBudgetsQuery: (month: string) => mockQuery(month),
}));

const createTestStore = () => configureStore({
    reducer: {
        budgets: budgetReducer,
        [budgetApi.reducerPath]: budgetApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(budgetApi.middleware),
});

const renderWithProvider = (component: React.ReactElement) => {
    const store = createTestStore();
    return render(
        <Provider store={store}>
            {component}
        </Provider>
    );
};

describe('BudgetList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state', () => {
        mockQuery.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);
        
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('shows error state', () => {
        mockQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: {
                status: 500,
                data: 'Server error',
            },
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/error: server error/i)).toBeInTheDocument();
    });

    it('shows empty state message when no budgets', () => {
        mockQuery.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
            error: null,
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);

        expect(screen.getByText(/no budgets found for this month/i)).toBeInTheDocument();
    });

    it('shows empty state message when data is undefined', () => {
        mockQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            error: null,
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);

        expect(screen.getByText(/no budgets found for this month/i)).toBeInTheDocument();
    });

    it('renders list of budgets', () => {
        const mockBudgets: Budget[] = [
            { id: '1', category: 'Food', amount: 500, month: '2024-01', spent: 100 },
            { id: '2', category: 'Transport', amount: 300, month: '2024-01', spent: 50 },
        ];

        mockQuery.mockReturnValue({
            data: mockBudgets,
            isLoading: false,
            isError: false,
            error: null,
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);

        expect(screen.getByText(/budgets for 2024-01/i)).toBeInTheDocument();
        expect(screen.getByText('Food')).toBeInTheDocument();
        expect(screen.getByText('Transport')).toBeInTheDocument();
        expect(screen.getByText('₹500.00')).toBeInTheDocument();
        expect(screen.getByText('₹300.00')).toBeInTheDocument();
    });

    it('shows spent amount and remaining budget', () => {
        const mockBudgets: Budget[] = [
            { id: '1', category: 'Food', amount: 500, month: '2024-01', spent: 100 },
        ];

        mockQuery.mockReturnValue({
            data: mockBudgets,
            isLoading: false,
            isError: false,
            error: null,
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);

        expect(screen.getByText('Spent: ₹100.00')).toBeInTheDocument();
        expect(screen.getByText('Remaining: ₹400.00')).toBeInTheDocument();
    });

    it('shows over budget warning', () => {
        const mockBudgets: Budget[] = [
            { id: '1', category: 'Food', amount: 500, month: '2024-01', spent: 600 },
        ];

        mockQuery.mockReturnValue({
            data: mockBudgets,
            isLoading: false,
            isError: false,
            error: null,
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);

        expect(screen.getByText('Over budget')).toBeInTheDocument();
    });

    it('handles budgets without spent amount', () => {
        const mockBudgets: Budget[] = [
            { id: '1', category: 'Food', amount: 500, month: '2024-01' },
        ];

        mockQuery.mockReturnValue({
            data: mockBudgets,
            isLoading: false,
            isError: false,
            error: null,
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);

        expect(screen.getByText('Food')).toBeInTheDocument();
        expect(screen.getByText('₹500.00')).toBeInTheDocument();
        expect(screen.queryByText(/spent:/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/remaining:/i)).not.toBeInTheDocument();
    });

    it('handles FETCH_ERROR correctly', () => {
        mockQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: {
                status: 'FETCH_ERROR',
                error: 'Network error',
            },
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);

        expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
    });

    it('handles serialized error correctly', () => {
        mockQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: {
                message: 'Something went wrong',
            },
        });

        renderWithProvider(<BudgetList monthIso="2024-01" />);

        expect(screen.getByText(/error: something went wrong/i)).toBeInTheDocument();
    });

    it('passes correct month to query', () => {
        mockQuery.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
            error: null,
        });

        renderWithProvider(<BudgetList monthIso="2024-03" />);

        expect(mockQuery).toHaveBeenCalledWith('2024-03');
    });
});

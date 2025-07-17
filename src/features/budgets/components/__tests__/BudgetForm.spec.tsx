import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BudgetForm from '../BudgetForm';
import { budgetApi } from '../../api';
import budgetReducer from '../../budgetsSlice';

// Mock the API calls
const mockMutationResult = {
    unwrap: vi.fn(),
};

const mockCreateBudgetMutation = vi.fn(() => mockMutationResult);

vi.mock('../../api', () => ({
    budgetApi: {
        reducerPath: 'budgetApi',
        reducer: vi.fn((state = {}) => state),
        middleware: vi.fn(() => (next: (action: unknown) => unknown) => (action: unknown) => next(action)),
    },
    useCreateBudgetMutation: () => [
        mockCreateBudgetMutation,
        {
            isLoading: false,
            isError: false,
            error: null,
        },
    ],
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

describe('BudgetForm', () => {
    let mockOnChangeMonth: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        vi.clearAllMocks();
        mockOnChangeMonth = vi.fn();
        mockMutationResult.unwrap.mockResolvedValue({ id: '1', category: 'Food', amount: 500, month: '2024-01' });
    });

    it('renders all form fields', () => {
        renderWithProvider(<BudgetForm month="2024-01" onChangeMonth={mockOnChangeMonth} />);
        
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/budget limit/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/month/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add budget/i })).toBeInTheDocument();
    });

    it('has submit button disabled when form is invalid', () => {
        renderWithProvider(<BudgetForm month="" onChangeMonth={mockOnChangeMonth} />);
        
        const submitButton = screen.getByRole('button', { name: /add budget/i });
        expect(submitButton).toBeDisabled();
    });

    it('enables submit button when all fields are valid', async () => {
        renderWithProvider(<BudgetForm month="2024-01" onChangeMonth={mockOnChangeMonth} />);
        
        const categoryInput = screen.getByLabelText(/category/i);
        const limitInput = screen.getByLabelText(/budget limit/i);
        const submitButton = screen.getByRole('button', { name: /add budget/i });

        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(limitInput, { target: { value: '500' } });

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    it('keeps submit button disabled with invalid limit', async () => {
        renderWithProvider(<BudgetForm month="2024-01" onChangeMonth={mockOnChangeMonth} />);
        
        const categoryInput = screen.getByLabelText(/category/i);
        const limitInput = screen.getByLabelText(/budget limit/i);
        const submitButton = screen.getByRole('button', { name: /add budget/i });

        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(limitInput, { target: { value: '0' } });

        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });
    });

    it('keeps submit button disabled with empty category', async () => {
        renderWithProvider(<BudgetForm month="2024-01" onChangeMonth={mockOnChangeMonth} />);
        
        const categoryInput = screen.getByLabelText(/category/i);
        const limitInput = screen.getByLabelText(/budget limit/i);
        const submitButton = screen.getByRole('button', { name: /add budget/i });

        fireEvent.change(categoryInput, { target: { value: '   ' } }); // Only whitespace
        fireEvent.change(limitInput, { target: { value: '500' } });

        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });
    });

    it('keeps submit button disabled with empty month', async () => {
        renderWithProvider(<BudgetForm month="" onChangeMonth={mockOnChangeMonth} />);
        
        const categoryInput = screen.getByLabelText(/category/i);
        const limitInput = screen.getByLabelText(/budget limit/i);
        const submitButton = screen.getByRole('button', { name: /add budget/i });

        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(limitInput, { target: { value: '500' } });

        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });
    });

    it('triggers mutation on valid form submission', async () => {
        renderWithProvider(<BudgetForm month="2024-01" onChangeMonth={mockOnChangeMonth} />);
        
        const categoryInput = screen.getByLabelText(/category/i);
        const limitInput = screen.getByLabelText(/budget limit/i);
        const submitButton = screen.getByRole('button', { name: /add budget/i });

        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(limitInput, { target: { value: '500' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockCreateBudgetMutation).toHaveBeenCalledWith({
                category: 'Food',
                amount: 500,
                month: '2024-01'
            });
        });
    });

    it('resets form on successful submission', async () => {
        renderWithProvider(<BudgetForm month="2024-01" onChangeMonth={mockOnChangeMonth} />);
        
        const categoryInput = screen.getByLabelText(/category/i) as HTMLInputElement;
        const limitInput = screen.getByLabelText(/budget limit/i) as HTMLInputElement;
        const monthInput = screen.getByLabelText(/month/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /add budget/i });

        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(limitInput, { target: { value: '500' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(categoryInput.value).toBe('');
            expect(limitInput.value).toBe('');
            // Month should not be reset as it's controlled by parent
            expect(monthInput.value).toBe('2024-01');
        });
    });

    it('calls onChangeMonth when month input changes', () => {
        renderWithProvider(<BudgetForm month="2024-01" onChangeMonth={mockOnChangeMonth} />);
        
        const monthInput = screen.getByLabelText(/month/i);
        fireEvent.change(monthInput, { target: { value: '2024-02' } });

        expect(mockOnChangeMonth).toHaveBeenCalledWith('2024-02');
    });

    it('does not submit when form is invalid', async () => {
        renderWithProvider(<BudgetForm month="" onChangeMonth={mockOnChangeMonth} />);
        
        const categoryInput = screen.getByLabelText(/category/i);
        const limitInput = screen.getByLabelText(/budget limit/i);
        const submitButton = screen.getByRole('button', { name: /add budget/i });

        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(limitInput, { target: { value: '500' } });
        // Month is empty

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockCreateBudgetMutation).not.toHaveBeenCalled();
        });
    });

    it('trims whitespace from category', async () => {
        renderWithProvider(<BudgetForm month="2024-01" onChangeMonth={mockOnChangeMonth} />);
        
        const categoryInput = screen.getByLabelText(/category/i);
        const limitInput = screen.getByLabelText(/budget limit/i);
        const submitButton = screen.getByRole('button', { name: /add budget/i });

        fireEvent.change(categoryInput, { target: { value: '  Food  ' } });
        fireEvent.change(limitInput, { target: { value: '500' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockCreateBudgetMutation).toHaveBeenCalledWith({
                category: 'Food',
                amount: 500,
                month: '2024-01'
            });
        });
    });
});

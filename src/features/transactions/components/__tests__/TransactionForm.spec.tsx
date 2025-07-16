import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, test, expect, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../auth/authSlice';
import transactionReducer from '../../transactionsSlice';
import TransactionForm from '../TransactionForm';

// Mock the API
const mockCreateTransaction = vi.fn();
const mockUnwrap = vi.fn().mockResolvedValue({});

vi.mock('../../api', () => ({
  useCreateTransactionMutation: () => [
    mockCreateTransaction,
    {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: undefined,
    }
  ],
  transactionApi: {
    reducer: vi.fn(() => ({})),
    middleware: vi.fn(),
    reducerPath: 'transactionApi',
  }
}));

// Create a test store
const testStore = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
  },
});

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateTransaction.mockReturnValue({
    unwrap: mockUnwrap,
  });
});

test('submit valid form calls mutation and resets fields', async () => {
  const { container } = render(
    <Provider store={testStore}>
      <TransactionForm />
    </Provider>,
  );

  // Use querySelector to find inputs by name attribute
  const amountInput = container.querySelector('input[name="amount"]') as HTMLInputElement;
  const dateInput = container.querySelector('input[name="date"]') as HTMLInputElement;
  const categoryInput = container.querySelector('input[name="category"]') as HTMLInputElement;
  const walletSelect = container.querySelector('select[name="wallet"]') as HTMLSelectElement;
  const noteTextarea = container.querySelector('textarea[name="note"]') as HTMLTextAreaElement;

  fireEvent.change(amountInput, { target: { value: '50' } });
  fireEvent.change(dateInput, { target: { value: '2025-07-20' } });
  fireEvent.change(categoryInput, { target: { value: 'Food' } });
  fireEvent.change(walletSelect, { target: { value: 'card' } });
  fireEvent.change(noteTextarea, { target: { value: 'Test note' } });

  const submit = screen.getByRole('button', { name: /Add Transaction/i });
  fireEvent.click(submit);

  await waitFor(() => expect(mockCreateTransaction).toHaveBeenCalledWith({
    amount: 50,
    date: '2025-07-20',
    category: 'Food',
    wallet: 'card',
    note: 'Test note',
  }));

  // fields reset - check values after submission
  expect(amountInput).toHaveValue(null);
  expect(dateInput).toHaveValue('');
  expect(categoryInput).toHaveValue('');
  expect(noteTextarea).toHaveValue('');
});

test('submit button disabled when inputs invalid', () => {
  render(
    <Provider store={testStore}>
      <TransactionForm />
    </Provider>,
  );
  const btn = screen.getByRole('button', { name: /Add Transaction/i });
  expect(btn).toBeDisabled();
});
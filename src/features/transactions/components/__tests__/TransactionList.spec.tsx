import { render, screen } from '@testing-library/react';
import { vi, beforeEach, test, expect, type MockedFunction } from 'vitest';
import TransactionList from '../TransactionList';

// Mock the useGetTransactionsQuery hook
vi.mock('../../api', () => ({
  useGetTransactionsQuery: vi.fn()
}));

import { useGetTransactionsQuery } from '../../api';

const mockUseGetTransactionsQuery = useGetTransactionsQuery as MockedFunction<typeof useGetTransactionsQuery>;

beforeEach(() => {
  vi.clearAllMocks();
});

test('displays no transactions message when empty', async () => {
  // Mock the hook to return empty array
  mockUseGetTransactionsQuery.mockReturnValue({
    data: [],
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: undefined,
    refetch: vi.fn(),
    fulfilledTimeStamp: 0,
    status: 'fulfilled',
    originalArgs: undefined,
    endpointName: 'getTransactions',
    requestId: 'test-request-id',
    reset: vi.fn(),
    uninitialized: false,
  });

  render(<TransactionList />);
  
  // Should show the no-data message
  expect(screen.getByText(/No transactions found for this month/i)).toBeInTheDocument();
});

test('displays loading spinner when loading', () => {
  // Mock the hook to return loading state
  mockUseGetTransactionsQuery.mockReturnValue({
    data: undefined,
    isLoading: true,
    isFetching: true,
    isSuccess: false,
    isError: false,
    error: undefined,
    refetch: vi.fn(),
    fulfilledTimeStamp: 0,
    status: 'pending',
    originalArgs: undefined,
    endpointName: 'getTransactions',
    requestId: 'test-request-id',
    reset: vi.fn(),
    uninitialized: false,
  });

  render(<TransactionList />);
  
  // Should show loading spinner
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test('displays error message when error occurs', () => {
  // Mock the hook to return error state
  mockUseGetTransactionsQuery.mockReturnValue({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: true,
    error: { message: 'Test error' },
    refetch: vi.fn(),
    fulfilledTimeStamp: 0,
    status: 'rejected',
    originalArgs: undefined,
    endpointName: 'getTransactions',
    requestId: 'test-request-id',
    reset: vi.fn(),
    uninitialized: false,
  });

  render(<TransactionList />);
  
  // Should show error message
  expect(screen.getByText(/error/i)).toBeInTheDocument();
});

test('renders transactions when data is available', () => {
  const mockTransactions = [
    { id: '1', date: '2023-10-01', category: 'Food', amount: 100 },
    { id: '2', date: '2023-10-02', category: 'Transport', amount: 50 },
  ];

  // Mock the hook to return transactions
  mockUseGetTransactionsQuery.mockReturnValue({
    data: mockTransactions,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: undefined,
    refetch: vi.fn(),
    fulfilledTimeStamp: 0,
    status: 'fulfilled',
    originalArgs: undefined,
    endpointName: 'getTransactions',
    requestId: 'test-request-id',
    reset: vi.fn(),
    uninitialized: false,
  });

  render(<TransactionList />);
  
  // Should show the transactions
  expect(screen.getByText(/food/i)).toBeInTheDocument();
  expect(screen.getByText(/transport/i)).toBeInTheDocument();
});

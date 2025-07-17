import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import TransactionForm from "../TransactionForm";
import authReducer from "../../../auth/authSlice";
import transactionReducer from "../../transactionsSlice";

// Mock the API module
const mockCreateTransaction = vi.fn();
const mockMutationResult = {
    isLoading: false,
    isError: false,
    error: undefined as undefined | { message: string },
};

vi.mock("../../api", () => ({
    transactionApi: {
        reducerPath: 'transactionApi',
        reducer: () => ({}),
        middleware: () => (next: any) => (action: any) => next(action),
        endpoints: {},
    },
    useCreateTransactionMutation: () => [mockCreateTransaction, mockMutationResult],
}));

// Create a test store
const testStore = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Helper to render component with provider
const renderWithProvider = (component: React.ReactElement) => {
    return render(<Provider store={testStore}>{component}</Provider>);
};

describe("TransactionForm", () => {
    beforeEach(() => {
        mockCreateTransaction.mockReset();
        // Reset mock to default state
        mockMutationResult.isLoading = false;
        mockMutationResult.isError = false;
        mockMutationResult.error = undefined;
    });

    it("renders all form fields", () => {
        renderWithProvider(<TransactionForm />);
        expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Wallet/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Note/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Add Transaction/i })).toBeInTheDocument();
    });

    it("disables submit button if form is invalid", () => {
        renderWithProvider(<TransactionForm />);
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("enables submit button when form is valid", () => {
        renderWithProvider(<TransactionForm />);
        fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "10" } });
        fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-06-01" } });
        fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Food" } });
        expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("calls createTransaction with correct data on submit", async () => {
        renderWithProvider(<TransactionForm />);
        fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "20" } });
        fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-06-02" } });
        fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Transport" } });
        fireEvent.change(screen.getByLabelText(/Wallet/i), { target: { value: "card" } });
        fireEvent.change(screen.getByLabelText(/Note/i), { target: { value: "Bus ticket" } });

        mockCreateTransaction.mockReturnValue({ unwrap: () => Promise.resolve() });

        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(mockCreateTransaction).toHaveBeenCalledWith({
                amount: 20,
                date: "2024-06-02",
                category: "Transport",
                wallet: "card",
                note: "Bus ticket",
            });
        });
    });

    it("shows loading state when isLoading is true", () => {
        mockMutationResult.isLoading = true;
        renderWithProvider(<TransactionForm />);
        expect(screen.getByRole("button")).toHaveTextContent("Adding...");
    });

    it("shows error message when isError is true", () => {
        mockMutationResult.isError = true;
        mockMutationResult.error = { message: "Test error" };
        renderWithProvider(<TransactionForm />);
        expect(screen.getByRole("alert")).toHaveTextContent("Error: Test error");
    });

    it("does not call createTransaction if form is invalid", async () => {
        renderWithProvider(<TransactionForm />);
        fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "" } });
        fireEvent.click(screen.getByRole("button"));
        await waitFor(() => {
            expect(mockCreateTransaction).not.toHaveBeenCalled();
        });
    });
});

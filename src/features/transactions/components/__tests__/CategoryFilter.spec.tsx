import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CategoryFilter, { type Category } from "../CategoryFilter";

describe("CategoryFilter", () => {
    const mockOnChange = vi.fn();

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders all category options", () => {
        render(<CategoryFilter value="All" onChange={mockOnChange} />);
        
        // Check that all categories are present
        expect(screen.getByRole("option", { name: "All" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Food" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Travle" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Bills" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Entertainment" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Shopping" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Health" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Other" })).toBeInTheDocument();
    });

    it("displays the correct selected value", () => {
        render(<CategoryFilter value="Food" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("Food");
    });

    it("calls onChange when a different category is selected", () => {
        render(<CategoryFilter value="All" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "Food" } });
        
        expect(mockOnChange).toHaveBeenCalledWith("Food");
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange with correct category type", () => {
        render(<CategoryFilter value="All" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "Entertainment" } });
        
        expect(mockOnChange).toHaveBeenCalledWith("Entertainment");
    });

    it("applies correct CSS classes", () => {
        render(<CategoryFilter value="All" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        expect(select).toHaveClass("border", "rounded", "p-1");
    });

    it("renders as a select element", () => {
        render(<CategoryFilter value="All" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        expect(select.tagName).toBe("SELECT");
    });

    it("handles all category values correctly", () => {
        const categories: Category[] = ["All", "Food", "Travle", "Bills", "Entertainment", "Shopping", "Health", "Other"];
        
        categories.forEach((category) => {
            const { unmount } = render(<CategoryFilter value={category} onChange={mockOnChange} />);
            const select = screen.getByRole("combobox");
            expect(select).toHaveValue(category);
            unmount();
        });
    });
});

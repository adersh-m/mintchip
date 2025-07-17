import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MonthPicker from "../MonthPicker";

describe("MonthPicker", () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        // Mock the current date to make tests deterministic
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2024-06-15"));
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it("renders month options starting from current month", () => {
        render(<MonthPicker value="June 2024" onChange={mockOnChange} />);
        
        // Should have 12 options (current month + 11 previous months)
        const options = screen.getAllByRole("option");
        expect(options).toHaveLength(12);
        
        // First option should be current month
        expect(options[0]).toHaveTextContent("June 2024");
    });

    it("generates correct month sequence", () => {
        render(<MonthPicker value="June 2024" onChange={mockOnChange} />);
        
        const options = screen.getAllByRole("option");
        
        // Verify the sequence of months (current month going backwards)
        expect(options[0]).toHaveTextContent("June 2024");
        expect(options[1]).toHaveTextContent("May 2024");
        expect(options[2]).toHaveTextContent("April 2024");
        expect(options[3]).toHaveTextContent("March 2024");
        expect(options[4]).toHaveTextContent("February 2024");
        expect(options[5]).toHaveTextContent("January 2024");
        expect(options[6]).toHaveTextContent("December 2023");
        expect(options[7]).toHaveTextContent("November 2023");
        expect(options[8]).toHaveTextContent("October 2023");
        expect(options[9]).toHaveTextContent("September 2023");
        expect(options[10]).toHaveTextContent("August 2023");
        expect(options[11]).toHaveTextContent("July 2023");
    });

    it("displays the correct selected value", () => {
        render(<MonthPicker value="May 2024" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("May 2024");
    });

    it("calls onChange when a different month is selected", () => {
        render(<MonthPicker value="June 2024" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "May 2024" } });
        
        expect(mockOnChange).toHaveBeenCalledWith("May 2024");
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("applies correct CSS classes", () => {
        render(<MonthPicker value="June 2024" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        expect(select).toHaveClass("border", "rounded", "p-1");
    });

    it("renders as a select element", () => {
        render(<MonthPicker value="June 2024" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        expect(select.tagName).toBe("SELECT");
    });

    it("handles cross-year month generation correctly", () => {
        // Set date to January to test cross-year functionality
        vi.setSystemTime(new Date("2024-01-15"));
        
        render(<MonthPicker value="January 2024" onChange={mockOnChange} />);
        
        const options = screen.getAllByRole("option");
        
        // Should include months from previous year
        expect(options[0]).toHaveTextContent("January 2024");
        expect(options[1]).toHaveTextContent("December 2023");
        expect(options[2]).toHaveTextContent("November 2023");
        expect(options[11]).toHaveTextContent("February 2023");
    });

    it("memoizes month options correctly", () => {
        const { rerender } = render(<MonthPicker value="June 2024" onChange={mockOnChange} />);
        
        const initialOptions = screen.getAllByRole("option");
        
        // Re-render with different value but same date
        rerender(<MonthPicker value="May 2024" onChange={mockOnChange} />);
        
        const newOptions = screen.getAllByRole("option");
        
        // Options should be the same (memoized)
        expect(initialOptions).toHaveLength(newOptions.length);
        expect(initialOptions[0]).toHaveTextContent(newOptions[0].textContent || "");
    });

    it("handles onChange with various month selections", () => {
        render(<MonthPicker value="June 2024" onChange={mockOnChange} />);
        
        const select = screen.getByRole("combobox");
        
        // Test different month selections
        fireEvent.change(select, { target: { value: "December 2023" } });
        expect(mockOnChange).toHaveBeenCalledWith("December 2023");
        
        fireEvent.change(select, { target: { value: "March 2024" } });
        expect(mockOnChange).toHaveBeenCalledWith("March 2024");
        
        expect(mockOnChange).toHaveBeenCalledTimes(2);
    });
});

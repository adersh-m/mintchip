import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "../Spinner";

describe("Spinner", () => {
    it("renders loading text", () => {
        render(<Spinner />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("applies correct CSS classes", () => {
        render(<Spinner />);
        const spinner = screen.getByText("Loading...");
        expect(spinner).toHaveClass("flex", "items-center", "justify-center", "p-10");
    });

    it("renders as a div element", () => {
        render(<Spinner />);
        const spinner = screen.getByText("Loading...");
        expect(spinner.tagName).toBe("DIV");
    });
});

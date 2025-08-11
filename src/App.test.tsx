import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("App Component", () => {
  it("should render the main heading", () => {
    render(<App />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Vite-Rolldown + React");
  });

  it("should have correct CSS classes for layout", () => {
    const { container } = render(<App />);

    const appDiv = container.firstChild as HTMLElement;
    expect(appDiv).toHaveClass(
      "bg-background",
      "text-foreground",
      "flex",
      "h-screen",
      "w-full",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-4",
    );
  });

  it("should render the Counter component", () => {
    render(<App />);

    // The Counter component should be present
    // We can check for elements that the Counter component renders
    const counterButton = screen.getByRole("button", { name: /count is/i });
    expect(counterButton).toBeInTheDocument();
  });

  it("should have proper semantic structure", () => {
    render(<App />);

    // Check that there's exactly one main heading
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);

    // Check that the heading has the correct styling classes
    const heading = headings[0];
    expect(heading).toHaveClass("text-center", "text-2xl", "font-semibold");
  });

  it("should render without crashing", () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it("should contain both main elements (heading and counter)", () => {
    render(<App />);

    // Verify main heading exists
    expect(screen.getByText("Vite-Rolldown + React")).toBeInTheDocument();

    // Verify counter exists (looking for the count button)
    expect(
      screen.getByRole("button", { name: /count is/i }),
    ).toBeInTheDocument();
  });

  it("should have accessible structure", () => {
    render(<App />);

    // Check that the heading is accessible
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeVisible();

    // Check that interactive elements are present and accessible
    const button = screen.getByRole("button", { name: /count is/i });
    expect(button).toBeVisible();
    expect(button).toBeEnabled();
  });

  it("should render counter with initial state", () => {
    render(<App />);

    // Counter should start with count 0
    const counterButton = screen.getByRole("button", { name: /count is 0/i });
    expect(counterButton).toBeInTheDocument();
  });
});

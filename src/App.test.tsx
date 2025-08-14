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

  it("should render the Counter and Theme components", () => {
    render(<App />);

    // The Counter component should be present
    // We can check for elements that the Counter component renders
    const counterButton = screen.getByRole("button", { name: /count is/i });
    expect(counterButton).toBeInTheDocument();

    // The Theme component should be present
    const themeSelect = screen.getByRole("combobox");
    expect(themeSelect).toBeInTheDocument();

    const themeResetButton = screen.getByRole("button", {
      name: /reset theme/i,
    });
    expect(themeResetButton).toBeInTheDocument();
  });

  it("should render without crashing", () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it("should contain main elements (heading, counter, and theme)", () => {
    render(<App />);

    // Verify main heading exists
    expect(screen.getByText("Vite-Rolldown + React")).toBeInTheDocument();

    // Verify counter exists (looking for the count button)
    expect(
      screen.getByRole("button", { name: /count is/i }),
    ).toBeInTheDocument();

    // Verify theme selector exists
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset theme/i }),
    ).toBeInTheDocument();
  });

  it("should have accessible structure", () => {
    render(<App />);

    // Check that the heading is accessible
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeVisible();

    // Check that interactive elements are present and accessible
    const counterButton = screen.getByRole("button", { name: /count is/i });
    expect(counterButton).toBeVisible();
    expect(counterButton).toBeEnabled();

    // Check that theme selector is accessible
    const themeSelect = screen.getByRole("combobox");
    expect(themeSelect).toBeVisible();
    expect(themeSelect).toBeEnabled();

    const themeResetButton = screen.getByRole("button", {
      name: /reset theme/i,
    });
    expect(themeResetButton).toBeVisible();
    expect(themeResetButton).toBeEnabled();
  });

  it("should render counter with initial state", () => {
    render(<App />);

    // Counter should start with count 0
    const counterButton = screen.getByRole("button", { name: /count is 0/i });
    expect(counterButton).toBeInTheDocument();
  });
});

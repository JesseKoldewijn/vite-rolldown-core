import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CounterEnhancedComponent } from "~/components/counter/counter-enhanced";

describe("CounterEnhancedComponent Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("State Management Integration", () => {
    it("should start with count 0 when no localStorage value exists", () => {
      render(<CounterEnhancedComponent />);

      expect(screen.getByText("count is 0")).toBeInTheDocument();
    });

    it("should restore count from localStorage on mount", async () => {
      localStorage.setItem("count", "42");

      render(<CounterEnhancedComponent />);

      await waitFor(() => {
        expect(screen.getByText("count is 42")).toBeInTheDocument();
      });
    });

    it("should increment count and persist to localStorage", async () => {
      const user = userEvent.setup();

      render(<CounterEnhancedComponent />);

      const incrementButton = screen.getByText("count is 0");
      await user.click(incrementButton);

      await waitFor(() => {
        expect(screen.getByText("count is 1")).toBeInTheDocument();
      });

      expect(localStorage.getItem("count")).toBe("1");
    });

    it("should reset count to 0 and persist to localStorage", async () => {
      const user = userEvent.setup();
      localStorage.setItem("count", "5");

      render(<CounterEnhancedComponent />);

      await waitFor(() => {
        expect(screen.getByText("count is 5")).toBeInTheDocument();
      });

      const resetButton = screen.getByText("Reset");
      await user.click(resetButton);

      await waitFor(() => {
        expect(screen.getByText("count is 0")).toBeInTheDocument();
      });

      expect(localStorage.getItem("count")).toBe("0");
    });
  });

  describe("Multiple Interactions Integration", () => {
    it("should handle multiple increments correctly", async () => {
      const user = userEvent.setup();

      render(<CounterEnhancedComponent />);

      const incrementButton = screen.getByText("count is 0");

      await user.click(incrementButton);
      await waitFor(() => {
        expect(screen.getByText("count is 1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("count is 1"));
      await waitFor(() => {
        expect(screen.getByText("count is 2")).toBeInTheDocument();
      });

      await user.click(screen.getByText("count is 2"));
      await waitFor(() => {
        expect(screen.getByText("count is 3")).toBeInTheDocument();
      });

      expect(localStorage.getItem("count")).toBe("3");
    });

    it("should handle increment and reset sequence", async () => {
      const user = userEvent.setup();

      render(<CounterEnhancedComponent />);

      // Increment a few times
      await user.click(screen.getByText("count is 0"));
      await waitFor(() => {
        expect(screen.getByText("count is 1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("count is 1"));
      await waitFor(() => {
        expect(screen.getByText("count is 2")).toBeInTheDocument();
      });

      // Reset
      await user.click(screen.getByText("Reset"));
      await waitFor(() => {
        expect(screen.getByText("count is 0")).toBeInTheDocument();
      });

      // Increment again
      await user.click(screen.getByText("count is 0"));
      await waitFor(() => {
        expect(screen.getByText("count is 1")).toBeInTheDocument();
      });

      expect(localStorage.getItem("count")).toBe("1");
    });
  });

  describe("Props Override Integration", () => {
    it("should work with prop overrides", async () => {
      localStorage.setItem("count", "10");

      render(<CounterEnhancedComponent count={5} />);

      // Props should override internal state
      expect(screen.getByText(/count is 5/)).toBeInTheDocument();
    });
  });

  describe("Component Lifecycle Integration", () => {
    it("should work without custom props", () => {
      render(<CounterEnhancedComponent />);

      expect(screen.getByText(/count is 0/)).toBeInTheDocument();
    });

    it("should load initial state from localStorage on mount", () => {
      localStorage.setItem("count", "5");

      render(<CounterEnhancedComponent />);

      expect(screen.getByText(/count is 5/)).toBeInTheDocument();

      localStorage.removeItem("count");
    });
  });

  describe("LocalStorage Edge Cases", () => {
    it("should handle invalid localStorage values gracefully", async () => {
      localStorage.setItem("count", "invalid_number");

      render(<CounterEnhancedComponent />);

      // Should render NaN initially, then work normally with interactions
      expect(screen.getByText("count is NaN")).toBeInTheDocument();

      const user = userEvent.setup();
      await user.click(screen.getByText("Reset"));

      await waitFor(() => {
        expect(screen.getByText("count is 0")).toBeInTheDocument();
      });

      expect(localStorage.getItem("count")).toBe("0");
    });

    it("should work when localStorage throws errors", async () => {
      // Mock localStorage.getItem to throw an error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn().mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });

      const user = userEvent.setup();

      render(<CounterEnhancedComponent />);

      expect(screen.getByText("count is 0")).toBeInTheDocument();

      await user.click(screen.getByText("count is 0"));

      await waitFor(() => {
        expect(screen.getByText("count is 1")).toBeInTheDocument();
      });

      // Restore localStorage
      localStorage.getItem = originalGetItem;
    });
  });

  describe("Additional Component Tests", () => {
    it("should work when localStorage is empty", () => {
      localStorage.removeItem("count");

      render(<CounterEnhancedComponent />);

      expect(screen.getByText(/count is 0/)).toBeInTheDocument();
    });

    it("should support prop overrides", () => {
      render(<CounterEnhancedComponent count={42} />);

      expect(screen.getByText(/count is 42/)).toBeInTheDocument();
    });
  });
});

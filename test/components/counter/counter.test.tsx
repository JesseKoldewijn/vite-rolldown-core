import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Counter } from "~/components/counter";
import {
  CounterDummyComponent,
  type CounterDummyComponentProps,
} from "~/components/counter/counter";

describe("Counter Component Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("CounterDummyComponent Unit Tests", () => {
    const defaultProps: CounterDummyComponentProps & {
      onMount: () => void;
    } = {
      count: 0,
      onIncrement: vi.fn(),
      onReset: vi.fn(),
      onMount: vi.fn(),
    };

    describe("Rendering", () => {
      it("should render the counter button with initial count", () => {
        render(<CounterDummyComponent {...defaultProps} />);

        expect(screen.getByText("count is 0")).toBeInTheDocument();
        expect(screen.getByText("Reset")).toBeInTheDocument();
      });

      it("should render with custom count value", () => {
        render(<CounterDummyComponent {...defaultProps} count={42} />);

        expect(screen.getByText("count is 42")).toBeInTheDocument();
      });

      it("should render with undefined count", () => {
        render(<CounterDummyComponent {...defaultProps} count={undefined} />);

        expect(screen.getByText("count is")).toBeInTheDocument();
      });

      it("should render with correct button elements and accessibility", () => {
        render(<CounterDummyComponent {...defaultProps} />);

        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(2);

        const incrementButton = buttons[0];
        const resetButton = buttons[1];

        expect(incrementButton).toHaveTextContent("count is 0");
        expect(resetButton).toHaveTextContent("Reset");
        expect(incrementButton).toBeVisible();
        expect(resetButton).toBeVisible();
        expect(incrementButton.tagName).toBe("BUTTON");
        expect(resetButton.tagName).toBe("BUTTON");
      });
    });

    describe("Event Handling", () => {
      it("should call onIncrement when increment button is clicked", async () => {
        const user = userEvent.setup();
        const mockOnIncrement = vi.fn();

        render(
          <CounterDummyComponent
            {...defaultProps}
            onIncrement={mockOnIncrement}
          />,
        );

        await user.click(screen.getByText("count is 0"));

        expect(mockOnIncrement).toHaveBeenCalledTimes(1);
      });

      it("should call onReset when reset button is clicked", async () => {
        const user = userEvent.setup();
        const mockOnReset = vi.fn();

        render(
          <CounterDummyComponent {...defaultProps} onReset={mockOnReset} />,
        );

        await user.click(screen.getByText("Reset"));

        expect(mockOnReset).toHaveBeenCalledTimes(1);
      });

      it("should handle multiple clicks correctly", async () => {
        const user = userEvent.setup();
        const mockOnIncrement = vi.fn();
        const mockOnReset = vi.fn();

        render(
          <CounterDummyComponent
            {...defaultProps}
            onIncrement={mockOnIncrement}
            onReset={mockOnReset}
          />,
        );

        await user.click(screen.getByText("count is 0"));
        await user.click(screen.getByText("count is 0"));
        await user.click(screen.getByText("Reset"));

        expect(mockOnIncrement).toHaveBeenCalledTimes(2);
        expect(mockOnReset).toHaveBeenCalledTimes(1);
      });
    });

    describe("Component Lifecycle", () => {
      it("should render component successfully", () => {
        render(<CounterDummyComponent {...defaultProps} />);

        expect(screen.getByText("count is 0")).toBeInTheDocument();
        expect(screen.getByText("Reset")).toBeInTheDocument();
      });

      it("should handle undefined props gracefully", () => {
        render(<CounterDummyComponent />);

        expect(screen.getByText("count is")).toBeInTheDocument();
      });
    });

    describe("Default Props", () => {
      it("should handle missing callback props gracefully", async () => {
        const user = userEvent.setup();

        render(<CounterDummyComponent />);

        // Should not throw errors when clicking buttons
        await user.click(screen.getByText("count is"));
        await user.click(screen.getByText("Reset"));

        // Test passes if no errors are thrown
      });
    });
  });

  describe("Counter (Enhanced) Component Tests", () => {
    describe("Initial Render and Layout", () => {
      it("should render the counter component with default state", () => {
        render(<Counter />);

        expect(screen.getByText("count is 0")).toBeInTheDocument();
        expect(screen.getByText("Reset")).toBeInTheDocument();
      });
    });

    describe("Component Tree Structure", () => {
      it("should render the complete component tree", () => {
        const { container } = render(<Counter />);

        // Check if the main container exists
        expect(container.firstChild).toBeTruthy();

        // Check if buttons are children of the container
        const buttons = container.querySelectorAll("button");
        expect(buttons).toHaveLength(2);

        // Verify structure: div > button + button
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.tagName).toBe("DIV");
        expect(wrapper.children).toHaveLength(2);
        expect(wrapper.children[0].tagName).toBe("BUTTON");
        expect(wrapper.children[1].tagName).toBe("BUTTON");
      });

      it("should render without console errors", () => {
        const consoleSpy = vi.spyOn(console, "error");
        consoleSpy.mockImplementation(vi.fn());

        render(<Counter />);

        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
      });

      it("should render without throwing errors", () => {
        // Component should render successfully
        render(<Counter />);
        expect(screen.getByText("count is 0")).toBeInTheDocument();
      });
    });

    describe("Props Integration Rendering", () => {
      it("should render with custom initial count prop", () => {
        render(<Counter count={42} />);

        expect(screen.getByText("count is 42")).toBeInTheDocument();
      });

      it("should handle undefined props gracefully", () => {
        render(<Counter count={undefined} />);
        expect(screen.getByText("count is")).toBeInTheDocument();
      });

      it("should render with zero count correctly", () => {
        render(<Counter count={0} />);

        expect(screen.getByText("count is 0")).toBeInTheDocument();
      });

      it("should render with negative count correctly", () => {
        render(<Counter count={-5} />);

        expect(screen.getByText("count is -5")).toBeInTheDocument();
      });
    });
  });
});

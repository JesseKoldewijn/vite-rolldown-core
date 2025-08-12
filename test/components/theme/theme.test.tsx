import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Theme } from "~/components/theme";
import {
  ThemeDummyComponent,
  type ThemeDummyComponentProps,
} from "~/components/theme/theme";

describe("Theme Component Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
    vi.clearAllMocks();
  });

  describe("ThemeDummyComponent Unit Tests", () => {
    const defaultProps: ThemeDummyComponentProps = {
      theme: "system",
      onThemeChange: vi.fn(),
      onReset: vi.fn(),
    };

    describe("Rendering", () => {
      it("should render the theme selector with auto selected by default", () => {
        render(<ThemeDummyComponent {...defaultProps} />);

        const select = screen.getByRole("combobox");
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue("system");
        expect(screen.getByText("Reset Theme")).toBeInTheDocument();
      });

      it("should render with custom theme value", () => {
        render(<ThemeDummyComponent {...defaultProps} theme="dark" />);

        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("dark");
      });

      it("should render with light theme", () => {
        render(<ThemeDummyComponent {...defaultProps} theme="light" />);

        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("light");
      });

      it("should render with undefined theme", () => {
        render(<ThemeDummyComponent {...defaultProps} theme={undefined} />);

        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("system");
      });

      it("should render with correct elements and accessibility", () => {
        render(<ThemeDummyComponent {...defaultProps} />);

        const select = screen.getByRole("combobox");
        const resetButton = screen.getByRole("button", { name: "Reset Theme" });

        expect(select).toBeVisible();
        expect(resetButton).toBeVisible();
        expect(select.tagName).toBe("SELECT");
        expect(resetButton.tagName).toBe("BUTTON");

        // Check all options are present
        const options = screen.getAllByRole("option");
        expect(options).toHaveLength(3);
        expect(
          screen.getByRole("option", { name: "System" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Light" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Dark" }),
        ).toBeInTheDocument();
      });
    });

    describe("Event Handling", () => {
      it("should call onThemeChange when select value changes", async () => {
        const user = userEvent.setup();
        const mockOnThemeChange = vi.fn();

        render(
          <ThemeDummyComponent
            {...defaultProps}
            onThemeChange={mockOnThemeChange}
          />,
        );

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "dark");

        expect(mockOnThemeChange).toHaveBeenCalledTimes(1);
        expect(mockOnThemeChange).toHaveBeenCalledWith("dark");
      });

      it("should call onThemeChange when changing to light", async () => {
        const user = userEvent.setup();
        const mockOnThemeChange = vi.fn();

        render(
          <ThemeDummyComponent
            {...defaultProps}
            onThemeChange={mockOnThemeChange}
          />,
        );

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "light");

        expect(mockOnThemeChange).toHaveBeenCalledTimes(1);
        expect(mockOnThemeChange).toHaveBeenCalledWith("light");
      });

      it("should call onReset when reset button is clicked", async () => {
        const user = userEvent.setup();
        const mockOnReset = vi.fn();

        render(<ThemeDummyComponent {...defaultProps} onReset={mockOnReset} />);

        await user.click(screen.getByText("Reset Theme"));

        expect(mockOnReset).toHaveBeenCalledTimes(1);
      });

      it("should handle multiple interactions correctly", async () => {
        const user = userEvent.setup();
        const mockOnThemeChange = vi.fn();
        const mockOnReset = vi.fn();

        render(
          <ThemeDummyComponent
            {...defaultProps}
            onThemeChange={mockOnThemeChange}
            onReset={mockOnReset}
          />,
        );

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "dark");
        await user.selectOptions(select, "light");
        await user.click(screen.getByText("Reset Theme"));

        expect(mockOnThemeChange).toHaveBeenCalledTimes(2);
        expect(mockOnThemeChange).toHaveBeenNthCalledWith(1, "dark");
        expect(mockOnThemeChange).toHaveBeenNthCalledWith(2, "light");
        expect(mockOnReset).toHaveBeenCalledTimes(1);
      });
    });

    describe("Component Lifecycle", () => {
      it("should render component successfully", () => {
        render(<ThemeDummyComponent {...defaultProps} />);

        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("Reset Theme")).toBeInTheDocument();
      });

      it("should handle undefined props gracefully", () => {
        render(<ThemeDummyComponent />);

        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("system");
        expect(screen.getByText("Reset Theme")).toBeInTheDocument();
      });
    });

    describe("Default Props", () => {
      it("should handle missing callback props gracefully", async () => {
        const user = userEvent.setup();

        render(<ThemeDummyComponent />);

        const select = screen.getByRole("combobox");

        // Should not throw errors when changing selections or clicking reset
        await user.selectOptions(select, "dark");
        await user.click(screen.getByText("Reset Theme"));

        // Test passes if no errors are thrown
      });
    });
  });

  describe("Theme (Enhanced) Component Tests", () => {
    describe("Initial Render and Layout", () => {
      it("should render the theme component with default state", () => {
        render(<Theme />);

        const select = screen.getByRole("combobox");
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue("system");
        expect(screen.getByText("Reset Theme")).toBeInTheDocument();
      });
    });

    describe("Component Tree Structure", () => {
      it("should render the complete component tree", () => {
        const { container } = render(<Theme />);

        // Check if the main container exists
        expect(container.firstChild).toBeTruthy();

        // Check if select and button are children of the container
        const select = container.querySelector("select");
        const button = container.querySelector("button");
        expect(select).toBeTruthy();
        expect(button).toBeTruthy();

        // Verify structure: div > select + button
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.tagName).toBe("DIV");
        expect(wrapper.children).toHaveLength(2);
        expect(wrapper.children[0].tagName).toBe("SELECT");
        expect(wrapper.children[1].tagName).toBe("BUTTON");
      });

      it("should render without console errors", () => {
        const consoleSpy = vi.spyOn(console, "error");
        consoleSpy.mockImplementation(vi.fn());

        render(<Theme />);

        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
      });

      it("should render without throwing errors", () => {
        // Component should render successfully
        render(<Theme />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });

    describe("Props Integration Rendering", () => {
      it("should render with custom initial theme prop", () => {
        render(<Theme theme="dark" />);

        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("dark");
      });

      it("should handle undefined props gracefully", () => {
        render(<Theme theme={undefined} />);

        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("system");
      });

      it("should render with light theme correctly", () => {
        render(<Theme theme="light" />);

        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("light");
      });

      it("should render with auto theme correctly", () => {
        render(<Theme theme="system" />);

        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("system");
      });
    });
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeEnhancedComponent } from "~/components/theme/theme-enhanced";

describe("ThemeEnhancedComponent Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
    vi.clearAllMocks();
  });

  describe("State Management Integration", () => {
    it("should start with theme auto when no localStorage value exists", () => {
      render(<ThemeEnhancedComponent />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("system");
    });

    it("should restore theme from localStorage on mount", async () => {
      localStorage.setItem("theme", "dark");

      render(<ThemeEnhancedComponent />);

      await waitFor(() => {
        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("dark");
      });
    });

    it("should change theme and persist to localStorage", async () => {
      const user = userEvent.setup();

      render(<ThemeEnhancedComponent />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "dark");

      await waitFor(() => {
        expect(select).toHaveValue("dark");
      });

      expect(localStorage.getItem("theme")).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should reset theme to auto and persist to localStorage", async () => {
      const user = userEvent.setup();
      localStorage.setItem("theme", "dark");

      render(<ThemeEnhancedComponent />);

      await waitFor(() => {
        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("dark");
      });

      const resetButton = screen.getByText("Reset Theme");
      await user.click(resetButton);

      await waitFor(() => {
        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("system");
      });

      expect(localStorage.getItem("theme")).toBe("system");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });
  });

  describe("Multiple Interactions Integration", () => {
    it("should handle multiple theme changes correctly", async () => {
      const user = userEvent.setup();

      render(<ThemeEnhancedComponent />);

      const select = screen.getByRole("combobox");

      await user.selectOptions(select, "light");
      await waitFor(() => {
        expect(select).toHaveValue("light");
      });
      expect(document.documentElement.classList.contains("light")).toBe(true);

      await user.selectOptions(select, "dark");
      await waitFor(() => {
        expect(select).toHaveValue("dark");
      });
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);

      await user.selectOptions(select, "system");
      await waitFor(() => {
        expect(select).toHaveValue("system");
      });
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(document.documentElement.classList.contains("light")).toBe(false);

      expect(localStorage.getItem("theme")).toBe("system");
    });

    it("should handle theme change and reset sequence", async () => {
      const user = userEvent.setup();

      render(<ThemeEnhancedComponent />);

      const select = screen.getByRole("combobox");

      // Change to dark
      await user.selectOptions(select, "dark");
      await waitFor(() => {
        expect(select).toHaveValue("dark");
      });
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      // Change to light
      await user.selectOptions(select, "light");
      await waitFor(() => {
        expect(select).toHaveValue("light");
      });
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);

      // Reset to auto
      await user.click(screen.getByText("Reset Theme"));
      await waitFor(() => {
        expect(select).toHaveValue("system");
      });
      expect(document.documentElement.classList.contains("light")).toBe(false);
      expect(document.documentElement.classList.contains("dark")).toBe(false);

      // Change to dark again
      await user.selectOptions(select, "dark");
      await waitFor(() => {
        expect(select).toHaveValue("dark");
      });
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });

  describe("Props Override Integration", () => {
    it("should work with prop overrides", async () => {
      localStorage.setItem("theme", "dark");

      render(<ThemeEnhancedComponent theme="light" />);

      // Props should override internal state
      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("light");
    });
  });

  describe("Component Lifecycle Integration", () => {
    it("should work without custom props", () => {
      render(<ThemeEnhancedComponent />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("system");
    });

    it("should load initial state from localStorage on mount", () => {
      localStorage.setItem("theme", "light");

      render(<ThemeEnhancedComponent />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("light");

      localStorage.removeItem("theme");
    });
  });

  describe("LocalStorage Edge Cases", () => {
    it("should handle invalid localStorage values gracefully", async () => {
      localStorage.setItem("theme", "invalid_theme");

      render(<ThemeEnhancedComponent />);

      // Should render auto initially, then work normally with interactions
      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("system");

      const user = userEvent.setup();
      await user.click(screen.getByText("Reset Theme"));

      await waitFor(() => {
        expect(select).toHaveValue("system");
      });

      expect(localStorage.getItem("theme")).toBe("system");
    });

    it("should work when localStorage throws errors", async () => {
      // Mock localStorage.getItem to throw an error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn().mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });

      const user = userEvent.setup();

      render(<ThemeEnhancedComponent />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("system");

      await user.selectOptions(select, "dark");

      await waitFor(() => {
        expect(select).toHaveValue("dark");
      });

      // Restore localStorage
      localStorage.getItem = originalGetItem;
    });
  });

  describe("Document Class Integration", () => {
    it("should apply theme classes to document on initialization", async () => {
      localStorage.setItem("theme", "dark");

      render(<ThemeEnhancedComponent />);

      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });

    it("should update document classes when theme changes", async () => {
      const user = userEvent.setup();

      render(<ThemeEnhancedComponent />);

      const select = screen.getByRole("combobox");

      // Change to light
      await user.selectOptions(select, "light");
      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true);
        expect(document.documentElement.classList.contains("dark")).toBe(false);
      });

      // Change to dark
      await user.selectOptions(select, "dark");
      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
        expect(document.documentElement.classList.contains("light")).toBe(
          false,
        );
      });

      // Change to auto
      await user.selectOptions(select, "system");
      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(false);
        expect(document.documentElement.classList.contains("light")).toBe(
          false,
        );
      });
    });
  });

  describe("Additional Component Tests", () => {
    it("should work when localStorage is empty", () => {
      localStorage.removeItem("theme");

      render(<ThemeEnhancedComponent />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("system");
    });

    it("should support prop overrides", () => {
      render(<ThemeEnhancedComponent theme="dark" />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("dark");
    });

    it("should restore light theme correctly", async () => {
      localStorage.setItem("theme", "light");

      render(<ThemeEnhancedComponent />);

      await waitFor(() => {
        const select = screen.getByRole("combobox");
        expect(select).toHaveValue("light");
        expect(document.documentElement.classList.contains("light")).toBe(true);
      });
    });
  });
});

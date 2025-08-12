import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  theme_change,
  theme_reset,
  theme_setInitialState,
} from "~/components/theme/theme-logic";

describe("Theme Logic Unit Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset document classes
    document.documentElement.classList.remove("light", "dark");
  });

  describe("theme_change", () => {
    it("should change theme to light and save to localStorage", () => {
      const mockDispatch = vi.fn((updater) => {
        const newTheme = updater();
        expect(newTheme).toBe("light");
        return newTheme;
      });

      theme_change(mockDispatch, "light");

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem("theme")).toBe("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should change theme to dark and save to localStorage", () => {
      const mockDispatch = vi.fn((updater) => {
        const newTheme = updater();
        expect(newTheme).toBe("dark");
        return newTheme;
      });

      theme_change(mockDispatch, "dark");

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem("theme")).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });

    it("should change theme to auto and remove theme classes", () => {
      // Set initial theme
      document.documentElement.classList.add("dark");

      const mockDispatch = vi.fn((updater) => {
        const newTheme = updater();
        expect(newTheme).toBe("system");
        return newTheme;
      });

      theme_change(mockDispatch, "system");

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem("theme")).toBe("system");
      expect(document.documentElement.classList.contains("light")).toBe(false);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should not throw error when stateDispatch is null/undefined", () => {
      expect(() => theme_change(null as never, "light")).not.toThrow();
      expect(() => theme_change(undefined as never, "dark")).not.toThrow();
    });

    it("should handle localStorage.setItem errors gracefully", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage.setItem to throw an error using Object.defineProperty
      const originalSetItem = localStorage.setItem;
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          setItem: vi.fn(() => {
            throw new Error("localStorage quota exceeded");
          }),
        },
        writable: true,
      });

      const mockDispatch = vi.fn((updater) => {
        const newTheme = updater();
        expect(newTheme).toBe("light");
        return newTheme;
      });

      expect(() => theme_change(mockDispatch, "light")).not.toThrow();
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save theme to localStorage:",
        expect.any(Error),
      );

      // Restore original localStorage
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          setItem: originalSetItem,
        },
        writable: true,
      });
      consoleErrorSpy.mockRestore();
    });

    it("should switch from light to dark correctly", () => {
      // Set initial light theme
      document.documentElement.classList.add("light");

      const mockDispatch = vi.fn((updater) => {
        const newTheme = updater();
        expect(newTheme).toBe("dark");
        return newTheme;
      });

      theme_change(mockDispatch, "dark");

      expect(document.documentElement.classList.contains("light")).toBe(false);
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  describe("theme_reset", () => {
    it("should reset theme to auto and save to localStorage", () => {
      // Set initial theme
      document.documentElement.classList.add("dark");

      const mockDispatch = vi.fn((updater) => {
        const newTheme = updater();
        expect(newTheme).toBe("system");
        return newTheme;
      });

      theme_reset(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem("theme")).toBe("system");
      expect(document.documentElement.classList.contains("light")).toBe(false);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should not throw error when stateDispatch is null/undefined", () => {
      expect(() => theme_reset(null as never)).not.toThrow();
      expect(() => theme_reset(undefined as never)).not.toThrow();
    });

    it("should handle localStorage.setItem errors gracefully", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage.setItem to throw an error using Object.defineProperty
      const originalSetItem = localStorage.setItem;
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          setItem: vi.fn(() => {
            throw new Error("localStorage quota exceeded");
          }),
        },
        writable: true,
      });

      const mockDispatch = vi.fn((updater) => {
        const newTheme = updater();
        expect(newTheme).toBe("system");
        return newTheme;
      });

      expect(() => theme_reset(mockDispatch)).not.toThrow();
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save theme to localStorage:",
        "localStorage quota exceeded",
      );

      // Restore original localStorage
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          setItem: originalSetItem,
        },
        writable: true,
      });
      consoleErrorSpy.mockRestore();
    });

    it("should handle localStorage.setItem throwing DOMException", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage.setItem to throw a DOMException using Object.defineProperty
      const originalSetItem = localStorage.setItem;
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          setItem: vi.fn(() => {
            const domException = new DOMException(
              "Permission denied",
              "SecurityError",
            );
            throw domException;
          }),
        },
        writable: true,
      });

      const mockDispatch = vi.fn((updater) => {
        return updater();
      });

      expect(() => theme_reset(mockDispatch)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save theme to localStorage:",
        "Permission denied",
      );

      // Restore original localStorage
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          setItem: originalSetItem,
        },
        writable: true,
      });
      consoleErrorSpy.mockRestore();
    });
  });

  describe("theme_setInitialState", () => {
    it("should set initial state from localStorage when valid theme exists", () => {
      localStorage.setItem("theme", "dark");
      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() => theme_setInitialState(mockDispatch));

      expect(mockDispatch).toHaveBeenCalledWith("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      unmount();
    });

    it("should set initial state to auto when localStorage is empty", () => {
      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() => theme_setInitialState(mockDispatch));

      expect(mockDispatch).toHaveBeenCalledWith("system");
      expect(document.documentElement.classList.contains("light")).toBe(false);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      unmount();
    });

    it("should handle invalid localStorage values gracefully", () => {
      localStorage.setItem("theme", "invalid");
      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() => theme_setInitialState(mockDispatch));

      expect(mockDispatch).toHaveBeenCalledWith("system");
      expect(document.documentElement.classList.contains("light")).toBe(false);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      unmount();
    });

    it("should handle localStorage.getItem errors gracefully", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage.getItem to throw an error using Object.defineProperty
      const originalGetItem = localStorage.getItem;
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          getItem: vi.fn(() => {
            throw new Error("localStorage access denied");
          }),
        },
        writable: true,
      });

      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() => theme_setInitialState(mockDispatch));

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "localStorage not available:",
        "localStorage access denied",
      );

      // Restore original localStorage
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          getItem: originalGetItem,
        },
        writable: true,
      });
      consoleErrorSpy.mockRestore();
      unmount();
    });

    it("should handle localStorage.getItem throwing DOMException", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage.getItem to throw a DOMException using Object.defineProperty
      const originalGetItem = localStorage.getItem;
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          getItem: vi.fn(() => {
            const domException = new DOMException(
              "Access denied",
              "SecurityError",
            );
            throw domException;
          }),
        },
        writable: true,
      });

      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() => theme_setInitialState(mockDispatch));

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "localStorage not available:",
        "Access denied",
      );

      // Restore original localStorage
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          getItem: originalGetItem,
        },
        writable: true,
      });
      consoleErrorSpy.mockRestore();
      unmount();
    });

    it("should handle localStorage being completely unavailable", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage to be undefined (like in some environments)
      const originalLocalStorage = Object.getOwnPropertyDescriptor(
        global,
        "localStorage",
      );
      Object.defineProperty(global, "localStorage", {
        get() {
          throw new ReferenceError("localStorage is not defined");
        },
        configurable: true,
      });

      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() => theme_setInitialState(mockDispatch));

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "localStorage not available:",
        "localStorage is not defined",
      );

      // Restore original localStorage
      if (originalLocalStorage) {
        Object.defineProperty(global, "localStorage", originalLocalStorage);
      }

      consoleErrorSpy.mockRestore();
      unmount();
    });

    it("should properly set light theme from localStorage", () => {
      localStorage.setItem("theme", "light");
      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() => theme_setInitialState(mockDispatch));

      expect(mockDispatch).toHaveBeenCalledWith("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      unmount();
    });

    it("should properly set auto theme from localStorage", () => {
      localStorage.setItem("theme", "system");
      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() => theme_setInitialState(mockDispatch));

      expect(mockDispatch).toHaveBeenCalledWith("system");
      expect(document.documentElement.classList.contains("light")).toBe(false);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      unmount();
    });
  });
});

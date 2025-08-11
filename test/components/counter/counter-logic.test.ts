import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  counter_increment,
  counter_reset,
  counter_setInitialState,
} from "~/components/counter/counter-logic";

describe("Counter Logic Unit Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("counter_increment", () => {
    it("should increment count by 1 and save to localStorage", () => {
      const mockDispatch = vi.fn((updater) => {
        const currentCount = 5;
        const newCount = updater(currentCount);
        expect(newCount).toBe(6);
        return newCount;
      });

      counter_increment(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem("count")).toBe("6");
    });

    it("should handle increment from 0", () => {
      const mockDispatch = vi.fn((updater) => {
        const currentCount = 0;
        const newCount = updater(currentCount);
        expect(newCount).toBe(1);
        return newCount;
      });

      counter_increment(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem("count")).toBe("1");
    });

    it("should not throw error when stateDispatch is null/undefined", () => {
      expect(() => counter_increment(null as never)).not.toThrow();
      expect(() => counter_increment(undefined as never)).not.toThrow();
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
        const currentCount = 5;
        const newCount = updater(currentCount);
        expect(newCount).toBe(6);
        return newCount;
      });

      expect(() => counter_increment(mockDispatch)).not.toThrow();
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save to localStorage:",
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

    it("should handle localStorage.setItem throwing string errors", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage.setItem to throw a string using Object.defineProperty
      const originalSetItem = localStorage.setItem;
      Object.defineProperty(window, "localStorage", {
        value: {
          ...localStorage,
          setItem: vi.fn(() => {
            const stringError = "localStorage is disabled";
            throw stringError;
          }),
        },
        writable: true,
      });

      const mockDispatch = vi.fn((updater) => {
        const currentCount = 10;
        return updater(currentCount);
      });

      expect(() => counter_increment(mockDispatch)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save to localStorage:",
        "localStorage is disabled",
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

  describe("counter_reset", () => {
    it("should reset count to 0 and save to localStorage", () => {
      const mockDispatch = vi.fn((updater) => {
        const newCount = updater();
        expect(newCount).toBe(0);
        return newCount;
      });

      counter_reset(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem("count")).toBe("0");
    });

    it("should not throw error when stateDispatch is null/undefined", () => {
      expect(() => counter_reset(null as never)).not.toThrow();
      expect(() => counter_reset(undefined as never)).not.toThrow();
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
        const newCount = updater();
        expect(newCount).toBe(0);
        return newCount;
      });

      expect(() => counter_reset(mockDispatch)).not.toThrow();
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save to localStorage:",
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

      expect(() => counter_reset(mockDispatch)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save to localStorage:",
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

  describe("counter_setInitialState", () => {
    it("should set initial state from localStorage when value exists", () => {
      localStorage.setItem("count", "42");
      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() =>
        counter_setInitialState(mockDispatch),
      );

      expect(mockDispatch).toHaveBeenCalledWith(42);
      unmount();
    });

    it("should not set initial state when localStorage is empty", () => {
      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() =>
        counter_setInitialState(mockDispatch),
      );

      expect(mockDispatch).not.toHaveBeenCalled();
      unmount();
    });

    it("should handle invalid localStorage values gracefully", () => {
      localStorage.setItem("count", "invalid");
      const mockDispatch = vi.fn();

      const { unmount } = renderHook(() =>
        counter_setInitialState(mockDispatch),
      );

      expect(mockDispatch).toHaveBeenCalledWith(NaN);
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

      const { unmount } = renderHook(() =>
        counter_setInitialState(mockDispatch),
      );

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

      const { unmount } = renderHook(() =>
        counter_setInitialState(mockDispatch),
      );

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

      const { unmount } = renderHook(() =>
        counter_setInitialState(mockDispatch),
      );

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
  });
});

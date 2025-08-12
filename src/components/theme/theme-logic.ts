import type React from "react";
import { useLayoutEffect } from "react";

export type ThemeOption = "light" | "dark" | "system";

export const theme_change = (
  stateDispatch: React.Dispatch<React.SetStateAction<ThemeOption>>,
  newTheme: ThemeOption,
) => {
  if (!stateDispatch) return;
  stateDispatch(() => {
    try {
      localStorage.setItem("theme", newTheme);
      // Apply theme to document
      if (newTheme === "system") {
        // Remove explicit theme class and let system preference take over
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add("system");
      } else {
        document.documentElement.classList.remove("light", "dark", "system");
        document.documentElement.classList.add(newTheme);
      }
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
    return newTheme;
  });
};

export const theme_reset = (
  stateDispatch: React.Dispatch<React.SetStateAction<ThemeOption>>,
) => {
  if (!stateDispatch) return;
  stateDispatch(() => {
    try {
      localStorage.setItem("theme", "system");
      // Reset to system (user preference)
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add("system");
    } catch (error) {
      const errObject = error as Error;
      console.error("Failed to save theme to localStorage:", errObject.message);
    }
    return "system";
  });
};

const useTheme_setInitialState = (
  stateDispatch: React.Dispatch<React.SetStateAction<ThemeOption>>,
) => {
  useLayoutEffect(() => {
    const setInitialState = () => {
      try {
        const localStorageKey = "theme";
        const storedValue = localStorage.getItem(localStorageKey);
        if (
          storedValue &&
          (storedValue === "light" ||
            storedValue === "dark" ||
            storedValue === "system")
        ) {
          const theme = storedValue as ThemeOption;
          stateDispatch(theme);
          // Apply theme to document
          if (theme === "system") {
            document.documentElement.classList.remove("light", "dark");
          } else {
            document.documentElement.classList.remove(
              "light",
              "dark",
              "system",
            );
            document.documentElement.classList.add(theme);
          }
        } else {
          // Default to auto if no valid stored value
          stateDispatch("system");
          document.documentElement.classList.remove("light", "dark", "system");
          document.documentElement.classList.add("system");
        }
      } catch (error) {
        const errObject = error as Error;
        // Handle cases where localStorage is not available
        console.error("localStorage not available:", errObject.message);
      }
    };

    setInitialState();
  }, [stateDispatch]);
};

export const theme_setInitialState = useTheme_setInitialState;

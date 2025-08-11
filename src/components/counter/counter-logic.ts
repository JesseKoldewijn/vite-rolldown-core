import type React from "react";
import { useLayoutEffect } from "react";

export const counter_increment = (
  stateDispatch: React.Dispatch<React.SetStateAction<number>>,
) => {
  if (!stateDispatch) return;
  stateDispatch((count) => {
    const newCount = count + 1;
    try {
      localStorage.setItem("count", String(newCount));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
    return newCount;
  });
};

export const counter_reset = (
  stateDispatch: React.Dispatch<React.SetStateAction<number>>,
) => {
  if (!stateDispatch) return;
  stateDispatch(() => {
    try {
      localStorage.setItem("count", "0");
    } catch (error) {
      const errObject = error as Error;
      console.error("Failed to save to localStorage:", errObject.message);
    }
    return 0;
  });
};

const useCounter_setInitialState = (
  stateDispatch: React.Dispatch<React.SetStateAction<number>>,
) => {
  useLayoutEffect(() => {
    console.log("Counter initialization effect running");
    const setInitialState = () => {
      try {
        const localStorageKey = "count";
        const storedValue = localStorage.getItem(localStorageKey);
        if (storedValue) {
          stateDispatch(Number(storedValue));
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

export const counter_setInitialState = useCounter_setInitialState;

import { useCallback, useState } from "react";

import { ThemeDummyComponent, type ThemeDummyComponentProps } from "./theme";
import {
  type ThemeOption,
  theme_change,
  theme_reset,
  theme_setInitialState,
} from "./theme-logic";

export const ThemeEnhancedComponent = (props: ThemeDummyComponentProps) => {
  const [theme, setTheme] = useState<ThemeOption>("system");

  // Use the hook directly in the component instead of in onMount callback
  theme_setInitialState(setTheme);

  const onThemeChange = useCallback(
    (newTheme: ThemeOption) => theme_change(setTheme, newTheme),
    [],
  );
  const onReset = useCallback(() => theme_reset(setTheme), []);

  const mergedProps = {
    theme,
    onThemeChange,
    onReset,
  };

  return ThemeDummyComponent({ ...mergedProps, ...props });
};

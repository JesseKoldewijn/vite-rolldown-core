import type { ThemeOption } from "./theme-logic";

export interface ThemeDummyComponentProps {
  theme?: ThemeOption;
  onThemeChange?: (theme: ThemeOption) => void;
  onReset?: () => void;
}

export const ThemeDummyComponent = (props: ThemeDummyComponentProps) => {
  const {
    theme = "system",
    onThemeChange = () => {},
    onReset = () => {},
  } = props;

  const themes: { value: ThemeOption; label: string }[] = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  return (
    <div className="flex items-center justify-center gap-2">
      <select
        value={theme}
        onChange={(e) => onThemeChange(e.target.value as ThemeOption)}
        className="bg-foreground text-background cursor-pointer rounded p-2"
      >
        {themes.map((themeOption) => (
          <option key={themeOption.value} value={themeOption.value}>
            {themeOption.label}
          </option>
        ))}
      </select>
      <button
        className="bg-foreground text-background cursor-pointer rounded p-2"
        onClick={() => onReset()}
      >
        Reset Theme
      </button>
    </div>
  );
};

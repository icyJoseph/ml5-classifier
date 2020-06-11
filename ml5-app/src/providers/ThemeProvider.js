import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef
} from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";

const ThemeCtx = React.createContext();

const query = "(prefers-color-scheme: dark)";

const readSavedThemeMode = () => {
  const saved = localStorage.getItem("theme");
  if (saved === null) {
    return window.matchMedia(query).matches;
  }
  return saved !== "light";
};

function saveIfNotPrefered({ mode }) {
  const prefersDark = window.matchMedia(query).matches;

  const themeIsDarkAndUserPrefersDark = prefersDark && mode === "dark";
  const themeIsLightAndUserPrefersLight = !prefersDark && mode === "light";

  const shouldRemoveFromStorage =
    themeIsDarkAndUserPrefersDark || themeIsLightAndUserPrefersLight;

  if (shouldRemoveFromStorage) {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", mode);
  }
}

export function ThemeProvider({ children, theme }) {
  const [checked, setChecked] = useState(() => readSavedThemeMode());
  const mode = useMemo(() => (checked ? "dark" : "light"), [checked]);
  const themeRef = useRef(theme);

  useEffect(() => {
    const handler = ({ matches }) => {
      localStorage.removeItem("theme");
      setChecked(matches);
    };

    const media = window.matchMedia(query);

    media.addListener(handler);

    return () => media.removeListener(handler);
  });

  useEffect(() => {
    saveIfNotPrefered({ mode });
  }, [mode]);

  const toggleMode = useCallback(() => setChecked((x) => !x), []);

  const value = useMemo(() => [checked, toggleMode, mode], [
    checked,
    mode,
    toggleMode
  ]);

  const selectedTheme = useMemo(() => themeRef.current[mode], [mode]);

  return (
    <ThemeCtx.Provider value={value}>
      <SCThemeProvider theme={selectedTheme}>
        <>{children}</>
      </SCThemeProvider>
    </ThemeCtx.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeCtx);
}

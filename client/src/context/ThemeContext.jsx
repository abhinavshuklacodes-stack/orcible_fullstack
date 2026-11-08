import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "orcible-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || "system");

  useEffect(() => {
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggle() {
    setTheme((current) => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const effectiveCurrent = current === "system" ? (prefersDark ? "dark" : "light") : current;
      return effectiveCurrent === "dark" ? "light" : "dark";
    });
  }

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

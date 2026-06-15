import { useState, useEffect, createContext, useContext } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("mc-theme") || "dark"; } catch { return "dark"; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("mc-theme", theme); } catch {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/* All colour tokens — used as inline styles everywhere */
export function tok(isDark) {
  return isDark ? {
    pageBg: "#111110", surfaceBg: "#151513", surfaceBg2: "#1a1a18",
    navBg: "rgba(17,17,16,0.88)", altBg: "#0d0d0b",
    border: "rgba(255,255,255,0.08)", borderSt: "rgba(255,255,255,0.16)",
    borderGrid: "rgba(255,255,255,0.06)",
    text: "#f0ede4", textSub: "#e8e6df", textMuted: "#a8a69f",
    textFaint: "#666460", textTiny: "#555452", textGhost: "#444240",
    accent: "#5DCAA5", accentSolid: "#1D9E75",
    accentBg: "rgba(29,158,117,0.12)", accentBorder: "rgba(29,158,117,0.3)",
    danger: "#F0997B", dangerBg: "rgba(240,153,123,0.12)",
    amber: "#FAC775", amberBg: "rgba(250,199,117,0.12)",
    gridLine: "rgba(255,255,255,0.03)", orb: "rgba(29,158,117,0.12)",
    pillBg: "rgba(255,255,255,0.06)", pillText: "#888680", inputBg: "#1a1a18",
  } : {
    pageBg: "#f8f7f3", surfaceBg: "#ffffff", surfaceBg2: "#f0ede8",
    navBg: "rgba(248,247,243,0.88)", altBg: "#eeecea",
    border: "rgba(0,0,0,0.08)", borderSt: "rgba(0,0,0,0.16)",
    borderGrid: "rgba(0,0,0,0.05)",
    text: "#1a1a18", textSub: "#2a2a28", textMuted: "#555452",
    textFaint: "#888680", textTiny: "#999794", textGhost: "#bbb9b2",
    accent: "#0F6E56", accentSolid: "#1D9E75",
    accentBg: "rgba(29,158,117,0.10)", accentBorder: "rgba(29,158,117,0.35)",
    danger: "#D85A30", dangerBg: "rgba(216,90,48,0.10)",
    amber: "#B87010", amberBg: "rgba(184,112,16,0.10)",
    gridLine: "rgba(0,0,0,0.04)", orb: "rgba(29,158,117,0.10)",
    pillBg: "rgba(0,0,0,0.05)", pillText: "#666460", inputBg: "#ffffff",
  };
}

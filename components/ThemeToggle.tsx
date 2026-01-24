"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="
  px-3 py-1 rounded-md border
  border-slate-300 dark:border-slate-700
  text-sm
  text-slate-700 dark:text-slate-200
  hover:bg-slate-200 dark:hover:bg-slate-700
"

    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

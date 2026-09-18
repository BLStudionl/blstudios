import { $, $$ } from "./utils.js";

const KEY = "bl-theme";
const META = { dark: "#08080A", light: "#F6F3EF" };

export function initTheme() {
  const root = document.documentElement;
  const buttons = $$("[data-theme-toggle]");
  if (!buttons.length) return;

  const current = () => (root.getAttribute("data-theme") === "light" ? "light" : "dark");

  const paint = () => {
    const theme = current();
    const next = theme === "light" ? "donkere" : "lichte";
    buttons.forEach((b) => {
      b.setAttribute("aria-pressed", String(theme === "light"));
      b.setAttribute("aria-label", `Schakel naar ${next} weergave`);
    });
    $$("[data-theme-label]").forEach((l) => {
      l.textContent = theme === "light" ? "Donkere weergave" : "Lichte weergave";
    });
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META[theme]);
  };

  const set = (theme) => {
    theme === "light" ? root.setAttribute("data-theme", "light") : root.removeAttribute("data-theme");
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    paint();
  };

  buttons.forEach((b) => b.addEventListener("click", () => set(current() === "light" ? "dark" : "light")));

  // Follow the system only while the visitor has not chosen for themselves.
  if (root.dataset.themeConfig === "system") {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
      let chosen = null;
      try { chosen = localStorage.getItem(KEY); } catch (err) {}
      if (!chosen) (e.matches ? set("light") : set("dark"));
    });
  }

  paint();
}

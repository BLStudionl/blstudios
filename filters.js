import { $, $$ } from "./utils.js";

export function initFilters() {
  const bar = $("#workFilters");
  const grid = $("#workGrid");
  const empty = $("#workEmpty");
  if (!bar || !grid) return;

  const apply = (value) => {
    let shown = 0;
    $$(".work-item", grid).forEach((item) => {
      const match = value === "all" || item.dataset.filter === value;
      item.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.classList.toggle("hide", shown > 0);
    const url = new URL(location.href);
    value === "all" ? url.searchParams.delete("soort") : url.searchParams.set("soort", value);
    history.replaceState({}, "", url);
  };

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    $$("button", bar).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    apply(btn.dataset.filter);
  });

  // Deep link: /work/?soort=podcast
  const initial = new URL(location.href).searchParams.get("soort");
  const target = initial && bar.querySelector(`[data-filter="${CSS.escape(initial)}"]`);
  if (target) target.click();
}

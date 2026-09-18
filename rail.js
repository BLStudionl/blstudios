import { $, $$, reduceMotion } from "./utils.js";

export function initRail() {
  const rail = $("#homeRail");
  if (!rail) return;
  $$("[data-rail]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const card = rail.querySelector(".card");
      const step = card ? card.getBoundingClientRect().width + 16 : 260;
      rail.scrollBy({
        left: btn.dataset.rail === "next" ? step : -step,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    })
  );
}

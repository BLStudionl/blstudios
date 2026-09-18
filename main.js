import { initHeader, initMobileNav } from "./nav.js";
import { initReveals } from "./reveal.js";
import { initRail } from "./rail.js";
import { initFilters } from "./filters.js";
import { initShowreel, initBooking } from "./showreel.js";
import { initCursor } from "./cursor.js";
import { initContactFlow } from "./contact-form.js";
import { initTheme } from "./theme.js";
import { initCaseVideo } from "./video.js";

initHeader();
initMobileNav();
initReveals();
initRail();
initFilters();
initShowreel();
initBooking();
initCursor();
initContactFlow();
initTheme();
initCaseVideo();

requestAnimationFrame(() => document.body.classList.add("loaded"));

/* Loaded synchronously in <head>: sets the theme before the first paint,
   so there is no flash of the wrong colour scheme. */
(function () {
  try {
    var root = document.documentElement;
    var saved = localStorage.getItem("bl-theme");
    var cfg = root.dataset.themeConfig || "dark";
    var theme = saved;
    if (!theme && cfg === "system") {
      theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    if (!theme) theme = cfg === "light" ? "light" : "dark";
    if (theme === "light") root.setAttribute("data-theme", "light");
  } catch (e) {}
})();

export const $  = (s, c = document) => c.querySelector(s);
export const $$ = (s, c = document) => [...c.querySelectorAll(s)];
export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
